const Comment = require("../models/commentModel");
const Post = require("../models/post");
const mongoose = require("mongoose");
// POST: Add a comment to a post
exports.createComment = async (req, res) => {
  try {
    console.log("🔥 createComment controller hit");

    const { postId, text } = req.body;
    const userId = req.userId;

    console.log("📥 Incoming request to create comment");
    console.log("🧾 Request body:", req.body);
    console.log("👤 Authenticated user:", userId);

    if (!postId || !text) {
      console.warn("⚠️ postId or text missing");
      return res.status(400).json({ error: "postId and text are required" });
    }

    // Log all current post IDs to verify what's in the DB
    const allPosts = await Post.find({}, '_id');
    console.log("🗂️ All Post IDs in DB:", allPosts.map(p => p._id.toString()));

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      console.error("❌ Invalid ObjectId format:", postId);
      return res.status(400).json({ error: "Invalid postId" });
    }

    console.log("🔍 Checking if post exists:", postId);

    // Try a raw findById
    const post = await Post.findById(postId);
    if (!post) {
      console.error("❌ Post not found using .findById:", postId);
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("✅ Post found. Creating comment...");
    const comment = await Comment.create({ postId, userId, text });
    await comment.populate("userId", "username avatar");
    console.log("✅ Comment successfully created:", comment);

    res.status(201).json(comment);
  } catch (err) {
    console.error("🔥 Error in createComment:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// DELETE: Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    console.log("🗑️ Request to delete comment:", req.params.id);
    const commentId = req.params.id;
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error("❌ Comment not found");
      return res.status(404).json({ error: "Comment not found" });
    }

    console.log("🧾 Found comment:", comment);
    if (comment.userId.toString() !== userId) {
      console.warn("🚫 Unauthorized delete attempt");
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    console.log("✅ Comment deleted");

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error("🔥 Error in deleteComment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

// GET all comments for a post
exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("📥 Getting comments for post:", postId);

    const comments = await Comment.find({ postId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    console.log("📦 Found comments:", comments.length);
    res.status(200).json(comments);
  } catch (err) {
    console.error("🔥 Error in getCommentsForPost:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
