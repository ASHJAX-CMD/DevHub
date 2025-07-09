const Chat = require("../models/chatModel.js");
const Message = require("../models/messageModel.js");

// POST /api/messages/send
const sendMessage = async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user.id; // From auth middleware

  console.log("📬 /api/messages/send hit!");
  console.log("📨 Received body:", req.body);
  console.log("👤 Sender ID from token:", senderId);
  console.log("👤 Receiver ID from body:", receiverId);
  console.log("📝 Message Text:", text);

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    console.log(chat ? "💬 Existing chat found" : "📭 No chat found, creating new");

    if (!chat) {
      chat = new Chat({ participants: [senderId, receiverId] });
      await chat.save();
      console.log("✅ Chat created with participants:", chat.participants);
    }

    const newMessage = new Message({
      chatId: chat._id,
      sender: senderId,
      receiver: receiverId,
      text,
    });

    await newMessage.save();
    console.log("✅ Message saved:", newMessage.text);

    chat.lastMessage = newMessage._id;
    await chat.save();

    // Real-time emit
    const receiverSocketId = global.userSocketMap.get(receiverId);
    const senderSocketId = global.userSocketMap.get(senderId);

    if (receiverSocketId) {
      console.log(`📡 Emitting to socket ${receiverSocketId} for receiver ${receiverId}`);
      req.io.to(receiverSocketId).emit("receiveMessage", newMessage);
    } else {
      console.log("⚠️ No socket found for receiver:", receiverId);
    }

    if (senderSocketId) {
      console.log(`📡 Emitting back to sender (${senderId}) for instant UI update`);
      req.io.to(senderSocketId).emit("receiveMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("❌ Error in sendMessage:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
};

// GET /api/messages/chats/:receiverId
const getMessagesWithUser = async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.receiverId;

  console.log("📥 /api/messages/chats/:receiverId hit!");
  console.log("👤 Sender:", senderId);
  console.log("👤 Receiver:", receiverId);

  try {
    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      console.log("📭 No chat found yet.");
      return res.status(200).json([]);
    }

    const messages = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 });
    console.log(`💬 Found ${messages.length} messages`);

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error loading messages:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// GET /api/messages/online-users
const getOnlineUsers = (req, res) => {
  try {
    const onlineUserIds = Array.from(global.onlineUsers.keys());
    console.log("🟢 Online users:", onlineUserIds);
    res.status(200).json(onlineUserIds);
  } catch (err) {
    console.error("❌ Failed to fetch online users:", err);
    res.status(500).json({ message: "Failed to fetch online users" });
  }
};

// GET /api/messages/chat-users
const getChatUsers = async (req, res) => {
  const userId = req.user.id;
  console.log("👤 Getting chat users for:", userId);

  try {
    const chats = await Chat.find({ participants: userId }).populate({
      path: "participants",
      select: "_id username email",
    });

    const users = chats
      .map((chat) => chat.participants.find((p) => p._id.toString() !== userId))
      .filter(Boolean);

    console.log(`💬 Found ${users.length} chat users`);
    res.status(200).json(users);
  } catch (err) {
    console.error("❌ Failed to fetch chat users:", err);
    res.status(500).json({ message: "Failed to load chat users" });
  }
};

module.exports = {
  getOnlineUsers,
  sendMessage,
  getMessagesWithUser,
  getChatUsers,
};
