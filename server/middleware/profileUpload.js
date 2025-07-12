const multer = require("multer");
const path = require("path");

// Use memory storage instead of disk
const storage = multer.memoryStorage();

// Validate file types
const allowedExtensions = [".jpg", ".jpeg", ".png"];
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
  }
};

const profileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
}).single("profileImage");


module.exports = profileUpload;
