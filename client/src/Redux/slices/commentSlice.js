import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌐 Dynamic API base URL for production + local
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Helper to get auth headers
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch all comments for a post
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    console.log("🟡 Fetching comments for postId:", postId);
    const response = await API.get(`/api/comments/${postId}`, authHeader());
    console.log("🟢 Fetched comments:", response.data);
    return { postId, comments: response.data };
  }
);

// Add a new comment to a post
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, text }) => {
    console.log("🟡 Adding comment:", { postId, text });
    const response = await API.post(
      "/api/comments",
      { postId, text },
      authHeader()
    );
    console.log("🟢 Comment added:", response.data);
    return response.data;
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId) => {
    console.log("🟡 Deleting comment:", commentId);
    await API.delete(`/api/comments/${commentId}`, authHeader());
    console.log("🟢 Comment deleted:", commentId);
    return commentId;
  }
);

// Initial state
const initialState = {
  commentsByPost: {},
  loading: false,
  error: null,
};

// Slice
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        console.log("⏳ Fetch comments pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        console.log("✅ Fetch comments fulfilled");
        const { postId, comments } = action.payload;
        state.commentsByPost[postId] = comments;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        console.error("❌ Fetch comments rejected:", action.error.message);
        state.loading = false;
        state.error = "Failed to load comments";
      })

      .addCase(addComment.fulfilled, (state, action) => {
        console.log("✅ Comment added to Redux state:", action.payload);
        const comment = action.payload;
        const postId = comment.postId;
        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }
        state.commentsByPost[postId].unshift(comment);
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        console.log("✅ Comment deleted from Redux state:", action.payload);
        const commentId = action.payload;
        for (const postId in state.commentsByPost) {
          state.commentsByPost[postId] = state.commentsByPost[postId].filter(
            (comment) => comment._id !== commentId
          );
        }
      });
  },
});

export default commentSlice.reducer;
