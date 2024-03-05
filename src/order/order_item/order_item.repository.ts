import { EntityManager } from "typeorm";
import { OrderItem } from "../../models";

class OrderItemRepository {
  async createNewOderItem(
    quantity: number,
    price: number,
    productId: number,
    orderId: number,
    transactionalEntityManager: EntityManager
  ): Promise<OrderItem | null> {
    const OrderItemRepository =
      transactionalEntityManager.getRepository(OrderItem);

    try {
      const newOrderItem = OrderItemRepository.create({
        order: { id: orderId },
        product: { id: productId },
        price: price,
        quantity: quantity,
      });
      const createdOrderItem = await OrderItemRepository.save(newOrderItem);

      return createdOrderItem;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
}

const orderItemRepository = new OrderItemRepository();
export { orderItemRepository };
