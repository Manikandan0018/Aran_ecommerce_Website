import User from "../models/User.js";

export const addToWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  const productId = req.params.productId;

  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    return res.status(400).json({ message: "Already in wishlist" });
  }

  user.wishlist.push(productId);

  await user.save();

  res.json({ message: "Added to wishlist" });
};

export const removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);

  const productId = req.params.productId;

  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

  await user.save();

  res.json({ message: "Removed from wishlist" });
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.json(user.wishlist);
};