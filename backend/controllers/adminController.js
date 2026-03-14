import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* =========================
   UNIT TYPE DETECTOR
========================= */
const detectUnitType = (unit) => {
  if (["mg", "g", "kg"].includes(unit)) return "weight";

  if (["ml", "L"].includes(unit)) return "volume";

  return "weight";
};

/* =========================
   ADMIN DASHBOARD STATS
========================= */
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);

    const revenueData = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const last7Days = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d %b",
              date: "$createdAt",
            },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const graphData = last7Days.map((d) => ({
      name: d._id,
      revenue: d.revenue,
    }));

    const categorySales = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$orderItems" },

      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $group: {
          _id: "$product.category",
          sales: { $sum: "$orderItems.quantity" },
        },
      },
    ]);

    const categoryData = categorySales.map((c) => ({
      name: c._id,
      sales: c.sales,
    }));

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      todayOrders,
      graphData,
      categoryData,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to load stats",
    });
  }
};

/* =========================
   ADD PRODUCT
========================= */
export const addProduct = async (req, res) => {
  try {
    const { name, description, category, images, variants, countInStock } =
      req.body;

    if (!name || !description || !category) {
      return res.status(400).json({
        message: "Name, description and category required",
      });
    }

    if (!variants || !Array.isArray(variants)) {
      return res.status(400).json({
        message: "Variants required",
      });
    }

    const cleanedVariants = variants
      .filter((v) => v.value && v.unit && v.price)
      .map((v) => ({
        value: Number(v.value),
        unit: v.unit,
        price: Number(v.price),
      }));

    if (cleanedVariants.length === 0) {
      return res.status(400).json({
        message: "At least one valid variant required",
      });
    }

    const unitType = detectUnitType(cleanedVariants[0].unit);

    const product = await Product.create({
      name,
      description,
      category,
      images,
      variants: cleanedVariants,
      unitType,
      countInStock: Number(countInStock) || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Product creation failed",
    });
  }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, category, images, variants, countInStock } =
      req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (images) product.images = images;
    if (countInStock !== undefined) product.countInStock = Number(countInStock);

    /* CONVERT VARIANTS */
    if (variants && Array.isArray(variants)) {
      const cleanedVariants = variants
        .filter((v) => v.value && v.unit && v.price)
        .map((v) => ({
          value: Number(v.value),
          unit: v.unit,
          price: Number(v.price),
        }));

      if (cleanedVariants.length > 0) {
        product.variants = cleanedVariants;

        const unit = cleanedVariants[0].unit;

        if (["mg", "g", "kg"].includes(unit)) product.unitType = "weight";

        if (["ml", "L"].includes(unit)) product.unitType = "volume";
      }
    }

    /* MIGRATE OLD PRODUCTS */
    if (!product.unitType && product.variants?.length > 0) {
      const oldVariants = product.variants.map((v) => {
        if (v.weight) {
          const value = parseInt(v.weight);
          const unit = v.weight.replace(/[0-9]/g, "");

          return {
            value,
            unit,
            price: v.price,
          };
        }

        return v;
      });

      product.variants = oldVariants;

      const unit = oldVariants[0].unit;

      product.unitType = ["ml", "L"].includes(unit) ? "volume" : "weight";
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Product update failed",
    });
  }
};

/* =========================
   DELETE PRODUCT
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product removed",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
};

/* =========================
   ADMIN PRODUCT LIST
========================= */

export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load products",
    });
  }
};
