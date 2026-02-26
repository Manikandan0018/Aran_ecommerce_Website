import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";





export const getDashboardStats = async (req, res) => {
  try {
    /* BASIC COUNTS */
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    /* TOTAL REVENUE */
    const revenueData = await Order.aggregate([
      {
        $match: { status: "confirmed" }, // Only real sales
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    /* TODAY ORDERS */
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    /* MONTHLY REVENUE (FOR GRAPH) */
    const monthlyRevenue = await Order.aggregate([
      {
        $match: { status: "confirmed" },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const graphData = monthlyRevenue.map((item) => ({
      name: monthNames[item._id - 1],
      revenue: item.revenue,
    }));

    /* SALES BY CATEGORY */
    const salesByCategory = await Order.aggregate([
      { $match: { status: "confirmed" } },
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $group: {
          _id: "$productData.category",
          count: { $sum: "$orderItems.quantity" },
        },
      },
    ]);

    const totalSold = salesByCategory.reduce(
      (acc, item) => acc + item.count,
      0,
    );

    const categoryData = salesByCategory.map((item) => ({
      name: item._id,
      sales: totalSold ? Math.round((item.count / totalSold) * 100) : 0,
    }));

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      todayOrders,
      graphData,
      categoryData,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};

export const addProduct = async (req, res) => {
  console.log("REQ BODY:", req.body);

  try {
    const { name, price, description, category, images, countInStock } =
      req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "Product image required" });
    }

    const product = await Product.create({
      name,
      price: Number(price), // ⭐ IMPORTANT
      description,
      category,
      images: Array.isArray(images) ? images : [], // ⭐ CRITICAL FIX
      countInStock: Number(countInStock), // ⭐ IMPORTANT
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, images, countInStock } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.category = category ?? product.category;

    // ⭐ IMAGE SAFETY (VERY IMPORTANT)
    if (images && Array.isArray(images)) {
      product.images = images;
    }

    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Product update failed" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getAdminProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const count = await Product.countDocuments();

    const products = await Product.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load products" });
  }
};
