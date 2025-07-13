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
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/register`;
    console.log("Register API URL:", apiUrl);

    try {
      const res = await axios.post(apiUrl, {
        email,
        username,
        fullName,
        password,
      });

      console.log("Register API Success:", res.data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (e) {
      console.error("Register API Error:", e);
      const err = e.response?.data?.message || "Sign up failed";
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// 🚀 Login / Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async ({ email, password }, thunkAPI) => {
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
    console.log("Login API URL:", apiUrl);
    console.log("Login Attempt with:", { email });

    try {
      const res = await axios.post(apiUrl, { email, password });

      console.log("Login API Success:", res.data);
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (error) {
      console.error("Login API Error:", error);
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
      console.log("Logging out user...");
      state.token = null;
      state.error = null;
      state.loading = false;
      state.user = null;
      localStorage.removeItem("token");
    },

    setUser: (state, action) => {
      console.log("Setting user in state:", action.payload);
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
        console.log("Login request pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        console.log("Login request fulfilled:", payload);
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
        console.error("Login request failed:", action.payload);
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 REGISTER
      .addCase(registerUser.pending, (state) => {
        console.log("Register request pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        console.log("Register request fulfilled:", payload);
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
        console.error("Register request failed:", payload);
        state.error = payload;
        state.loading = false;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
