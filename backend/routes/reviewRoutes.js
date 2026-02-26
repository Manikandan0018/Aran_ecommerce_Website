import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router
  .route("/:id/reviews")
  .post(protect, addReview) // Only logged-in users
  .get(getProductReviews);
router.put("/:productId/reviews/:reviewId", protect, updateReview);
router.delete("/:productId/reviews/:reviewId", protect, deleteReview);


export default router;
