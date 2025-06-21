const multer = require("multer");
const path = require("path");

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// File type validation
const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".c", ".cpp", ".java", ".txt", ".md"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// ✅ Export directly the middleware function
const upload = multer({ storage, fileFilter }).fields([
  { name: "images", maxCount: 4 },
  { name: "file", maxCount: 1 }
]);

module.exports = upload;
