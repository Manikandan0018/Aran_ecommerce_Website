import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  confirmOrder,
  rejectOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);

/* ADMIN */
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/confirm", protect, adminOnly, confirmOrder);
router.put("/:id/reject", protect, adminOnly, rejectOrder);

export default router;
