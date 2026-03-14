import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },

        name: { type: String, required: true },

        image: { type: String, required: true },

        weight: { type: String, required: true },

        price: { type: Number, required: true },

        quantity: { type: Number, required: true },
      },
    ],

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },

    phone: { type: String, required: true },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true },
);

/* =========================
   INDEXES (VERY IMPORTANT)
========================= */

/* Faster dashboard queries */
orderSchema.index({ createdAt: -1 });

/* Faster revenue calculation */
orderSchema.index({ status: 1 });

/* Faster user order history */
orderSchema.index({ user: 1 });

export default mongoose.model("Order", orderSchema);
