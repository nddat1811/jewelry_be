import { getRepository } from "typeorm";
import { Cart } from "../models";

class CartRepository {
  async checkCartExist(userId: number): Promise<Cart | null> {
    const cartRepository = getRepository(Cart);

    try {
      const checkExist = cartRepository.findOneBy({
        user: { id: userId },
      });

      return checkExist;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async createNewCart(userId: number): Promise<Cart | null> {
    const cartRepository = getRepository(Cart);

    try {
      const newCart = cartRepository.create({
        user: { id: userId },
      });

      const createdCart = await cartRepository.save(newCart);
      return createdCart;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

}

const cartRepository = new CartRepository();
export { cartRepository };
