const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Post = require("../models/post");
const Comment = require("../models/commentModel");


const deleteAccountWithCredentials = async (req, res) => {
  try {
    const userId = req.userId;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findById(userId);
    if (!user || user.email !== email) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Optional: delete associated data
    await Post.deleteMany({ userId });
    await Comment.deleteMany({ userId });


    await User.findByIdAndDelete(userId);

    res.json({ message: "✅ Account deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting account:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const changePassword = async (req, res) => {
  try {
    const userId = req.userId; // from verifyToken
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Current password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "✅ Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { changePassword, deleteAccountWithCredentials };
