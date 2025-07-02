const express = require("express");
const router = express.Router();
const { followUser, unfollowUser } = require("../controllers/followController");
const verifyToken = require("../middleware/verifyToken"); // your JWT auth middleware

// Follow a user
router.put("/follow/:id", verifyToken, followUser);

// Unfollow a user
router.put("/unfollow/:id", verifyToken, unfollowUser);

module.exports = router;
