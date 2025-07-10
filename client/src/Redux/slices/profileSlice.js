import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Shared Axios instance with base URL
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

// 📥 Fetch current profile data
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const res = await API.get("/api/userprofile/currentuserprofile", authHeader());
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// 📝 Update bio and fullName
export const updateProfileInfo = createAsyncThunk(
  "profile/updateProfileInfo",
  async ({ fullName, bio }, thunkAPI) => {
    try {
      const res = await API.put(
        "/api/users/update-profile-info",
        { fullName, bio },
        authHeader()
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update profile info"
      );
    }
  }
);

// 🖼️ Upload profile image
export const updateProfileImage = createAsyncThunk(
  "profile/updateProfileImage",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await API.put(
        "/api/userprofile/update-profile-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.profileImage; // return filename
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to upload image"
      );
    }
  }
);

// 🔧 Profile Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    error: null,
    profile: null,
  },
  reducers: {
    clearProfileState: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE INFO
      .addCase(updateProfileInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateProfileInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE IMAGE
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImage = action.payload;
        }
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
