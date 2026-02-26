import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  try {
    console.log("📨 Sending OTP to:", email);

    const info = await transporter.sendMail({
      from: `"Aran Shop" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `
        <h2>Your OTP Code: ${otp}</h2>
        <p>This code expires in 10 minutes.</p>
      `,
    });

  } catch (err) {
    console.error("❌ Gmail Error:", err);
    throw new Error("Email sending failed");
  }
};
