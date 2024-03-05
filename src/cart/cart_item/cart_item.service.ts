import { CartItem } from "../../models";
import { cartItemRepository } from "./cart_item.repository";
import { cartRepository } from "../cart.repository";
import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
} from "../../helpers/constant";
import { productRepository } from "../../product/product.repository";

class CartItemService {
  private checkQuantityError(
    quantity: number,
    inventoryQuantity: number
  ): [CartItem | null, number, string] | null {
    if (quantity > inventoryQuantity) {
      return [
        null,
        ERROR_BAD_REQUEST,
        `The max quantity: ${inventoryQuantity}`,
      ];
    }
    return null;
  }
  private async createOrUpdateCartItem(
    productId: number,
    userId: number,
    size: string,
    quantity: number,
    updateOnly: boolean
  ): Promise<[CartItem | null, number, string]> {
    try {
      const product = await productRepository.findProductById(productId);
      const checkCartExist = await cartRepository.checkCartExist(userId);

      if (!checkCartExist) {
        if (updateOnly) {
          return [null, ERROR_BAD_REQUEST, "Invalid user with cart"];
        }
        const cart = await cartRepository.createNewCart(userId);

        if (!cart?.id || !product) {
          return [
            null,
            ERROR_BAD_REQUEST,
            "Can't create new cart or can't find product",
          ];
        }

        const quantityError = this.checkQuantityError(
          quantity,
          //@ts-ignore
          product?.inventory?.quantity
        );

        if (quantityError) {
          return quantityError;
        }
        const totalPrice = +product.price * quantity;
        const newCartItem = await cartItemRepository.createNewItem(
          quantity,
          +totalPrice.toFixed(2),
          +productId,
          cart.id
        );

        return [
          newCartItem,
          CODE_SUCCESS,
          "Add to cart has been successfully returned",
        ];
      } else {
        let checkProductExist = await cartItemRepository.isProductInCart(
          +productId,
          userId,
          size
        );

        if (updateOnly && !checkProductExist) {
          return [null, ERROR_BAD_REQUEST, "Product not found in the cart"];
        }

        if (!checkProductExist) {
          //@ts-ignore
          const totalPrice = +product.price * quantity;
          checkProductExist = await cartItemRepository.createNewItem(
            quantity,
            +totalPrice.toFixed(2),
            +productId,
            checkCartExist.id
          );
        } else {
          if (updateOnly) {
            (checkProductExist as CartItem).quantity = quantity;
          } else {
            (checkProductExist as CartItem).quantity += quantity;
          }
          const totalPrice = checkProductExist.quantity * (product?.price || 0);
          (checkProductExist as CartItem).price = +totalPrice.toFixed(2);

          const quantityError = this.checkQuantityError(
            checkProductExist.quantity,
            //@ts-ignore
            product?.inventory?.quantity
          );

          if (quantityError) {
            return quantityError;
          }

          checkProductExist = await cartItemRepository.updateCartItem(
            checkProductExist
          );
        }

        const message = updateOnly
          ? "Update Item in cart has been successfully returned"
          : "Add to cart has been successfully returned";

        return [checkProductExist, CODE_SUCCESS, message];
      }
    } catch (error) {
      console.error("Error while processing cart items:", error);
      return [null, 500, "Internal Server Error"];
    }
  }

  async addToCart(
    productId: number,
    userId: number,
    size: string,
    quantity: number
  ): Promise<[CartItem | null, number, string]> {
    return this.createOrUpdateCartItem(
      productId,
      userId,
      size,
      quantity,
      false
    );
  }

  async updateCartItem(
    productId: number,
    userId: number,
    size: string,
    quantity: number
  ): Promise<[CartItem | null, number, string]> {
    return this.createOrUpdateCartItem(productId, userId, size, quantity, true);
  }

  async deleteCartItem(
    productId: string,
    userId: number
  ): Promise<[CartItem | null, number, string]> {
    const deletedItem = await cartItemRepository.deleteCartItem(
      +productId,
      userId
    );
    if (deletedItem) {
      return [deletedItem, CODE_SUCCESS, "Deleted item successfully"];
    }
    return [null, ERROR_BAD_REQUEST, "Can't find item to delete"];
  }

  async getListItemInCart(
    userId: number
  ): Promise<[Array<CartItem> | null, number, string]> {
    const listItemInCart = await cartItemRepository.getListItemInCart(userId);
    if (!listItemInCart) {
      return [null, ERROR_BAD_REQUEST, "Can't get list item in cart"];
    }
    return [listItemInCart, CODE_SUCCESS, "Get list item in cart successfully"];
  }
}

const cartItemService = new CartItemService();

export { cartItemService };
