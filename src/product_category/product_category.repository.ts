import { EntityManager  } from "typeorm";
import { elasticSearchClient } from "../helpers/elasticsearch";
import {
  ProductCategory,
} from "../models";
import { CreateProductCategoryDto } from "./dto/create_product_category.dto";
import { INDEX_PRODUCT_NAME } from "../helpers/constant";


class ProductCategoryRepository {
  async findProductCategoryByID(
    categoryId: number,
    transactionalEntityManager: EntityManager
  ): Promise<ProductCategory | null> {
    const categoryRepository =
      transactionalEntityManager.getRepository(ProductCategory);
    try {
      const category = await categoryRepository
        .createQueryBuilder("category")
        .select(["category.id", "category.name", "category.code"])
        .where({
          id: categoryId,
        })
        .getOne();

      return category;
    } catch (error) {
      console.error("Error find product category", error);
      throw error;
    }
  }

  async getAllProductCategories(
    transactionalEntityManager: EntityManager
  ): Promise<Array<ProductCategory>> {
    const categoryRepository =
      transactionalEntityManager.getRepository(ProductCategory);
    try {
      const categories = await categoryRepository
        .createQueryBuilder("category")
        .select(["category"])
        .getMany();

      return categories;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching product categories:", error);
      throw error;
    }
  }

  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto,
    transactionalEntityManager: EntityManager
  ): Promise<[ProductCategory | null, Error | null]> {
    try {
      const categoryRepository =
        transactionalEntityManager.getRepository(ProductCategory);
      const createdProductCategory = await categoryRepository.save(
        createProductCategoryDto
      );

      return [createdProductCategory, null];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async updateProductCategory(
    productCategoryId: number,
    updateProductCategoryDto: CreateProductCategoryDto,
    transactionalEntityManager: EntityManager
  ): Promise<[ProductCategory | null, Error | null]> {
    try {
      const categoryRepository =
        transactionalEntityManager.getRepository(ProductCategory);
      // Find existing product by ID
      const existingProductCategory = await this.findProductCategoryByID(
        +productCategoryId,
        transactionalEntityManager
      );
      // return Product not found by ID
      if (!existingProductCategory) {
        return [null, Error("Product category not found by ID")];
      }

      const preName = existingProductCategory.name;
      // Update existing product properties
      categoryRepository.merge(
        existingProductCategory,
        updateProductCategoryDto
      );
      // Save the updated product into the database
      const updatedProductCategory = await categoryRepository.save(
        existingProductCategory
      );

      // Update the product in ElasticSearch
      // Search ID of product in elasticSearch
      const searchResponse = await elasticSearchClient.search({
        index: INDEX_PRODUCT_NAME,
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    category: preName,
                  },
                },
              ],
            },
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

        for (const hit of hits) {
          await elasticSearchClient.update({
            index: INDEX_PRODUCT_NAME,
            id: hit._id,
            body: {
              doc: {
                category: existingProductCategory.name,
              },
            },
          });
        }
      } else {
        return [null, Error("Can't update product in elasticsearch")];
      }

      return [updatedProductCategory, null];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productCategoryRepository = new ProductCategoryRepository();
export { productCategoryRepository };
