const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authmiddleware"); // update path if needed
const { getMessagesWithUser } = require("../controllers/messageController");
const {getChatUsers} = require("../controllers/messageController")
const {getOnlineUsers} = require("../controllers/messageController")


router.get("/chats/:receiverId", protect, getMessagesWithUser);
router.post("/send", protect, (req, res, next) => {
  console.log("📬 /api/messages/send hit!");
  next();
}, sendMessage);
router.get("/chat-users", protect, getChatUsers);
router.get("/online-users", protect, getOnlineUsers);


module.exports = router;
