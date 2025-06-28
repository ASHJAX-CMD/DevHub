  const Chat = require("../models/chatModel.js");
  const Message = require("../models/messageModel.js");

  // POST /api/messages/send
  const sendMessage = async (req, res) => {
    const { receiverId, text } = req.body;
    const senderId = req.user.id; // assume auth middleware sets this

    try {
      let chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        chat = new Chat({ participants: [senderId, receiverId] });
        await chat.save();
      }

      const newMessage = new Message({
        chatId: chat._id,
        sender: senderId,
        receiver: receiverId,
        text,
      });

      await newMessage.save();

      chat.lastMessage = newMessage._id;
      await chat.save();

  const receiverSocketId = global.onlineUsers[receiverId];
  if (receiverSocketId) {
    console.log(`📡 Emitting to socket ${receiverSocketId} for receiver ${receiverId}`);
    req.io.to(receiverSocketId).emit("receiveMessage", newMessage);
  } else {
    console.log("⚠️ No socket found for receiver:", receiverId);
  }

  const senderSocketId = global.onlineUsers[senderId];
  if (senderSocketId) {
    req.io.to(senderSocketId).emit("receiveMessage", newMessage);
    console.log(`📡 Emitting back to sender (${senderId}) for instant UI update`);
  }

      res.status(201).json(newMessage);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send message" });
    }
  };


  const getMessagesWithUser = async (req, res) => {
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    try {
      const chat = await Chat.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!chat) {
        return res.status(200).json([]); // No chat yet
      }

      const messages = await Message.find({ chatId: chat._id })
        .sort({ createdAt: 1 }); // optional: sort by time

      res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load messages" });
    }
  };

  // GET /api/messages/chat-users
  const getChatUsers = async (req, res) => {
    const userId = req.user.id;

    try {
      const chats = await Chat.find({ participants: userId }).populate({
        path: "participants",
        select: "_id username email", // only send minimal user info
      });

      // remove self from each participant list
      const users = chats
        .map((chat) =>
          chat.participants.find((p) => p._id.toString() !== userId)
        )
        .filter(Boolean); // remove undefined if any

      res.status(200).json(users);
    } catch (err) {
      console.error("❌ Failed to fetch chat users:", err);
      res.status(500).json({ message: "Failed to load chat users" });
    }
  };

  module.exports = { sendMessage,getMessagesWithUser,getChatUsers };
