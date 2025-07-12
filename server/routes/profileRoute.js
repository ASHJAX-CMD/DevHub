const express = require("express");
const router = express.Router();
const {getUserProfile,PublicUser} = require("../controllers/userProfile"); // controller function
const verifyToken = require("../middleware/verifyToken");
const profileUpload = require("../middleware/profileUpload");
const User = require("../models/userModel");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
// GET /api/userprofile/currentuserprofile
router.get("/currentuserprofile", verifyToken, getUserProfile);


router.put("/update-profile-image", verifyToken, profileUpload, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Generate filename
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpeg`; // Always convert to jpeg
    const outputPath = path.join(__dirname, "../uploads/profile", filename);

    // Ensure folder exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Process image using sharp
    await sharp(req.file.buffer)
      .resize(300, 300) // Resize to 300x300
      .jpeg({ quality: 80 }) // Compress to 80% quality
      .toFile(outputPath);

    // Save filename to DB

    // Delete old profile image if it exists and is not default
if (user.profileImage && user.profileImage !== "default.jpg") {
  const oldPath = path.join(__dirname, "../uploads/profile", user.profileImage);
  if (fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
}
    user.profileImage = filename;
    await user.save();

    res.json({ message: "✅ Profile image updated", profileImage: filename });

  } catch (err) {
    console.error("❌ Error uploading profile image:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id",verifyToken,PublicUser)
module.exports = router;

module.exports = router;
