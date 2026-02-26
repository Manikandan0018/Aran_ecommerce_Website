import Product from "../models/Product.js";

export const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // ✅ Prevent duplicate reviews
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString(),
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Product already reviewed" });
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);

  // ✅ Update review count
  product.numReviews = product.reviews.length;

  // ✅ Recalculate average rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({ message: "Review added" });
};

export const getProductReviews = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product.reviews);
};

export const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.find(
    (r) => r._id.toString() === req.params.reviewId,
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // ✅ SECURITY CHECK (VERY IMPORTANT)
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not allowed to update this review");
  }

  review.rating = Number(rating);
  review.comment = comment;

  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();

  res.json({ message: "Review updated" });
};


export const deleteReview = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const review = product.reviews.find(
    (r) => r._id.toString() === req.params.reviewId,
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // ✅ SECURITY CHECK (MOST IMPORTANT)
  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not allowed to delete this review");
  }

  // ✅ Remove Review
  product.reviews = product.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId,
  );

  // ✅ Recalculate Review Stats
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length;

  await product.save();

  res.json({ message: "Review deleted" });
};