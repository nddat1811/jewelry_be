import { getManager, getRepository } from "typeorm";
import { CartItem } from "../../models";

class CartItemRepository {
  async isProductInCart(
    productId: number,
    userId: number,
    size: string
  ): Promise<CartItem | null> {
    const cartItemRepository = getRepository(CartItem);

    try {
      const queryBuilder = cartItemRepository
        .createQueryBuilder("cart_item")
        .leftJoin("cart_item.product", "product")
        .leftJoin("cart_item.cart", "cart")
        .select(["cart_item", "cart.user", "product"])
        .where(
          `product.id = (:productId) AND product.size = (:size)
         AND cart.user = (:userId)`,
          {
            productId: productId,
            size: size,
            userId: userId,
          }
        );

      const existProduct = await queryBuilder.getOne();
      return existProduct;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async createNewItem(
    quantity: number,
    price: number,
    productId: number,
    cartId: number
  ): Promise<CartItem | null> {
    const cartItemRepository = getRepository(CartItem);

    try {
      const newCartItem = cartItemRepository.create({
        cart: { id: cartId },
        product: { id: productId },
        price: price,
        quantity: quantity,
      });
      const createdCartItem = await cartItemRepository.save(newCartItem);
      console.log("ok: ", createdCartItem);

      return createdCartItem;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async updateCartItem(updateCartItem: CartItem): Promise<CartItem | null> {
    const userRepository = getRepository(CartItem);
    try {
      const updatedCartItem = await userRepository.save(updateCartItem);

      return updatedCartItem;
    } catch (error) {
      console.error("Error creating user", error);
      throw error;
    }
  }
  async deleteCartItem(
    productId: number,
    userId: number
  ): Promise<CartItem | null> {
    const cartItemRepository = getRepository(CartItem);

    try {
      const queryBuilder = cartItemRepository
        .createQueryBuilder("cart_item")
        .leftJoin("cart_item.product", "product")
        .leftJoin("cart_item.cart", "cart")
        .select(["cart_item", "cart.user", "product"])
        .where(
          `product.id = (:productId)
         AND cart.user = (:userId)`,
          {
            productId: productId,
            userId: userId,
          }
        );
      const cartItem = await queryBuilder.getOne();
      if (!cartItem) {
        return null; // Không tìm thấy sản phẩm trong giỏ hàng
      }

      const entityManager = getManager();
      await entityManager.delete(CartItem, cartItem.id);

      return cartItem;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
  async getListItemInCart(userId: number): Promise<Array<CartItem> | null> {
    const cartItemRepository = getRepository(CartItem);

    try {
      const queryBuilder = cartItemRepository
        .createQueryBuilder("cart_item")
        .leftJoin("cart_item.product", "product")
        .leftJoin("cart_item.cart", "cart")
        .select(["cart_item", "cart.user", "product"])
        .where(`cart.user = (:userId)`, {
          userId: userId,
        });
      const cartItem = await queryBuilder.getMany();

      if (cartItem.length == 0) {
        return null; // Không tìm thấy sản phẩm trong giỏ hàng
      }

      return cartItem;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
}

const cartItemRepository = new CartItemRepository();
export { cartItemRepository };
