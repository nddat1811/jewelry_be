import { addressRepository } from "./address.repository";
import CreateAddressDto from "./dto/create_address.dto";
import { Address } from "./entity/address";
import { getManager, EntityManager } from "typeorm";

class AddressService {
  async getListAddress(id: number): Promise<Array<Address> | null> {
    try {
      const listAddress = await addressRepository.getListAddress(id);

      return listAddress;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching product addresses:", error);
      throw error;
    }
  }
  async createAddress(
    userId: number,
    createAddressDto: CreateAddressDto
  ): Promise<[Address | null, Error | null]> {
    const entityManager: EntityManager = getManager();

    try {
      let listAddress: Address[] = [];
      // Bắt đầu transaction
      const [result, err] = await entityManager.transaction(
        async (transactionalEntityManager) => {
          const [existingAddress, err] =
            await addressRepository.checkExistAddress(userId, createAddressDto);

          if (existingAddress) {
            // Address with similar details already exists, return an error
            return [null, Error("Address already exists")];
          }

          if (createAddressDto.isDefault) {
            listAddress =
              (await addressRepository.getListAddress(userId)) ?? [];

            const updatePromises = listAddress.map((address) => {
              return addressRepository.updateAddress({
                ...address,
                isDefault: false,
              });
            });

            await Promise.all(updatePromises);
          }

          const { address: createdAddress, error } =
            await addressRepository.createNewAddress(userId, createAddressDto);

          if (error) {
            // Nếu có lỗi, throw error để kích hoạt rollback
            return [null, Error("Can't create new address")];
          }

          // Transaction tự động commit nếu không có lỗi
          return [createdAddress, error];
        }
      );

      return [result, err]; // Return the result of the transaction
    } catch (error) {
      console.error("Error creating address", error);
      throw error;
    }
  }
  async updateAddress(
    addressId: number,
    userId: number,
    updateAddressDto: CreateAddressDto
  ): Promise<[Address | null, Error | null]> {
    try {
      const [existingAddress, err] = await addressRepository.findAddressByID(
        addressId,
        userId
      );
      if (err) {
        return [null, err];
      }
      if (!existingAddress) {
        return [null, Error("Address not found")];
      }

      const { isDefault, ...restUpdateAddressDto } = updateAddressDto;

      const dataAddress = { ...existingAddress, ...restUpdateAddressDto };

      const entityManager: EntityManager = getManager();

      const [result, error] = await entityManager.transaction(
        async (transactionalEntityManager) => {
          const [existingAddress, err] =
            await addressRepository.checkExistAddress(userId, dataAddress);

          if (existingAddress) {
            // Address with similar details already exists, return an error
            return [null, Error("Address already exists")];
          }

          const [updatedAddress, error] = await addressRepository.updateAddress(
            dataAddress
          );
          // Transaction tự động commit nếu không có lỗi
          return [updatedAddress, error];
        }
      );

      return [result, error];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
  async setDefaultAddress(
    addressId: number,
    userId: number,
    flag: boolean
  ): Promise<[Address | null, Error | null]> {
    try {
      const [existingAddress, error] = await addressRepository.findAddressByID(
        addressId,
        userId
      );
      if (error) {
        return [null, error];
      }
      if (!existingAddress) {
        return [null, Error("Address not found")];
      }
      if (existingAddress.isDefault == flag) {
        return [null, Error("Nothing change in default")];
      }
      if (existingAddress.isDefault && !flag) {
        return [null, Error("Please set default for another address")];
      }

      const dataAddresss = { ...existingAddress, isDefault: flag };

      let listAddress: Address[] = [];

      const entityManager: EntityManager = getManager();

      const [result, err] = await entityManager.transaction(
        async (transactionalEntityManager) => {
          listAddress = (await addressRepository.getListAddress(userId)) ?? [];

          const updatePromises = listAddress.map((address) => {
            return addressRepository.updateAddress({
              ...address,
              isDefault: false,
            });
          });

          await Promise.all(updatePromises);

          const [updatedAddress, error] = await addressRepository.updateAddress(
            dataAddresss
          );
          // Transaction tự động commit nếu không có lỗi
          return [updatedAddress, error];
        }
      );

      if (err) {
        // Nếu có lỗi, throw error để kích hoạt rollback
        return [null, Error("Can't set default address")];
      }

      return [result, null];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const addressService = new AddressService();

export { addressService };
