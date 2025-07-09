const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, commentController.createComment);
router.delete("/:id", verifyToken, commentController.deleteComment);
// route
router.get("/:postId",verifyToken, commentController.getCommentsForPost);

module.exports = router;
