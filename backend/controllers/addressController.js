import User from "../models/User.js";

// 🔹 Get Logged In User Addresses
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

// 🔹 Add New Address
export const addUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to save address" });
  }
};

// 🔹 Delete Address
export const deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.id,
    );

    await user.save();

    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address" });
  }
};
