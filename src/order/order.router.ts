
import express from "express";
import { isAuthenticated } from "../middleware/authorized";
import { creatNewOrder, getListOrderUser, getOrderDetailById, updateOrder } from "./order.controller";

const router = express.Router();

router.get("/list", isAuthenticated, getListOrderUser );
router.post("/new", isAuthenticated, creatNewOrder);
router.get("/detail/:id", isAuthenticated, getOrderDetailById );
router.put("/update/:id", isAuthenticated, updateOrder);
// router.delete("/delete", isAuthenticated, deleteItemInCart);

export default router;
