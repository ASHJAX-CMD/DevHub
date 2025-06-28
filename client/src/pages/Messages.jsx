import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MessagesPanel from "../components/MessagesPanel";
import SearchProfile from "../components/SearchProfile";
import { useSelector } from "react-redux";

const Messages = () => {
  const navigate = useNavigate();
  const [reciverId,setReceiverId] = useState(null)
  const [chatUsers, setChatUsers] = useState([]);
    const senderId = useSelector((state) => state.auth.user?._id);
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/messages/chat-users",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setChatUsers(res.data);
      } catch (error) {
        console.error("❌ Failed to load chat users", error);
      }
    };

    fetchChatUsers();
  }, []);

  return (
    <div className="flex h-screen bg-[#fbfaf8] overflow-hidden">
      {/* LEFT: Chat User List */}
      <div className="w-1/3 border-r overflow-y-auto p-4 space-y-4">
        <SearchProfile />
        {chatUsers.map((user) => (
          <div
            key={user._id}
            className={`p-3 border rounded-lg bg-white shadow hover:bg-gray-50 cursor-pointer ${
              user._id === senderId ? "border-blue-500" : ""
            }`}
            onClick={() => setReceiverId(user._id)}
          >
            <p className="font-semibold text-black">{user.username}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
        ))}
      </div>

      {/* RIGHT: Chat Panel */}
      <div className="flex-1 overflow-y-auto p-4">
        {reciverId ? (
          
            <MessagesPanel

              receiver={reciverId}
            />
          
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
