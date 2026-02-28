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
    await transporter.sendMail({
      from: `"Aran Shop" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email Verification Code",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2>Email Verification</h2>
          <p>Your OTP Code:</p>
          <h1 style="letter-spacing:5px;">${otp}</h1>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP Email Sent Successfully");
  } catch (error) {
    console.error("❌ Email Error:", error.message);
    throw error;
  }
};