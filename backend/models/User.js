import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    mobile: { type: String, required: true },

    password: { type: String },

    googleId: { type: String },

    isAdmin: { type: Boolean, default: false },

    isBlocked: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
