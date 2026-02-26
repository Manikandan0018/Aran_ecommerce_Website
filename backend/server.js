import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { maintenanceMode } from "./middleware/maintenanceMiddleware.js";

dotenv.config();

const app = express();

// ✅ Core Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow frontend requests

// ✅ Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
    process.exit(1);
  });


  app.use(maintenanceMode);

  
// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("API Running...");
});

// ✅ 404 Handler (Professional)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ✅ Global Error Handler (Professional)
app.use((err, req, res, next) => {
  console.error(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || "Server Error",
  });
});

// ✅ Server Start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
