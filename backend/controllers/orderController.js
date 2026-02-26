import Order from "../models/Order.js";


/* CREATE ORDER */
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
      orderItems,
      shippingAddress,
      totalAmount,
      phone,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Order failed" });
  }
};

/* USER ORDERS */
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(orders);
};

/* ADMIN – ALL ORDERS */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(orders);
};

/* ADMIN – CONFIRM ORDER */
export const confirmOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = "confirmed";
  await order.save();

  res.json({ message: "Order confirmed" });
};

/* ADMIN – REJECT ORDER */
export const rejectOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = "rejected";
  await order.save();

  res.json({ message: "Order rejected" });
};