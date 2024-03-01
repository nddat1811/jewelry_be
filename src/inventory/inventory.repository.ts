import { EntityManager, Transaction, getRepository } from "typeorm";
import { ProductInventory } from "../models";
import { OrderStatus } from "../helper/constant";
import { elasticSearchClient } from "../helper/elasticsearch";
import { productRepository } from "../product/product.repository";

const indexName = "products";
class ProductInventoryRepository {
  async editInventory(
    productId: number,
    quantity: number,
    transactionalEntityManager: EntityManager
  ): Promise<ProductInventory | null> {
    const productInventoryRepository =
      transactionalEntityManager.getRepository(ProductInventory);

    try {
      const productItem = await productRepository.findProductById(productId);
      //   const inventoryId = productItem.id
      const productInventory = productItem?.inventory;
      if (!productInventory) {
        throw new Error(
          `ProductInventory not found for Product with id ${productId}`
        );
      }
      if (!productInventory.quantity) {
        throw new Error(`ProductInventory found error ${productId}`);
      }
      productInventory.quantity -= quantity;

      if (productInventory.quantity < 0) {
        throw new Error(`Product ${productId} out of stock`);
      }

      const searchResponse = await elasticSearchClient.search({
        index: indexName,
        body: {
          query: {
            term: { id: productId },
          },
        },
      });
      if (searchResponse) {
        const hits = searchResponse.hits.hits as Array<{
          _id: string;
          _index: string;
          _score: number;
          _source: Record<string, unknown>;
        }>;

        await elasticSearchClient.update({
          index: indexName,
          id: hits[0]._id,
          body: {
            doc: {
              inventory: productInventory,
            },
          },
        });
      } else {
        return null;
      }
      console.log(productInventory);

      await productInventoryRepository.save(productInventory);

      return productInventory;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }

  async createNewInventory(
    quantity: number,
    transactionalEntityManager: EntityManager
  ): Promise<ProductInventory | null> {
    const productInventoryRepository =
      transactionalEntityManager.getRepository(ProductInventory);

    try {
      const newInventory = productInventoryRepository.create({
        quantity,
      });

      const createdInventory = await productInventoryRepository.save(
        newInventory
      );

      return createdInventory;
    } catch (error) {
      console.error("Error create new inventory", error);
      throw error;
    }
  }
  async findInventoryByID(
    id: number,
    transactionalEntityManager: EntityManager
  ): Promise<ProductInventory | null> {
    const productInventoryRepository =
      transactionalEntityManager.getRepository(ProductInventory);

    try {
      const inventory = productInventoryRepository.findOneBy({
        id: id,
      });

      return inventory;
    } catch (error) {
      console.error("Error updating last login", error);
      throw error;
    }
  }
  async saveInventory(
    inventory: ProductInventory,
    transactionalEntityManager: EntityManager
  ): Promise<ProductInventory> {
    return transactionalEntityManager
      .getRepository(ProductInventory)
      .save(inventory);
  }
}

const productInventoryRepository = new ProductInventoryRepository();
export { productInventoryRepository };
