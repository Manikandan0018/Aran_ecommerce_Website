import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  confirmOrder,
  rejectOrder,
  deliverOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/* USER */
router.post("/", protect, placeOrder);
router.get("/myorders", protect, getMyOrders);

/* ADMIN */
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/confirmed", protect, adminOnly, confirmOrder);
router.put("/:id/rejected", protect, adminOnly, rejectOrder);
router.put("/:id/delivered", protect, adminOnly, deliverOrder);
export default router;