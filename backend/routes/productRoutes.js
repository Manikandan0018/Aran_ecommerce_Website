import express from "express";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getProductCategories,
} from "../controllers/productController.js";

const router = express.Router();

/* ⭐ STATIC ROUTES FIRST */
router.get("/", getProducts);
router.get("/categories", getProductCategories);

/* ⭐ DYNAMIC ROUTES AFTER */
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);

export default router;
