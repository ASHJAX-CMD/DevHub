import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: localStorage.getItem("token") || null,
  error: null,
  loading: false,
  user: null,
};

// 🚀 Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, username, fullName, password }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        fullName,
        password,
      });

      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e) {
      const err = e.response?.data?.message || "Sign up failed";
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// 🚀 Login / Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      const errmsg = error.response?.data?.message || "Login Failed";
      return thunkAPI.rejectWithValue(errmsg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.error = null;
      state.loading = false;
      state.user = null;
      localStorage.removeItem("token");
    },

    // ✅ Overwrite user when profile updates (e.g., after image upload)
    setUser: (state, action) => {
      state.user = {
        _id: action.payload._id,
        username: action.payload.username,
        email: action.payload.email,
        fullName: action.payload.fullName,
        profileImage: action.payload.profileImage || "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔄 LOGIN
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = {
          _id: payload._id,
          username: payload.username,
          email: payload.email,
          fullName: payload.fullName,
          profileImage: payload.profileImage || "",
        };
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.token = payload.token;
        state.user = {
          username: payload.username,
          email: payload.email,
          fullName: payload.fullName,
          profileImage: payload.profileImage || "",
        };
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
