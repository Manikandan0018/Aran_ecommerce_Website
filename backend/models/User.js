import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    // Change: Remove required: true
    mobile: { type: String },

    password: { type: String },
    googleId: { type: String },
    isAdmin: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

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
