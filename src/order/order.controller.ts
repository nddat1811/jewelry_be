import {
  ERROR_UNAUTHORIZED,
  UserRole,
} from "../helpers/constant";
import { returnResponse } from "../helpers/response";
import { Request, Response } from "express";
import { CreateOrderDto } from "./dto/create_product.dto";
import { orderDetailService } from "./order.service";
import { userRepository } from "../user/user.repository";


const creatNewOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const createOrder: CreateOrderDto = req.body;
    console.log(createOrder);
    const [newOrder, code, msg] = await orderDetailService.createNewOrderDetail(
      +userId,
      createOrder
    );
    res.send(returnResponse(code, msg, newOrder));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/order/list:
 *   get:
 *     summary: Get list order of current user
 *     responses:
 *       '200':
 *         description: Get list order successfully
 *       '400':
 *         description: Can't get list order.
 */
const getListOrderUser = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    // const createOrder: CreateOrderDto = req.body;
    const [listOrder, code, msg] = await orderDetailService.getListOrderUser(
      +userId
    );
    res.send(returnResponse(code, msg, listOrder));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @swagger
 * /v1/order/detail/{id}:
 *   get:
 *     summary: Get order detail by ID
 *     description: Retrieve a product based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *           default: 1
 */
const getOrderDetailById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const orderId = req.params.id;
    const [orderDetail, code, msg] =
      await orderDetailService.getOrderDetailById(+orderId);
    res.send(returnResponse(code, msg, orderDetail));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/order/update/{id}:
 *   put:
 *     summary: Update product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to retrieve
 *         schema:
 *           type: string
 *           default: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The product code.
 *                 default: "Vận chuyển"
 */
const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    //@ts-ignore
    const userId = req.userId;
    const status: string = req.body.status;
    const orderId = req.params.id;

    const user = await userRepository.getDetailUserById(userId, false);
    if (user?.role != UserRole.ADMIN) {
      res.send(returnResponse(ERROR_UNAUTHORIZED, "Only admin can edit", null));
      return;
    }
    const [updatedOrder, code, msg] = await orderDetailService.updateOrder(
      +orderId,
      status
    );
    res.send(returnResponse(code, msg, updatedOrder));
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
export { creatNewOrder, getListOrderUser, getOrderDetailById, updateOrder };
