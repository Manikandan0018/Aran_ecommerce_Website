import Product from "../models/Product.js";

/* GET PRODUCTS */
export const getProducts = async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  const sortOption = {};

  if (req.query.sort === "price_asc") sortOption.price = 1;
  if (req.query.sort === "price_desc") sortOption.price = -1;
  if (req.query.sort === "newest") sortOption.createdAt = -1;
  if (req.query.sort === "rating") sortOption.rating = -1;

  const filter = { ...keyword, ...categoryFilter };

  const count = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortOption);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
};

/* GET SINGLE PRODUCT */
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};

/* RELATED PRODUCTS */
export const getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(6);

  res.json(related);
};

/* ⭐ REAL PRODUCT CATEGORIES (NEW) */
export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    // 1. Trim whitespace, 2. Filter out nulls, 3. Get Unique values using Set
    const cleanCategories = [
      ...new Set(categories.filter(Boolean).map((cat) => cat.trim()))
    ].sort();

    res.json(cleanCategories);
  } catch (error) {
    console.error("Category Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
