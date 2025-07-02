require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const Chat = require("./models/chatModel");

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP + Socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
  
// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoute"));
app.use("/api/follow", require("./routes/followRoute"));
// Health Check
app.get("/", (req, res) => res.send("✅ API is running"));

// Global user-socket map
global.userSocketMap = new Map();

// Socket.io Logic
io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on("register", async (userId) => {
    if (!userId) return;

    socket.userId = userId;
    global.userSocketMap.set(userId, socket.id);
    console.log(`👤 User ${userId} registered with socket ${socket.id}`);

    try {
      const chats = await Chat.find({ participants: userId });
      const dmUserIds = new Set();

      chats.forEach((chat) => {
        chat.participants.forEach((id) => {
          const idStr = id.toString();
          if (idStr !== userId) dmUserIds.add(idStr);
        });
      });

      const onlineDMUsers = Array.from(dmUserIds).filter((id) =>
        global.userSocketMap.has(id)
      );

      // Send online DM list to current user
      socket.emit("onlineUsersList", onlineDMUsers);
      console.log(`📤 Sent to ${userId}:`, onlineDMUsers);

      // Notify each online DM user that current user is online
      onlineDMUsers.forEach((otherUserId) => {
        const otherSocketId = global.userSocketMap.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit("userOnline", userId);
        }
      });

      // Update their online list too
      for (const otherUserId of onlineDMUsers) {
        const otherChats = await Chat.find({ participants: otherUserId });
        const otherDMs = new Set();

        otherChats.forEach((chat) => {
          chat.participants.forEach((id) => {
            const idStr = id.toString();
            if (idStr !== otherUserId && global.userSocketMap.has(idStr)) {
              otherDMs.add(idStr);
            }
          });
        });

        const otherSocketId = global.userSocketMap.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit("onlineUsersList", Array.from(otherDMs));
        }
      }
    } catch (err) {
      console.error("❌ Error in register:", err);
    }
  });

  socket.on("disconnect", async () => {
    const userId = socket.userId;
    if (!userId) return;

    global.userSocketMap.delete(userId);
    console.log(`🔴 User ${userId} disconnected (socket ${socket.id})`);

    try {
      const chats = await Chat.find({ participants: userId });
      const dmUserIds = new Set();

      chats.forEach((chat) => {
        chat.participants.forEach((id) => {
          const idStr = id.toString();
          if (idStr !== userId) dmUserIds.add(idStr);
        });
      });

      // Notify each relevant DM user
      dmUserIds.forEach((otherUserId) => {
        const otherSocketId = global.userSocketMap.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit("userOffline", userId);
        }
      });

      // Update their online DM list
      for (const otherUserId of dmUserIds) {
        const otherSocketId = global.userSocketMap.get(otherUserId);
        if (otherSocketId) {
          const otherChats = await Chat.find({ participants: otherUserId });
          const onlineDMs = new Set();

          otherChats.forEach((chat) => {
            chat.participants.forEach((id) => {
              const idStr = id.toString();
              if (idStr !== otherUserId && global.userSocketMap.has(idStr)) {
                onlineDMs.add(idStr);
              }
            });
          });

          io.to(otherSocketId).emit("onlineUsersList", Array.from(onlineDMs));
        }
      }
    } catch (err) {
      console.error("❌ Error during disconnect:", err);
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
