import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const lowerEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: lowerEmail,
      mobile,
      password: hashedPassword,
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
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { name, email, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
      });
    }

    if (user.isBlocked)
      return res.status(403).json({ message: "Account blocked" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save();

  const resetUrl = `https://yourfrontend.com/reset-password/${resetToken}`;

  // sendEmail(resetUrl)

  res.json({ message: "Reset link sent to email" });
};

export const resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.json({ message: "Password reset successful" });
};