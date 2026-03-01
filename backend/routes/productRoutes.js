/* productRoutes.js */
import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getProductCategories,
} from "../controllers/productController.js";

const router = express.Router();

// 1. Static routes (Must come first!)
router.get("/", getProducts);
router.get("/categories", getProductCategories); // Fixed: Higher priority

// 2. Dynamic routes (Must come last!)
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

export default router;
