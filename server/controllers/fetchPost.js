const Post = require("../models/post");
const User = require("../models/userModel");

const fetchPost = async (req, res) => {
  try {
    const currentUserId = req.userId; // comes from your JWT middleware
    const currentUser = await User.findById(currentUserId).select("following");

    // Use Set for faster lookups (optional, better for 1000+ entries)
    const followingSet = new Set(currentUser.following.map(id => id.toString()));

    const posts = await Post.find()
      .populate("userId", "fullName username email _id profileImage")
      .sort({ createdAt: -1 });

    const postsWithFollowStatus = posts.map(post => {
      const isFollowing = followingSet.has(post.userId._id.toString());
      return {
        ...post.toObject(),
        userId: {
          ...post.userId.toObject(),
          isFollowing,
        }
      };
    });

    res.json(postsWithFollowStatus);
  } catch (err) {
    console.error("Fetch posts failed:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = fetchPost;
