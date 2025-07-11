const express = require("express");
const router = express.Router();
const {changePassword,deleteAccountWithCredentials} = require("../controllers/settingController")
const verifyToken = require("../middleware/verifyToken"); // your JWT auth middleware
const Post = require("../models/post");


router.post("/change-password", verifyToken, changePassword);

router.delete("/delete-account", verifyToken, deleteAccountWithCredentials);
module.exports = router;