import express from "express";
import {
  createNewProduct,
  findProductById,
  getProducts,
  searchProduct,
  updateProduct,
} from "./product.controller";
import upload from "../config/multer";

const router = express.Router();

router.get("/list", getProducts);
router.post("/new", upload.array("images", 4), createNewProduct);
router.get("/detail/:id", findProductById);
router.get("/search", searchProduct);
router.put("/update/:id", updateProduct);

export default router;
