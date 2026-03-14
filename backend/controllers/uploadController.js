import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading to Cloudinary...");

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      resource_type: "auto",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    // remove temporary file
    fs.unlinkSync(req.file.path);

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("❌ CLOUDINARY FAILURE:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
