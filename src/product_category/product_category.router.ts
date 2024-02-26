import express from "express";
import {
  createNewProductCategory,
  getProductCategories,
  updateProductCategory
} from "./product_category.controller";

const router = express.Router();

router.get("/list", getProductCategories);
router.post("/new", createNewProductCategory);
router.put("/update/:id", updateProductCategory);

export default router;
