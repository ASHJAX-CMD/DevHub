// Redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/posts/fetch", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
});

export const toggleFollow = createAsyncThunk(
  "posts/toggleFollow",
  async ({ userId, isCurrentlyFollowing }, { dispatch }) => {
    const token = localStorage.getItem("token");
    const url = isCurrentlyFollowing
      ? `http://localhost:5000/api/follow/unfollow/${userId}`
      : `http://localhost:5000/api/follow/follow/${userId}`;

    await axios.put(
      url,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return { userId, isFollowing: !isCurrentlyFollowing };
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.allPosts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch posts";
      })
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;
        // Update isFollowing for all posts from that user
        state.allPosts = state.allPosts.map((post) => {
          if (post.userId._id === userId) {
            return {
              ...post,
              userId: {
                ...post.userId,
                isFollowing,
              },
            };
          }
          return post;
        });
      });
  },
});

export default postSlice.reducer;
