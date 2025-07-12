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
    const userId = req.params.id;     // ID of the profile being viewed
    const viewerId = req.userId;      // ID of the person viewing (from JWT)

    const user = await User.findById(userId)
      .populate("followers", "username fullName profileImage")
      .populate("posts")
      .populate("following", "username fullName profileImage")
      .select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔍 Calculate if viewer is following this public user
    const isFollowing = user.followers.some(
      (follower) => follower._id.toString() === viewerId
    );

    const userWithFlag = {
      ...user.toObject(),
      isFollowing,
    };

    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username profileImage");

    const enrichedPosts = posts.map((post) => {
      const likedByUser = post.likes.includes(viewerId);
      return {
        ...post.toObject(),
        likesCount: post.likes.length,
        likedByUser,
        userId: {
          ...post.userId.toObject(),
          isFollowing, // ✅ Add this so PostCard follow button works
        },
      };
    });

    res.status(200).json({ user: userWithFlag, posts: enrichedPosts });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {PublicUser,getUserProfile};
