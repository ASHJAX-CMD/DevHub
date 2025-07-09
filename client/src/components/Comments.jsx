import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../Redux/slices/commentSlice";
import { AiOutlineDelete } from "react-icons/ai";

const Comments = ({ postId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { commentsByPost, loading } = useSelector((state) => state.comments);

  const comments = commentsByPost[postId] || [];
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchComments(postId));
  }, [postId, dispatch]);

  const handleAddComment = () => {
    if (text.trim()) {
      dispatch(addComment({ postId, text }));
      setText("");
    }
  };

  const handleDeleteComment = (id) => {
    dispatch(deleteComment(id));
  };

  return (
    <motion.div
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 30, duration: 0.5 }}
      className="
        w-full h-auto 
        md:w-full md:max-h-full 
        bg-black p-4 shadow-lg rounded-xl 
        border border-gray-800 overflow-y-auto
      "
    >
      <h3 className="font-semibold text-white mb-2">Comments</h3>

      <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-none">
        {loading ? (
          <p className="text-sm text-gray-200">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-200">💬 No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-black p-2 mb-4 border-b border-gray-700 flex justify-between items-center"
            >
              <div className="min-w-0">
                <p className="text-sm text-white break-words">{comment.text}</p>
                <p className="text-xs text-gray-500">
                  by {comment.userId?.username || "Anonymous"}
                </p>
              </div>
              {user?._id === comment.userId?._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-600 hover:underline"
                >
                  <AiOutlineDelete />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <div className="mt-2 flex w-full min-w-0">
        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 w-0 min-w-0 p-2 border border-gray-700 rounded-l-md text-sm bg-black text-white"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-600 text-white px-3 py-2 rounded-r-md text-sm"
        >
          Post
        </button>
      </div>
    </motion.div>
  );
};

export default Comments;
