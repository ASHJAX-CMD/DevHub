const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const toggleShare = require("../controllers/shareController");
const verifyToken = require("../middleware/verifyToken");
const createPost = require("../controllers/createPost"); // Not destructured
const {fetchPost,  userFetchPost} = require("../controllers/fetchPost"); // Not destructured
const Post = require("../models/post"); 
const toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId; // Assuming JWT middleware sets req.userId

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
};
// POST /api/posts/create
router.post("/create",verifyToken,upload, createPost);
router.get("/fetch",verifyToken,fetchPost);
router.put("/:postId/like", verifyToken, toggleLike);

router.get("/userPosts",verifyToken,userFetchPost)
 router.post("/:postId/share", verifyToken, toggleShare);

module.exports = router;
