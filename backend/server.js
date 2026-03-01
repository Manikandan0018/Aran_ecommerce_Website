import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import { maintenanceMode } from "./middleware/maintenanceMiddleware.js";


const app = express();

/* =====================================
   ✅ CORS CONFIGURATION
===================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://aran-naturals-products.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

/* =====================================
   ✅ MIDDLEWARE
===================================== */

app.use(express.json());

/* =====================================
   ✅ DATABASE CONNECTION
===================================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* =====================================
   ✅ MAINTENANCE MODE
===================================== */

app.use(maintenanceMode);

/* =====================================
   ✅ ROUTES
===================================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/upload", uploadRoutes);




/* =====================================
   ✅ HEALTH CHECK
===================================== */

app.get("/", (req, res) => {
  res.status(200).send("🚀 API Running...");
});

app.get("/api", (req, res) => {
  res.status(200).json({ status: "OK" });
});

/* =====================================
   ✅ 404 HANDLER
===================================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

/* =====================================
   ✅ GLOBAL ERROR HANDLER
===================================== */

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

/* =====================================
   ✅ SERVER START
===================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
