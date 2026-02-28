import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../utils/generateToken.js";
import { sendOtpEmail } from "../utils/sendOtpEmail.js";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 45;
const MAX_OTP_ATTEMPTS = 5;

// ✅ GENERATE OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// ✅ REGISTER (EMAIL + PASSWORD)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(import.meta.env.VITE_API_URL);
    const lowerEmail = email.toLowerCase();

    let user = await User.findOne({ email: lowerEmail });

    // If verified user exists → block
    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    if (user && !user.isVerified) {
      // Update existing unverified user
      user.name = name;
      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
      user.otpLastSent = Date.now();
      user.otpAttempts = 0;
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email: lowerEmail,
        password: hashedPassword,
        isVerified: false,
        otp,
        otpExpiry: Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
        otpLastSent: Date.now(),
        otpAttempts: 0,
      });
    }

    // Send email AFTER DB save
    await sendOtpEmail(lowerEmail, otp);

    return res.status(201).json({
      message: "OTP sent to email",
      email: user.email,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Registration failed" });
  }
};



// ✅ GOOGLE AUTH (LOGIN + SIGNUP)
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ message: "Google token missing" });

    // ✅ Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const name = payload.name;
    const email = payload.email;
    const googleId = payload.sub;

    if (!email)
      return res.status(400).json({ message: "Google email not found" });

    let user = await User.findOne({ email });

    // ✅ Create new Google user
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true,
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
    console.error("Google Auth Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.isVerified)
    return res.status(400).json({ message: "Already verified" });

  if (user.otpAttempts >= MAX_OTP_ATTEMPTS)
    return res.status(429).json({ message: "Too many attempts" });

  if (!user.otp || user.otpExpiry < Date.now())
    return res.status(400).json({ message: "OTP expired" });

  if (user.otp !== otp) {
    user.otpAttempts += 1;
    await user.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpAttempts = 0;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
};

// ✅ RESEND OTP (WITH COOLDOWN)
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const secondsSinceLastSend = (Date.now() - user.otpLastSent) / 1000;

  if (secondsSinceLastSend < RESEND_COOLDOWN_SECONDS)
    return res.status(429).json({
      message: `Wait ${Math.ceil(
        RESEND_COOLDOWN_SECONDS - secondsSinceLastSend,
      )} seconds`,
    });

  const otp = generateOtp();

  user.otp = otp;
  user.otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  user.otpLastSent = Date.now();
  user.otpAttempts = 0;

  await user.save();

  await sendOtpEmail(email, otp);

  res.json({ message: "OTP resent" });
};

// ✅ LOGIN (EMAIL + PASSWORD)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.password)
    return res.status(400).json({ message: "Use Google Login" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Verify your email first" });

  if (user.isBlocked)
    return res.status(403).json({ message: "Account blocked" });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
};
