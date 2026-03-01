import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String },

    googleId: { type: String },

    isAdmin: { type: Boolean, default: false },

    isBlocked: { type: Boolean, default: false },

    // Email Verification
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiry: { type: Date },
    otpAttempts: { type: Number, default: 0 },
    otpLastSent: { type: Date },

    // ✅ Wishlist (FIXED)
    wishlist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
