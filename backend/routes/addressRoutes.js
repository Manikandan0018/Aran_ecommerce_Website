import express from "express";
import {
  getUserAddresses,
  addUserAddress,
  deleteUserAddress,
} from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/addresses", protect, getUserAddresses);
router.post("/addresses", protect, addUserAddress);
router.delete("/addresses/:id", protect, deleteUserAddress);

export default router;
