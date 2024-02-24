import express from "express";
import {
  createNewAddress,
  getListAddress,
  updateAddress,
  setDefaultAddress,
} from "./address.controller";

const router = express.Router();

router.get("/list/:id", getListAddress);
router.post("/new/:id", createNewAddress);
router.put("/update/:userID/:addressID", updateAddress);
router.put("/set_default/:userID/:addressID", setDefaultAddress);


export default router;
