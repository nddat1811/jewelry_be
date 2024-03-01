import express from "express";
import { isAuthenticated } from "../middleware/authorized";
import {
  findUserByEmail,
  getDetailUserById,
  updateAvatarUser,
  updateUser,
  updateUserPassword,
} from "./user.controller";
import upload from "../config/multer";

const router = express.Router();

router.get("/test", isAuthenticated, findUserByEmail);
router.get("/detail/:id", getDetailUserById);
router.put("/update/:id", updateUser);
router.put("/update_password/:id", updateUserPassword);
router.put("/update_avatar/:id", upload.single("file"), updateAvatarUser);
//còn thiếu search user
//update (update cả payment và address)

export default router;
