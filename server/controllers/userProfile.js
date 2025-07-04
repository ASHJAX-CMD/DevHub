const User = require("../models/userModel");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // or from JWT (req.userId)

    const user = await User.findById(userId)
      .populate("posts") // optionally populate posts
      .populate("followers", "username fullName") // only return selected fields
      .populate("following", "username fullName")
      .select("-password"); // don't return password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error fetching user profile:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getUserProfile;
