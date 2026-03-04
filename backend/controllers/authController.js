import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, securityQuestion, securityAnswer } =
      req.body;

    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !securityQuestion ||
      !securityAnswer
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const lowerEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: lowerEmail });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // convert answer lowercase
    const normalizedAnswer = securityAnswer.toLowerCase();

    const hashedAnswer = await bcrypt.hash(normalizedAnswer, 10);

    const user = await User.create({
      name,
      email: lowerEmail,
      mobile,
      password: hashedPassword,
      securityQuestion,
      securityAnswer: hashedAnswer,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSecurityQuestion = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    question: user.securityQuestion,
  });
};


export const resetPassword = async (req, res) => {
  const { email, answer, newPassword } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const normalizedAnswer = answer.toLowerCase();

  const isMatch = await bcrypt.compare(normalizedAnswer, user.securityAnswer);

  if (!isMatch) {
    return res.status(400).json({ message: "Incorrect answer" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;

  await user.save();

  res.json({ message: "Password reset successful" });
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.password)
    return res.status(400).json({ message: "Use Google Login" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (user.isBlocked)
    return res.status(403).json({ message: "Account blocked" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};

/* ================= GOOGLE AUTH ================= */

/* ================= GOOGLE AUTH ================= */
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches VITE_GOOGLE_CLIENT_ID
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create user WITHOUT password/mobile for Google signups
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        isAdmin: false,
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    // This will tell you if it's an "audience mismatch" or "token expired"
    console.error("Google Auth Detail:", err.message); 
    res.status(401).json({ message: "Google authentication failed", detail: err.message });
  }
};


