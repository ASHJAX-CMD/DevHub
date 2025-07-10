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
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const res = await API.get("/api/posts/fetch", authHeader());
  return res.data;
});

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

// 🔁 Follow / Unfollow
export const toggleFollow = createAsyncThunk(
  "posts/toggleFollow",
  async ({ userId, isCurrentlyFollowing }) => {
    const url = isCurrentlyFollowing
      ? `/api/follow/unfollow/${userId}`
      : `/api/follow/follow/${userId}`;

console.log("👉 toggleFollow: userId =", userId);

    await API.put(url, {}, authHeader());
    return { userId, isFollowing: !isCurrentlyFollowing };
  }
);

// ❤️ Like / Unlike
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }, { rejectWithValue }) => {
    try {
      const res = await API.put(
        `/api/posts/${postId}/like`,
        {},
        authHeader()
      );
      return { postId, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    allPosts: [],
    userPosts: [],
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
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

      // Fetch User Posts
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

      // Follow / Unfollow
.addCase(toggleFollow.fulfilled, (state, action) => {
  const { userId, isFollowing } = action.payload;

  // 🔁 Update in allPosts
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

  // 🔁 Also update in userPosts
  state.userPosts = state.userPosts.map((post) => {
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
})


      // Share Post
      .addCase(sharePost.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const post = state.allPosts.find((p) => p._id === postId);
        if (post) {
          post.sharesCount = (post.sharesCount || 0) + 1;
        }
      })

      // Like / Unlike
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { postId, likesCount, likedByUser } = action.payload;
        state.allPosts = state.allPosts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              likesCount,
              likedByUser,
            };
          }
          return post;
        });
      });
  },
});

export default postSlice.reducer;
