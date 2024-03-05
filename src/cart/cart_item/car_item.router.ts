import express from "express";
import { addToCart, deleteItemInCart, updateCart, getListItemInCart  } from "./cart_item.controller";
import { isAuthenticated } from "../../middleware/authorized";

const router = express.Router();

router.get("/list", isAuthenticated, getListItemInCart );
router.post("/add_cart", isAuthenticated, addToCart);
router.put("/update_cart", isAuthenticated, updateCart);
router.delete("/delete", isAuthenticated, deleteItemInCart);

export default router;
