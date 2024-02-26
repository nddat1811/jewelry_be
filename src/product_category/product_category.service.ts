import { getManager } from "typeorm";
import { ProductCategory } from "../models";
import { CreateProductCategoryDto } from "./dto/create_product_category.dto";
import { productCategoryRepository } from "./product_category.repository";

class ProductCategoryService {
  async getAllProductCategories(): Promise<Array<ProductCategory>> {
    try {
      const transactionalEntityManager = getManager();
      const categories =
        await productCategoryRepository.getAllProductCategories(
          transactionalEntityManager
        );

      return categories;
    } catch (error) {
      // Handle errors (e.g., log or throw)
      console.error("Error fetching product categories:", error);
      throw error;
    }
  }
  async createProductCategory(
    createProductCategoryDto: CreateProductCategoryDto
  ): Promise<[ProductCategory | null, Error | null]> {
    try {
      const transactionalEntityManager = getManager();
      const [createdProductCategory, err] =
        await productCategoryRepository.createProductCategory(
          createProductCategoryDto,
          transactionalEntityManager
        );

      return [createdProductCategory, err];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async updateProductCategory(
    productCategoryId: number,
    updateProductCategoryDto: CreateProductCategoryDto
  ): Promise<[ProductCategory | null, Error | null]> {
    try {
      const transactionalEntityManager = getManager();
      // Find existing product by ID

      const [updatedProductCategory, err] =
        await productCategoryRepository.updateProductCategory(
          productCategoryId,
          updateProductCategoryDto,
          transactionalEntityManager
        );
      return [updatedProductCategory, err];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productCategoryService = new ProductCategoryService();

export { productCategoryService };
