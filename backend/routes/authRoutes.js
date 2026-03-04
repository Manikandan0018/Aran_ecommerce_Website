import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  googleAuth,
  getSecurityQuestion,
  resetPassword,
} from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// NEW
router.post("/forgot-question", getSecurityQuestion);
router.post("/reset-password", resetPassword);

export default router;
