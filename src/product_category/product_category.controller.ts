import { Request, Response } from "express";
import { productCategoryService } from "./product_category.service";
import { returnResponse } from "../helper/response";
import {
  CODE_CREATED_SUCCESS,
  CODE_SUCCESS,
  ERROR_BAD_REQUEST,
} from "../helper/constant";
import { CreateProductCategoryDto } from "./dto/create_product_category.dto";

/**
 * @openapi
 * /v1/product_category/list:
 *   get:
 *     summary: Get all product categories
 *     responses:
 *       '200':
 *         description: Successfully returned the list of categories
 *       '400':
 *         description: Failed to retrieve data
 */
const getProductCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await productCategoryService.getAllProductCategories();

    if (!response) {
      res.send(
        returnResponse(ERROR_BAD_REQUEST, "Failed to retrieve data", response)
      );
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Successfully returned the list of categories",
          response
        )
      );
    }
  } catch (error) {
    console.error("Error while processing product categories:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * @openapi
 * /v1/product_category/new:
 *   post:
 *     summary: Create a new product category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The product code.
 *                 default: KHUYENTAI
 *               name:
 *                 type: string
 *                 description: The product name.
 *                 default: Khuyên tai lấp lánh
 *     responses:
 *       '201':
 *         description: Product category created successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const createNewProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const createProductCategoryDto: CreateProductCategoryDto = req.body;

    const [createdProduct, err] =
      await productCategoryService.createProductCategory(
        createProductCategoryDto
      );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, createdProduct));
    } else {
      res.send(
        returnResponse(
          CODE_CREATED_SUCCESS,
          "Product category created successfully",
          createdProduct
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
/**
 * @openapi
 * /v1/product_category/update/{id}:
 *   put:
 *     summary: Update product category
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
 *               code:
 *                 type: string
 *                 description: The product code.
 *                 default: KHUYENTAI
 *               name:
 *                 type: string
 *                 description: The product name.
 *                 default: Khuyên tai lấp lánh
 *     responses:
 *       '201':
 *         description: Product category created successfully
 *       '400':
 *         description: Bad request - Invalid input data
 */
const updateProductCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productCategoryId: string = req.params.id;
    const updateProductCategoryDto: CreateProductCategoryDto = req.body;

    const [updatedProduct, err] =
      await productCategoryService.updateProductCategory(
        +productCategoryId,
        updateProductCategoryDto
      );

    if (err) {
      res.send(returnResponse(ERROR_BAD_REQUEST, err.message, updatedProduct));
    } else {
      res.send(
        returnResponse(
          CODE_SUCCESS,
          "Product category updated successfully",
          updatedProduct
        )
      );
    }
  } catch (error) {
    console.error("Error while processing products:", error);
    res.status(500).send("Internal Server Error");
  }
};
export {
  createNewProductCategory,
  getProductCategories,
  updateProductCategory,
};
