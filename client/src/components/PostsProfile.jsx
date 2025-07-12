import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaThumbsUp, FaRegCommentDots, FaPaperPlane } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toggleFollow, toggleLike, sharePost } from "../Redux/slices/postSlice";
import Comment from "../components/Comments";
import { useSelector } from "react-redux";
import { toggleLikeState } from "../Redux/slices/postSlice";
import { debounce } from "../utils/debounce"; // ✅ import
const PostProfile = ({
  content,
  images,
  file,
  createdAt,
  postId,
  userId,
  likesCount,
  likedByUser,
  sharesCount,
}) => {
  const [activeTab, setActiveTab] = useState("Code");
  const [code, setCode] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const scrollRef = useRef(null);

const postFromRedux = useSelector((state) =>
  state.posts.allPosts.find((p) => p._id === postId)
);

const likes = postFromRedux?.likesCount ?? likesCount;
const liked = postFromRedux?.likedByUser ?? likedByUser;
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
const debouncedLikeAPI = useRef(
  debounce(async (postId) => {
    try {
      await axios.put(
        `${API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Like API failed, reverting UI");
      dispatch(toggleLikeState({ postId })); // ❌ revert optimistic update
    }
  }, 500)
).current;
  const handleShare = () => {
    dispatch(sharePost({ postId }));
    const shareUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("🔗 Post link copied to clipboard!");
    setShared(true);
  };

const handleLikeToggle = () => {
  if (!userId) return;

  dispatch(toggleLikeState({ postId }));  // ✅ Optimistic update
  debouncedLikeAPI(postId);               // ✅ Debounced actual API call
};

  const handleImageScroll = () => {
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveImage(index);
  };

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(`${API_URL}/uploads/${file}`);
        setCode(res.data);
      } catch (err) {
        console.error("Failed to fetch code:", err);
        setCode("⚠️ Unable to load file content.");
      }
    };
    if (file) fetchFile();
  }, [file, API_URL]);

  useEffect(() => {
    setShared(false);
  }, [postId]);

  const getFirstLetter = (str) => {
    if (!str || typeof str !== "string") return "U";
    return str.charAt(0).toUpperCase();
  };

  return (
    <div className="relative flex flex-col ml-0 space-x-0 px-2 w-full">
      {/* Tabs */}
      <div className="flex flex-row mt-4 gap-2 overflow-x-auto scrollbar-none">
        {["Code", "Image"].map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-tr-2xl cursor-pointer text-center border ${
              activeTab === tab
                ? "font-bold text-white bg-black"
                : "text-xs text-white bg-black shadow-sm"
            } w-[4rem] h-[2.5rem] text-sm flex items-center justify-center`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Main Post */}
      <div className="rounded-xl p-4 w-full bg-black border-b-2 shadow-sm flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-t border-b border-white py-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center text-sm font-bold bg-black text-white">
              {userId?.profileImage ? (
                <img
                  src={`${API_URL}/uploads/profile/${userId.profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                getFirstLetter(userId?.username)
              )}
            </div>
            <div>
              <p className="font-semibold text-white">
                {userId?.username || "Unknown User"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === "Code" ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-300">{content}</p>
            <div className="text-xs text-blue-500">📄 File: {file}</div>
            <div className="bg-black p-2 rounded text-sm text-white border border-gray-600 whitespace-pre-wrap overflow-y-auto max-h-56 scrollbar-none">
              {code}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div
              ref={scrollRef}
              onScroll={handleImageScroll}
              className="w-full overflow-x-auto flex snap-x snap-mandatory scroll-smooth rounded gap-2 scrollbar-thin scrollbar-thumb-white scrollbar-track-black"
            >
              {images?.length > 0 ? (
                images.map((img, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-full  h-60 snap-start snap-x rounded overflow-hidden"
                  >
                    <img
                      src={`${API_URL}/uploads/${img}`}
                      alt={`Post image ${i}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No images uploaded.</p>
              )}
            </div>

            {/* Dots for small screens */}
            {images?.length > 1 && (
              <div className="flex justify-center mt-2 space-x-2 lg:hidden">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full transition ${
                      i === activeImage ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                ))}
              </div>
            )}

            {/* Scrollbar label for large screens */}
            {images?.length > 1 && (
              <div className="hidden lg:flex justify-center mt-2 text-xs text-gray-400">
                Scroll → to view more images
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 border-t border-black flex justify-around text-sm text-white">
          <div
            className="flex items-center space-x-1 cursor-pointer hover:scale-105 transition"
            onClick={handleLikeToggle}
          >
            <FaThumbsUp className={liked ? "text-green-600 text-xl" : ""} />
            <span className="ml-1 text-xs">{likes}</span>
            {console.log(likes,liked)}
          </div>
          <div
            className={`flex items-center space-x-1 text-xl cursor-pointer hover:scale-105 transition ${
              showComments ? "text-green-600" : ""
            }`}
            onClick={() => setShowComments((prev) => !prev)}
          >
            <FaRegCommentDots />
          </div>
          <div
            className={`flex items-center text-xl space-x-1 cursor-pointer hover:scale-105 transition ${
              shared ? "text-green-600" : "text-white"
            }`}
            onClick={handleShare}
          >
            <FaPaperPlane />
            <span className="ml-1 text-xs">({sharesCount})</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 p-2 flex flex-col rounded-xl w-full">
          <button
            onClick={() => setShowComments(false)}
            className="text-gray-400 self-end mb-2 text-s"
          >
            close
          </button>
          <Comment postId={postId} />
        </div>
      )}
    </div>
  );
};

export default PostProfile;
