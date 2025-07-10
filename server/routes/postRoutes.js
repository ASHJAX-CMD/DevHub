const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload"); // ✅ No destructuring
const verifyToken = require("../middleware/verifyToken");
const createPost = require("../controllers/createPost");
const { fetchPost, userFetchPost } = require("../controllers/fetchPost");
const toggleShare = require("../controllers/shareController");
const Post = require("../models/post");

// ✅ Create Post
router.post(
  "/create",
  verifyToken,
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "file", maxCount: 1 }
  ]),
  createPost
);

// ✅ Fetch all posts
router.get("/fetch", verifyToken, fetchPost);

// ✅ Fetch posts by current user
router.get("/userPosts", verifyToken, userFetchPost);

// ✅ Like / Unlike a post
router.put("/:postId/like", verifyToken, async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      msg: hasLiked ? "Unliked the post" : "Liked the post",
      likesCount: post.likes.length,
      likedByUser: !hasLiked,
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// ✅ Share Post
router.post("/:postId/share", verifyToken, toggleShare);

module.exports = router;
