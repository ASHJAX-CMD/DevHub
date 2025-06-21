const Post = require("../models/post");
const User = require("../models/userModel"); // You need to import this

const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.userId; // ✅ from verifyToken middleware

    // Validate input
    if (!content || !req.files || !req.files.file || !req.files.file[0]) {
      return res.status(400).json({ error: "Content and code file are required" });
    }

    // Process files
    const images = req.files.images ? req.files.images.map((file) => file.filename) : [];
    const file = req.files.file[0].filename;

    // Create and save post
    const post = new Post({
      userId,
      content,
      images,
      file,
    });

    const savedPost = await post.save();

    // Update user's posts array
    await User.findByIdAndUpdate(userId, {
      $push: { posts: savedPost._id },
    });

    // Send response after everything is done
    res.status(201).json({
      message: "✅ Post created successfully",
      postId: savedPost._id,
    });

  } catch (err) {
    console.error("❌ Error creating post:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = createPost;
