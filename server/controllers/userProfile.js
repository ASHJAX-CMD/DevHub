const User = require("../models/userModel");
const Post = require("../models/post");
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

const PublicUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const viewerId = req.userId; // ← optional: for checking if current user liked a post

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profileImage") // ✅ populate user data for frontend

    const enrichedPosts = posts.map((post) => ({
      ...post.toObject(),
      likesCount: post.likes?.length || 0,
      likedByUser: post.likes?.includes(viewerId), // optional
    }));

    res.status(200).json({ user, posts: enrichedPosts });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {PublicUser,getUserProfile};
