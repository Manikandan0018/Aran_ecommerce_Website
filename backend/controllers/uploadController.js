import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      console.log("❌ No file received");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading to Cloudinary...");

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
    });

    console.log("✅ Cloudinary Upload Success:", result.secure_url);

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("❌ CLOUDINARY FAILURE:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};
