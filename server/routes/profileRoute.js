const express = require("express");
const router = express.Router();
const userProfile = require("../controllers/userProfile"); // controller function
const verifyToken = require("../middleware/verifyToken");
const profileUpload = require("../middleware/profileUpload");
const User = require("../models/userModel");

// GET /api/userprofile/currentuserprofile
router.get("/currentuserprofile", verifyToken, userProfile);


router.put("/update-profile-image", verifyToken, profileUpload, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profileImage = req.file.filename;
    await user.save();

    res.json({ message: "✅ Profile image updated", profileImage: user.profileImage });
  } catch (err) {
    console.error("❌ Error uploading profile image:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

module.exports = router;
