import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaRegCommentDots, FaPaperPlane } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleFollow } from "../Redux/slices/postSlice";

const PostCard = ({ content, images, file, createdAt, userId }) => {
  const [activeTab, setActiveTab] = useState("Code");
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const handleFollowToggle = () => {
    if (!userId?._id) return;

    dispatch(
      toggleFollow({
        userId: userId._id,
        isCurrentlyFollowing: userId.isFollowing,
      })
    );
  };

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/uploads/${file}`);
        setCode(res.data);
      } catch (err) {
        console.error("Failed to fetch code:", err);
        setCode("⚠️ Unable to load file content.");
      }
    };

    if (file) fetchFile();
  }, [file]);

  const getFirstLetter = (str) => {
    if (!str || typeof str !== "string") return "U";
    return str.charAt(0).toUpperCase();
  };

  return (
    <div className="mb-6">
      {/* Tabs */}
      <div className="flex ml-20">
        {["Code", "Image"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-tr-2xl p-4 w-[5%] cursor-pointer text-center ${
              activeTab === tab
                ? "font-bold bg-white h-[3rem]"
                : "text-xs shadow-sm bg-white h-[3rem]"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Main Card */}
      <div className="rounded-tr-md p-5 w-[40%] ml-20 bg-white shadow-sm flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-t border-b border-black py-2">
          <div className="flex items-center space-x-3">
            {/* 👤 Profile Circle */}
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center text-sm font-bold bg-black text-white">
              {userId?.profileImage ? (
                <img
                  src={`http://localhost:5000/uploads/profile/${userId.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getFirstLetter(userId?.username)
              )}
            </div>

            {/* Username & Time */}
            <div>
              <p className="font-semibold">{userId?.username || "Unknown User"}</p>
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollowToggle}
            className={`font-semibold hover:underline ${
              userId?.isFollowing ? "text-gray-600" : "text-green-600"
            }`}
          >
            {userId?.isFollowing ? "Following" : "Follow"}
          </button>
        </div>

        {/* Content */}
        {activeTab === "Code" ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{content}</p>
            <div className="text-xs text-blue-700">📄 File: {file}</div>
            <div className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap overflow-y-auto max-h-56">
              {code}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {images?.length > 0 ? (
              images.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`Post image ${i}`}
                  className="rounded max-h-56 object-cover"
                />
              ))
            ) : (
              <p className="text-gray-400">No images uploaded.</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-black flex justify-around text-sm text-black">
          <div className="flex items-center space-x-1 cursor-pointer hover:scale-105 transition">
            <FaThumbsUp />
            <span>Like</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:scale-105 transition">
            <FaRegCommentDots />
            <span>Comment</span>
          </div>
          <div className="flex items-center space-x-1 cursor-pointer hover:scale-105 transition">
            <FaPaperPlane />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
