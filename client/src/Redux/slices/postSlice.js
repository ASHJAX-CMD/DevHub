import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Axios instance with dynamic base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Auth header helper
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// 🔁 Follow / Unfollow
export const toggleFollow = createAsyncThunk(
  "posts/toggleFollow",
  async ({ userId, isCurrentlyFollowing }) => {
    const url = isCurrentlyFollowing
      ? `/api/follow/unfollow/${userId}`
      : `/api/follow/follow/${userId}`;

    await API.put(url, {}, authHeader());
    return { userId, isFollowing: !isCurrentlyFollowing };
  }
);

// ❤️ Like / Unlike (server update only)
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/api/posts/${postId}/like`, {}, authHeader());
      return { postId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 📤 Share post
export const sharePost = createAsyncThunk(
  "posts/sharePost",
  async ({ postId }, { rejectWithValue }) => {
    try {
      await API.post(`/api/posts/${postId}/share`, {}, authHeader());
      return { postId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch all posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/posts/fetch", authHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 👤 Fetch current user's posts
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/posts/userPosts", authHeader());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🎯 Initial state
const initialState = {
  allPosts: [],
  userPosts: [],
  loading: false,
  error: null,
};

// 🔧 Slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // ✅ Optimistic Like Toggle (instant UI feedback)
    toggleLikeState: (state, action) => {
      const { postId } = action.payload;

      const toggle = (post) => {
        if (post._id !== postId) return post;

        const liked = post.likedByUser;
        return {
          ...post,
          likedByUser: !liked,
          likesCount: liked ? post.likesCount - 1 : post.likesCount + 1,
        };
      };

      state.allPosts = state.allPosts.map(toggle);
      state.userPosts = state.userPosts.map(toggle);
    },

    // ✅ Update actual like state from server
    updateLikeState: (state, action) => {
      const { postId, likesCount, likedByUser } = action.payload;

      const update = (post) =>
        post._id === postId ? { ...post, likesCount, likedByUser } : post;

      state.allPosts = state.allPosts.map(update);
      state.userPosts = state.userPosts.map(update);
    },
  },

  extraReducers: (builder) => {
    builder

      // 📥 Fetch all posts
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

      // 📥 Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPosts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch user's posts";
      })

      // 🔁 Toggle Follow
      .addCase(toggleFollow.fulfilled, (state, action) => {
        const { userId, isFollowing } = action.payload;

        const updateFollow = (post) => {
          if (post.userId._id !== userId) return post;

          return {
            ...post,
            userId: {
              ...post.userId,
              isFollowing,
            },
          };
        };

        state.allPosts = state.allPosts.map(updateFollow);
        state.userPosts = state.userPosts.map(updateFollow);
      })

      // 📤 Share Post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId } = action.payload;

        const update = (post) =>
          post._id === postId
            ? { ...post, sharesCount: (post.sharesCount || 0) + 1 }
            : post;

        state.allPosts = state.allPosts.map(update);
      })

      // ✅ Server confirmed Like / Unlike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likesCount, likedByUser } = action.payload;

        const update = (post) =>
          post._id === postId ? { ...post, likesCount, likedByUser } : post;

        state.allPosts = state.allPosts.map(update);
      });
  },
});

// ✅ Export
export default postSlice.reducer;
export const { toggleLikeState, updateLikeState } = postSlice.actions;
