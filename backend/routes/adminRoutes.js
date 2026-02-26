import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import {
  getDashboardStats,
  addProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/adminController.js";

const router = express.Router();

router
  .route("/products")
  .post(protect, adminOnly, addProduct)
  .get(protect, adminOnly, getAdminProducts);

router
  .route("/products/:id")
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);


router.get("/stats", protect, adminOnly, getDashboardStats);
export default router;
