import User from "../models/User.js";

export const getUsers = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await User.countDocuments(keyword);

  const users = await User.find(keyword)
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .select("-password");

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
  });
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.json({ message: "User removed" });
};

export const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;

  await user.save();

  res.json({
    message: user.isBlocked ? "User blocked" : "User unblocked",
  });
};