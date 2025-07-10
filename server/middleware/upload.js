const multer = require("multer");
const path = require("path");

// Setup storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Allowed extensions
const allowedExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".c", ".cpp", ".java", ".txt", ".md"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || file.fieldname === "images") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

// ✅ Export multer instance
const upload = multer({ storage, fileFilter });

module.exports = upload;
