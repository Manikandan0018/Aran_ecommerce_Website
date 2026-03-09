import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: {
    type: String, // 50g, 100g, 500g, 1kg
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: { type: String, required: true },

    category: { type: String, required: true },

    images: [{ type: String }],

    variants: [variantSchema], // ⭐ multiple weight prices

    countInStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
