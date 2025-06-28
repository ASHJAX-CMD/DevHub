import React, { useState } from "react";
import axios from "axios";

import { socket } from "../socket"; // ✅ adjust path as needed

const MessageSender = ({receiverId,senderId}) => {
  const [message, setMessage] = useState("");



  const handleSend = async () => {
  if (!message.trim() || !receiverId || !senderId) return;

  const newMessage = {
    senderId,
    receiverId,
    text: message,
  };

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/api/messages/send",
      newMessage,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📤 Emitting socket message:", res.data); // 👈 Add this
    socket.emit("sendMessage", res.data); // ✅ emits to backend
    setMessage("");
  } catch (err) {
    console.error("🚨 Message send failed:", err?.response?.data || err.message);
  }
};

  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <input
        type="text"
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 border rounded-md"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};

export default MessageSender;
