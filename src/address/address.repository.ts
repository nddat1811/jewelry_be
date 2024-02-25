import { getRepository } from "typeorm";

import { Address } from "../models";
import CreateAddressDto from "./dto/create_address.dto";
import { userRepository } from "../user/user.repository";

class AddressRepository {
  async getListAddress(id: number): Promise<Array<Address> | null> {
    const addressRepository = getRepository(Address);
    try {
      const listAddress = await addressRepository
        .createQueryBuilder("address")
        .leftJoin("address.user", "user")
        .select(["address", "user.id", "user.name"])
        .where("user.id = :userId", { userId: id })
        .orderBy("address.isDefault", "DESC")
        .getMany();

      return listAddress;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching product addresses:", error);
      throw error;
    }
  }

  async createNewAddress(
    userId: number,
    address: CreateAddressDto
  ): Promise<{ address: Address | null; error: Error | null }> {
    const addressRepository = getRepository(Address);
    const user = await userRepository.getDetailUserById(userId, false); // flag false --> 0 query thêm payment và address
    try {
      if (!user) {
        // Handle the case where the user is not found
        return { address: null, error: Error("User not found") };
      }
      const newAddress = addressRepository.create({
        ...address,
        user: user,
      });
      const createdAddress = await addressRepository.save(newAddress);

      return { address: createdAddress, error: null };
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error create product address:", error);
      throw error;
    }
  }

  async updateAddress(
    address: Address
  ): Promise<[Address | null, Error | null]> {
    const addressRepository = getRepository(Address);
    try {
      const updatedAddress = await addressRepository.save(address);

      return [updatedAddress, null];
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error update product address:", error);
      throw error;
    }
  }

  async checkExistAddress(
    userId: number,
    address: CreateAddressDto
  ): Promise<[boolean, Error | null]> {
    const addressRepository = getRepository(Address);
    const user = await userRepository.getDetailUserById(userId, false);
    try {
      if (!user) {
        // Handle the case where the user is not found
        return [false, new Error("User not found")];
      }
      const existingAddress = await addressRepository.findOne({
        where: {
          user: { id: user.id }, // Use the user id instead of the user object
          street: address.street,
          city: address.city,
          name: address.name,
          phone: address.phone,
        },
      });

      return [!!existingAddress, null]; // Return true if the address exists, false otherwise
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error checking if address exists:", error);
      throw error;
    }
  }

  async findAddressByID(
    addressId: number,
    userId: number
  ): Promise<[Address | null, Error | null]> {
    const addressRepository = getRepository(Address);
    const user = await userRepository.getDetailUserById(userId, false);
    try {
      if (!user) {
        return [null, new Error("User not found")];
      }

      const existingAddress = await addressRepository.findOne({
        where: {
          user: { id: user.id }, // Use the user id instead of the user object
          id: addressId,
        },
      });

      return [existingAddress, null]; // Return true if the address exists, false otherwise
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error checking if address exists:", error);
      throw error;
    }
  }
}

const addressRepository = new AddressRepository();
export { addressRepository };
