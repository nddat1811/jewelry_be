import { EntityManager, getRepository } from "typeorm";
import { ProductImage } from "../models";
import { CreateProductImageDto } from "./dto/create_product_image.dto";

class ProductImageRepository {
  async createProductImage(
    createProductImage: CreateProductImageDto,
    transactionalEntityManager: EntityManager
  ): Promise<[ProductImage | null, Error | null]> {
    try {
      const imageRepository =
        transactionalEntityManager.getRepository(ProductImage);
      const createdProductImage = await imageRepository.save(
        createProductImage
      );

      return [createdProductImage, null];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  async findProductImageByProductID(
    productId: number
  ): Promise<[ProductImage[] | null, Error | null]> {
    try {
      const imageRepository = getRepository(ProductImage);
      const productImgs = await imageRepository
        .createQueryBuilder("product_images")
        .where("product_images.product.id = :productId", { productId })
        .getMany();

      return [productImgs, null];
    } catch (error) {
      console.error("Error creating product", error);
      throw error;
    }
  }

  //   async updateProductCategory(
  //     productCategoryId: number,
  //     updateProductCategoryDto: CreateProductCategoryDto,
  //     transactionalEntityManager: EntityManager
  //   ): Promise<[ProductCategory | null, Error | null]> {
  //     try {
  //       const categoryRepository =
  //         transactionalEntityManager.getRepository(ProductCategory);
  //       // Find existing product by ID
  //       const existingProductCategory = await this.findProductCategoryByID(
  //         +productCategoryId,
  //         transactionalEntityManager
  //       );
  //       // return Product not found by ID
  //       if (!existingProductCategory) {
  //         return [null, Error("Product category not found by ID")];
  //       }

  //       const preName = existingProductCategory.name;
  //       // Update existing product properties
  //       categoryRepository.merge(
  //         existingProductCategory,
  //         updateProductCategoryDto
  //       );
  //       // Save the updated product into the database
  //       const updatedProductCategory = await categoryRepository.save(
  //         existingProductCategory
  //       );

  //       // Update the product in ElasticSearch
  //       // Search ID of product in elasticSearch
  //       const searchResponse = await elasticSearchClient.search({
  //         index: INDEX_PRODUCT_NAMEtName,
  //         body: {
  //           query: {
  //             bool: {
  //               must: [
  //                 {
  //                   match: {
  //                     category: preName,
  //                   },
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //       });

  //       if (searchResponse) {
  //         const hits = searchResponse.hits.hits as Array<{
  //           _id: string;
  //           _index: string;
  //           _score: number;
  //           _source: Record<string, unknown>;
  //         }>;

  //         for (const hit of hits) {
  //           await elasticSearchClient.update({
  //             index: INDEX_PRODUCT_NAMEtName,
  //             id: hit._id,
  //             body: {
  //               doc: {
  //                 category: existingProductCategory.name,
  //               },
  //             },
  //           });
  //         }
  //       } else {
  //         return [null, Error("Can't update product in elasticsearch")];
  //       }

  //       return [updatedProductCategory, null];
  //     } catch (error) {
  //       console.error("Error updating product", error);
  //       throw error;
  //     }
  //   }
}

const productImageRepository = new ProductImageRepository();
export { productImageRepository };
