import Order from "../models/Order.js";

/* =========================
   CREATE ORDER
========================= */
export const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalAmount, phone } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!phone) {
      return res.status(400).json({ message: "Phone number required" });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems: orderItems.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        weight: item.weight, // ⭐ selected weight (50g,100g...)
        price: item.price,
        quantity: item.quantity,
      })),
      shippingAddress,
      totalAmount,
      phone,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({ message: "Order failed" });
  }
};

/* =========================
   USER ORDERS
========================= */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name images")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* =========================
   ADMIN - ALL ORDERS
========================= */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name images category")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

/* =========================
   ADMIN - CONFIRM ORDER
========================= */
export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "confirmed";

    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (error) {
    console.error("CONFIRM ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to confirm order" });
  }
};

/* =========================
   ADMIN - REJECT ORDER
========================= */
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "rejected";

    await order.save();

    res.json({ message: "Order rejected", order });
  } catch (error) {
    console.error("REJECT ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to reject order" });
  }
};

/* =========================
   ADMIN - DELIVER ORDER
========================= */
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "delivered";

    await order.save();

    res.json({ message: "Order marked as delivered", order });
  } catch (error) {
    console.error("DELIVER ORDER ERROR:", error);
    res.status(500).json({ message: "Failed to update order" });
  }
};
