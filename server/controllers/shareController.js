const Post = require("../models/post");

const toggleShare = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    post.shares.push({ userId, sharedAt: new Date() });
    await post.save();

    res.status(200).json({
      msg: "Post shared successfully",
      shareCount: post.shares.length,
    });
  } catch (err) {
    console.error("Error sharing post:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = toggleShare;
