const multer = require("multer");
const path = require("path");

// Define profile image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile"); // store profile images in a separate folder
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

// Allow only images
const allowedExtensions = [".jpg", ".jpeg", ".png"];
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
  }
};

// Export single upload handler for profileImage
const profileUpload = multer({ storage, fileFilter }).single("profileImage");

module.exports = profileUpload;
