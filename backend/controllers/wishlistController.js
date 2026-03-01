import User from "../models/User.js";
import mongoose from "mongoose";

// ✅ Add to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure wishlist exists
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const exists = user.wishlist.some((id) => id.toString() === productId);

    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    console.error("Add wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

    await user.save();

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.wishlist || []);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
