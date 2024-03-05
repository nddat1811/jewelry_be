import {
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
  OrderStatus,
} from "../helpers/constant";
import { CreateOrderDto } from "./dto/create_product.dto";
import { OrderDetail, OrderItem } from "../models";
import { orderDetailRepository } from "./order.repository";
import { orderItemRepository } from "./order_item/order_item.repository";
import { cartItemRepository } from "../cart/cart_item/cart_item.repository";
import {  getConnection, getManager } from "typeorm";
import { productInventoryRepository } from "../inventory/inventory.repository";

const statusOrder: Record<string, number> = {
  [OrderStatus.WAIT_PAYMENT]: 1,
  [OrderStatus.WAIT_DELIVER]: 2,
  [OrderStatus.DELIVER]: 3,
  [OrderStatus.FINISHED]: 4,
  [OrderStatus.CANCELED]: 5,
  [OrderStatus.REFUND]: 6,
};

function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  return statusOrder[newStatus] > statusOrder[currentStatus];
}
class OrderDetailService {
  async createNewOrderDetail(
    userId: number,
    createOrder: CreateOrderDto
  ): Promise<[OrderDetail | null, number, string]> {
    return getConnection().transaction(async (transactionalEntityManager) => {

      try {
        const createdNewOrderDetail =
          await orderDetailRepository.createNewOrderDetail(
            createOrder,
            userId,
            transactionalEntityManager
          );

        if (!createdNewOrderDetail) {
          return [null, ERROR_BAD_REQUEST, "Can't create new order detail"];
        }

        const orderItemPromises = createOrder.items.map(async (item) => {
          const newOrderItem = await orderItemRepository.createNewOderItem(
            item.quantity,
            item.price,
            item.product_id,
            createdNewOrderDetail.id,
            transactionalEntityManager
          );

          if (!newOrderItem) {
            transactionalEntityManager.query("ROLLBACK");
            return [
              null,
              ERROR_BAD_REQUEST,
              `Can't create new order item ${item.product_id}`,
            ];
          }
          // Assuming cartItemRepository has a method to delete a cart item
          const del = await cartItemRepository.deleteCartItem(
            item.product_id,
            userId
          );
          if (!del) {
            transactionalEntityManager.query("ROLLBACK");
            return [
              null,
              ERROR_BAD_REQUEST,
              `Can't delete item ${item.product_id} in cart`,
            ];
          }

          const editQuantity = await productInventoryRepository.editInventory(
            item.product_id,
            item.quantity,
            transactionalEntityManager
          );
          if (!editQuantity) {
            transactionalEntityManager.query("ROLLBACK");
            return [
              null,
              ERROR_BAD_REQUEST,
              `Can't edit quantity item ${item.product_id} in cart`,
            ];
          }
        });

        await Promise.all(orderItemPromises);

        return [
          createdNewOrderDetail,
          CODE_SUCCESS,
          "Order created successfully",
        ];
      } catch (error) {
        // If any error occurs, the transaction will be rolled back
        console.error("Error creating new order", error);
        return [null, ERROR_BAD_REQUEST, "Error creating new order"];
      }
    });
  }

  async getOrderDetailById(
    orderId: number
  ): Promise<[OrderDetail | null, number, string]> {
    const transactionalEntityManager = getManager(); // Replace with your method of obtaining the EntityManager
    const orderDetail = await orderDetailRepository.getOrderDetailById(
      orderId,
      transactionalEntityManager
    );
    if (!orderDetail) {
      return [null, ERROR_BAD_REQUEST, `Can't get order ${orderId}`];
    }
    return [orderDetail, CODE_SUCCESS, "Get list order successfully"];
  }
  async getListOrderUser(
    userId: number
  ): Promise<[Array<OrderDetail> | null, number, string]> {
    const transactionalEntityManager = getManager(); // Replace with your method of obtaining the EntityManager
    const listOrder = await orderDetailRepository.getListOrderUser(
      userId,
      transactionalEntityManager
    );
    if (!listOrder || listOrder.length == 0) {
      return [null, ERROR_BAD_REQUEST, "Can't get list order"];
    }
    return [listOrder, CODE_SUCCESS, "Get list order successfully"];
  }
  async updateOrder(
    orderId: number,
    newStatus: string
  ): Promise<[OrderDetail | null, number, string]> {
    if (!Object.values(OrderStatus).includes(newStatus as OrderStatus)) {
      return [null, ERROR_BAD_REQUEST, "Status passed is invalid"];
    }
    const transactionalEntityManager = getManager(); // Replace with your method of obtaining the EntityManager
    const orderDetail = await orderDetailRepository.getOrderDetailById(
      orderId,
      transactionalEntityManager
    );
    if (!orderDetail) {
      return [null, ERROR_BAD_REQUEST, `Can't get order ${orderId}`];
    }

    if (
      orderDetail?.status == OrderStatus.CANCELED ||
      orderDetail?.status == OrderStatus.FINISHED
    ) {
      return [
        null,
        ERROR_BAD_REQUEST,
        "This order has already canceled or finished",
      ];
    }
    //@ts-ignore
    if (!isValidStatusTransition(orderDetail?.status, newStatus)) {
      return [null, ERROR_BAD_REQUEST, "Can't revert order"];
    }

    const updatedOrder = await orderDetailRepository.updateOrderStatus(
      transactionalEntityManager,
      orderDetail,
      newStatus
    );

    return [updatedOrder, CODE_SUCCESS, "Updated order successfully"];
  }
}

const orderDetailService = new OrderDetailService();

export { orderDetailService };
