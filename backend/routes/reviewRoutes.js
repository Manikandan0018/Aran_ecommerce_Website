// routes/reviewRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProductReviews,
  addReview,
} from "../controllers/reviewController.js";

const router = express.Router();

// 1. PUBLIC: Anyone can see the reviews
router.get("/:productId/reviews", getProductReviews);

// 2. PROTECTED: Only logged-in users can post
router.post("/:productId/reviews", protect, addReview);

export default router;
