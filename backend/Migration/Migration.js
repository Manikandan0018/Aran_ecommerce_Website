import Product from "../models/Product.js";

export const migrateProducts = async (req, res) => {
  try {
    const products = await Product.find();

    for (const product of products) {
      if (!product.variants) continue;

      const newVariants = product.variants
        .map((v) => {
          // OLD FORMAT: { weight: "50g", price: 80 }
          if (v.weight) {
            const value = parseInt(v.weight);
            const unit = v.weight.replace(/[0-9]/g, "");

            return {
              value: value,
              unit: unit,
              price: v.price,
            };
          }

          // ALREADY NEW FORMAT
          if (v.value && v.unit) {
            return v;
          }

          return null;
        })
        .filter(Boolean);

      product.variants = newVariants;

      if (!product.unitType) {
        product.unitType = "weight";
      }

      await product.save();
    }

    res.json({ message: "Products migrated successfully" });
  } catch (error) {
    console.error("MIGRATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
