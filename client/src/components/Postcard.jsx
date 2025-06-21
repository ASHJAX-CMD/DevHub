import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaRegCommentDots, FaPaperPlane } from 'react-icons/fa';

const PostCard = ({ content, images, file, createdAt, userId }) => {
  const [activeTab, setActiveTab] = useState("Code");
  const [code, setCode] = useState("");

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

  return (
    <div className="mb-6">
      {/* Tabs */}
      <div className="flex ml-20">
        <div
          onClick={() => setActiveTab("Code")}
          className={`rounded-tr-2xl p-4 w-[5%] cursor-pointer text-center ${
            activeTab === "Code" ? "font-bold bg-white h-[3rem]" : "text-xs shadow-sm bg-white h-[3rem]"
          }`}
        >
          Code
        </div>
        <div
          onClick={() => setActiveTab("Image")}
          className={`rounded-tr-2xl p-4 w-[5%] cursor-pointer text-center ${
            activeTab === "Image" ? "font-bold bg-white h-[3rem]" : "text-xs shadow-sm bg-white h-[3rem]"
          }`}
        >
          Image
        </div>
      </div>

      {/* Main Card */}
      <div className="rounded-tr-md p-5 w-[40%] ml-20  bg-white shadow-sm flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex justify-between items-center border-t border-b border-black py-2">
          <div className="flex items-center space-x-3">
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
              {userId?.username ? userId.username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <p className="font-semibold">{userId?.username || "Unknown User"}</p>
              <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
            </div>
          </div>
          <button className="text-green-600 font-semibold hover:underline">Follow</button>
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
