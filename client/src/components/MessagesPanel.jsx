import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MessageSender from "../components/MessageSender";
import axios from "axios";
import { socket } from "../socket";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// import chatBg from "../media2/2.png";

const MessagesPanel = ({ receiver }) => {
  const [messages, setMessages] = useState([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const reduxReceiverId = useSelector((state) => state.chat.receiverId);
  const senderId = useSelector((state) => state.auth.user?._id);
  const receiverId = receiver || reduxReceiverId;

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
  const fetchMessages = async () => {
    if (!receiverId || !senderId) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/messages/chats/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Load failed:", err?.response?.data || err.message);
    }
  };

  fetchMessages();
}, [receiverId, senderId,API_URL]); // Fetch once when chat opens

 useEffect(() => {
  if (!socket) return;

  const handleReceive = (msg) => {
    // 🛑 Ignore echoed message on sender's side (we already added it manually)
    if (msg.sender === senderId) return;

    // ✅ Add only if related to this chat
    if (msg.sender === receiverId || msg.receiver === receiverId) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  socket.on("receiveMessage", handleReceive);

  return () => {
    socket.off("receiveMessage", handleReceive);
  };
}, [receiverId, senderId]);


  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 30, duration: 0.5 }}
      className={`${receiver ? "h-full" : "h-screen"} bg-contain rounded-xl bg-inherit bg-center`}
      style={{ backgroundImage: 'url("/media2/2.png")', }}
    >
      <div className={`max-w-2xl bg-black h-full flex flex-col   rounded-3xl border-gray-300 mx-auto  ${
    location.pathname.includes("/direct-message")
      ? "p-6 md:p-0"
      : " md:p-0"
  }`}>
        {/* 🔙 Mobile Back Button */}
        <div className="md:hidden border-b mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-white flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* 💬 Message List */}
        <div className="flex-1 space-y-3 p-2 overflow-y-auto scrollbar-none">
          {messages.map((msg, index) => {
            const isSender = msg.sender === senderId;
            return (
              <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm shadow ${
                    isSender
                      ? "bg-gray-700 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 📤 Message Input */}
        <div className="md:pb-0 p-2 mb-9 md:mb-2 md:pt-2 pt-2 ">
          <MessageSender
            socket={socket}
            setMessages={setMessages}
            senderId={senderId}
            receiverId={receiverId}
            setReloadTrigger={setReloadTrigger}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default MessagesPanel;
