const Post = require("../models/post");
const User = require('../models/userModel'); // ✅ Add this

const fetchPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "fullName username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = fetchPost;
