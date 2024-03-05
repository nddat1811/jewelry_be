import {
  ERROR_BAD_REQUEST,
} from "../../helpers/constant";
import { returnResponse } from "../../helpers/response";
import { Request, Response } from "express";
import { cartItemService } from "./cart_item.service";
/**
 * @openapi
 * /v1/cart_item/update_cart:
 *   put:
 *     summary: Update cartItem in cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: The product code.
 *                 default: 1
 *               size:
 *                 type: string
 *                 description: The product name.
 *                 default: "Free size"
 *               quantity:
 *                 type: number
 *                 description: The product name.
 *                 default: 1

 *     responses:
 *       '200':
 *         description: Update Item in cart has been successfully returned
 *       '400':
 *         description: Error
 */
const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size ) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid request body", null));
      return;
    }

    const [cartItem, code, msg] = await cartItemService.updateCartItem(productId, userId,  size, quantity);
    res.send(returnResponse(code, msg, cartItem));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
/**
 * @openapi
 * /v1/cart_item/add_cart:
 *   post:
 *     summary: add product into cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: The product code.
 *                 default: 1
 *               size:
 *                 type: string
 *                 description: The product name.
 *                 default: "Free size"
 *               quantity:
 *                 type: number
 *                 description: The product name.
 *                 default: 1

 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const { productId, quantity, size } = req.body;

    if (!productId || !quantity || !size) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid request body", null));
      return;
    }

    const [cartItem, code, msg] = await cartItemService.addToCart(productId, userId,  size, quantity);
    res.send(returnResponse(code, msg, cartItem));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/cart_item/delete:
 *   delete:
 *     summary: delete product into cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: number
 *                 description: The product code.
 *                 default: 1
 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const deleteItemInCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const { productId} = req.body;

    if (!productId) {
      res.send(returnResponse(ERROR_BAD_REQUEST, "Invalid request body", null));
      return;
    }

    const [cartItem, code, msg] = await cartItemService.deleteCartItem(productId, userId);
    res.send(returnResponse(code, msg, cartItem));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/cart_item/list:
 *   get:
 *     summary: get list item in cart
 *     responses:
 *       '200':
 *         description: The data of the product list has been successfully returned
 *       '400':
 *         description: The returned data is unsuccessful.
 */
const getListItemInCart = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;

    const [cartItem, code, msg] = await cartItemService.getListItemInCart(userId);
    res.send(returnResponse(code, msg, cartItem));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
export {  addToCart, updateCart, deleteItemInCart, getListItemInCart };
