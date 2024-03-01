import { getManager } from "typeorm";
import {
  Product,
} from "../models";
import { CreateProductDto } from "./dto/create_product.dto";
import { elasticSearchClient } from "../helpers/elasticsearch";
import { productRepository } from "./product.repository";
import { ProductPage } from "./entity/product";
import { INDEX_PRODUCT_NAME } from "../helpers/constant";

class ProductService {
  async getAllProducts(
    offset: number,
    limit: number,
    del: boolean
  ): Promise<ProductPage> {
    try {
      // query all Products to mapping to elasticsearch
      const allProducts = await productRepository.getAllProducts();
      //can't query
      if (allProducts == null) {
        return {
          total: 0,
          currentTotal: 0,
          currentPage: 0,
          data: [],
        };
      }

      // insert into elasticsearch
      const bulkRequestBody = allProducts.flatMap((product) => [
        { index: { _index: INDEX_PRODUCT_NAME, _id: product.id } },
        {
          id: product.id,
          name: product.name,
          code: product.code,
          images: product.images,
          origin: product.origin,
          material: product.material,
          size: product.size,
          warranty: product.warranty,
          description: product.description,
          price: product.price,
          category: {
            id: product.category?.id,
            name: product.category?.name,
          },
          inventory: product.inventory,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          deletedAt: product.deletedAt,
        },
      ]);

      const response = await elasticSearchClient.bulk({
        index: INDEX_PRODUCT_NAME,
        body: bulkRequestBody,
      });
      if (response.errors) {
        console.error("Elasticsearch bulk operation errors:", response.items);
      }

      const { total, currentTotal, currentPage, data } =
        await productRepository.getListProduct(offset, limit, del);

      return {
        total,
        currentTotal,
        currentPage,
        data,
      };
    } catch (error) {
      console.error("Error fetching products", error);
      throw error;
    }
  }

  async createProduct(
    images: string[],
    createProductDto: CreateProductDto
  ): Promise<[Product | null, number, Error | null]> {
    try {
      const transactionalEntityManager = getManager();
      const [createdProduct, code, err] = await productRepository.createProduct(
        images,
        createProductDto,
        transactionalEntityManager
      );

      return [createdProduct, code, err];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async findProductById(productId: number): Promise<Product | null> {
    try {
      const product = await productRepository.findProductById(productId);
      return product;
    } catch (error) {
      console.error("Error while finding product by ID:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }

  async searchProducts(
    offset: number,
    limit: number,
    fullTextSearch: string,
    categoryName: string,
    priceMin: number,
    priceMax: number,
    sortValue: string
  ): Promise<ProductPage> {
    try {
      const { total, currentTotal, currentPage, data } =
        await productRepository.searchProducts(
          offset,
          limit,
          fullTextSearch,
          categoryName,
          priceMin,
          priceMax,
          sortValue
        );

      return {
        total,
        currentTotal,
        currentPage,
        data: data,
      };
    } catch (error) {
      console.error("Error while searching products:", error);
      throw error; // You might want to handle this error more gracefully in a production environment
    }
  }

  async updateProduct(
    productId: number,
    updateProductDto: CreateProductDto
  ): Promise<[Product | null, number, Error | null]> {
    const transactionalEntityManager = getManager();

    try {
      const [updatedProduct, code, err] = await productRepository.updateProduct(
        productId,
        updateProductDto,
        transactionalEntityManager
      );
      return [updatedProduct, code, err];
    } catch (error) {
      console.error("Error updating product", error);
      throw error;
    }
  }
}

const productService = new ProductService();

export { productService };

// const bulkRequestBody = allProducts.flatMap((product) => [
//   { index: { _index: INDEX_PRODUCT_NAME, _id: product.id } },
//   {
//     // Chọn các trường bạn muốn index
//     id: product.id,
//     name: product.name,
//     code: product.code,
//     // images: product.images,
//     origin: product.origin,
//     material: product.material,
//     size: product.size,
//     warranty: product.warranty,
//     description: product.description,
//     price: product.price,
//     category: {
//       id: product.category?.id,
//       name: product.category?.name,
//     },
//     inventory: product.inventory,
//     createdAt: product.createdAt,
//     updatedAt: product.updatedAt,
//     deletedAt: product.deletedAt,
//   },
// ]);
