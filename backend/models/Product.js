import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
  },

  unit: {
    type: String,
    enum: ["mg", "g", "kg", "ml", "L"],
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    images: [String],

    unitType: {
      type: String,
      enum: ["weight", "volume"],
      required: true,
    },

    variants: [variantSchema],

    countInStock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
