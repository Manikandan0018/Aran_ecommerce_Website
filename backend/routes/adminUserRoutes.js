import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  getUsers,
  deleteUser,
  toggleBlockUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

router.delete("/:id", protect, adminOnly, deleteUser);

router.put("/:id/block", protect, adminOnly, toggleBlockUser);

export default router;
