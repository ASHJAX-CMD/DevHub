// Redux/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//share count fetcher
export const sharePost = createAsyncThunk(
  "posts/sharePost",
  async ({ postId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Fetch all posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:5000/api/posts/fetch", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
});
// 👇 Add below your other imports
export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/posts/userPosts", {
        headers: {
          Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// ✅ Follow / Unfollow
export const toggleFollow = createAsyncThunk(
  "posts/toggleFollow",
  async ({ userId, isCurrentlyFollowing }) => {
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

// ✅ Like / Unlike a post
export const toggleLike = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    userPosts: [], // ✅ NEW
    loading: false,
    error: null,
  },

  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Posts
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
      // ✅ Fetch user's own posts
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
      })
         //share
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
