import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MessageSender from "../components/MessageSender";
import axios from "axios";
import { socket } from "../socket";
import { motion } from "framer-motion";

const MessagesPanel = ({ receiver }) => {
  const [messages, setMessages] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0); // 🔁 trigger to refetch

  const reduxReceiverId = useSelector((state) => state.chat.receiverId);
  const senderId = useSelector((state) => state.auth.user?._id);

  // Final receiverId resolves to passed prop OR fallback to redux
  const receiverId = receiver || reduxReceiverId;

  console.log("📌 Rendered MessagesPanel");
  console.log("🧾 senderId:", senderId);
  console.log("🧾 receiverId:", receiverId);
  console.log("🧾 reloadTrigger:", reloadTrigger);




  // ✅ Fetch messages on initial load or trigger
  useEffect(() => {
    const fetchMessages = async () => {
      if (!receiverId || !senderId) {
        console.log("⏳ Waiting for senderId or receiverId...");
        return;
      }

      console.log("📥 Fetching messages from backend...");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/messages/chats/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ Messages fetched:", res.data);
        setMessages(res.data);
      } catch (err) {
        console.error(
          "❌ Failed to load messages:",
          err?.response?.data || err.message
        );
      }
    };

    fetchMessages();
  }, [receiverId, senderId, reloadTrigger]);

  // ✅ Listen for real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      console.log("📥 Received socket message:", msg);
      console.log("🧾 receiverId in panel:", receiverId);
      console.log(
        "🧾 sender in msg:",
        msg.sender,
        "receiver in msg:",
        msg.receiver
      );

      if (msg.sender === receiverId || msg.receiver === receiverId) {
        console.log("✅ Matching receiver — updating messages");
        setMessages((prev) => [...prev, msg]);
        setReloadTrigger((prev) => prev + 1); // 🔁 Trigger refetch
      } else {
        console.log("⛔ Not matching current receiver — ignoring message");
      }
    };

    socket.on("receiveMessage", handleReceive);
    console.log("📡 Listening for socket message events...");

    return () => {
      socket.off("receiveMessage", handleReceive);
      console.log("🛑 Stopped listening to socket message events.");
    };
  }, [receiverId]);
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("📩 Frontend received message via socket:", data); // 👈 Add this
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
  <motion.div
  initial={{ x: "-100vw", opacity: 0 }}   // Start from far left
      animate={{ x: 0, opacity: 1 }}           // Slide to original position
      transition={{ type: "spring", stiffness: 30, duration: 0.5 }}
    className={`${receiver ? "h-full" : "h-screen"} p-4 bg-inherit bg-center`}
    style={{ backgroundImage: "url('https://media.istockphoto.com/id/1403848173/vector/vector-online-chatting-pattern-online-chatting-seamless-background.jpg?s=612x612&w=0&k=20&c=W3O15mtJiNlJuIgU6S9ZlnzM_yCE27eqwTCfXGYwCSo=')" }} // or external URL
  >
      <div className="max-w-2xl bg-[#fbfaf8] border h-full flex flex-col justify-between p-6 rounded-3xl border-gray-300 mx-auto space-y-3">
        {/* 💬 Message List */}
        <div className="space-y-3 overflow-y-auto scrollbar-none max-h-[75vh]">
          {messages.map((msg, index) => {
            const isSender = msg.sender === senderId;
            return (
              <div
                key={index}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow ${
                    isSender
                      ? "bg-white text-gray-800 rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* 📤 Message Input */}
        <MessageSender
          socket={socket}
          setMessages={setMessages}
          senderId={senderId}
          receiverId={receiverId}
          setReloadTrigger={setReloadTrigger}
        />
      </div>
    </motion.div>
  );
};

export default MessagesPanel;
