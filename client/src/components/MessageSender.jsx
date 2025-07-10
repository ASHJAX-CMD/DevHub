import React, { useState } from "react";
import axios from "axios";

const MessageSender = ({
  socket,
  senderId,
  receiverId,
  setMessages,
  setReloadTrigger,
}) => {
  const [text, setText] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const message = {
      receiverId,
      text: text.trim(),
    };

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(`${API_URL}/api/messages/send`, message, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const savedMessage = res.data;

      socket.emit("sendMessage", savedMessage);

      setMessages((prev) => [...prev, savedMessage]);
      setReloadTrigger((prev) => prev + 1);
      setText("");
    } catch (err) {
      console.error(
        "❌ Failed to send message:",
        err?.response?.data || err.message
      );
      alert("Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSend}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageSender;
