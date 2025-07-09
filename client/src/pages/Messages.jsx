import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MessagesPanel from "../components/MessagesPanel";
import SearchProfile from "../components/SearchProfile";
import { ArrowLeft } from "lucide-react"; // icon for back

const Messages = () => {
  const [reciverId, setReceiverId] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);
  const senderId = useSelector((state) => state.auth.user?._id);
  const onlineUsers = useSelector((state) => state.online.onlineUsers);

  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/messages/chat-users", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setChatUsers(res.data);
      } catch (error) {
        console.error("❌ Failed to load chat users", error);
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* LEFT: Chat List */}
      <div
        className={`w-full md:w-1/3 border-r overflow-y-auto p-4 space-y-4 ${
          reciverId ? "hidden md:block" : "block"
        }`}
      >
        <SearchProfile />
        {chatUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          return (
            <div
              key={user._id}
              className={`relative p-3 border rounded-lg bg-black shadow hover:bg-gray-900 cursor-pointer ${
                user._id === senderId ? "border-blue-500" : ""
              } ${isOnline ? "border-green-500" : ""}`}
              onClick={() => setReceiverId(user._id)}
            >
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          );
        })}
      </div>

      {/* RIGHT: Messages Panel */}
      <div
        className={`w-full md:flex-1 overflow-y-auto p-4 ${
          reciverId ? "block" : "hidden md:block"
        }`}
      >
        {/* Mobile Back Button */}


        {reciverId ? (
          <MessagesPanel receiver={reciverId} />
        ) : (
          <div className="text-gray-500 text-center mt-10">
            💬 Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;