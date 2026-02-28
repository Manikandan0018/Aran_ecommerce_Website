import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // must be true for 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const sendOtpEmail = async (email, otp) => {
  try {
    // verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP server ready");

    const info = await transporter.sendMail({
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

    console.log("✅ OTP Email Sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email Error:", error);
  }
};