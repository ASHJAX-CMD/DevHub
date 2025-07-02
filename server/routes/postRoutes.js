const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");
const createPost = require("../controllers/createPost"); // Not destructured
const fetchPost = require("../controllers/fetchPost"); // Not destructured


// POST /api/posts/create
router.post("/create",verifyToken,upload, createPost);
router.get("/fetch",verifyToken,fetchPost);
module.exports = router;
