// src/Redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");

// 📥 Fetch current profile data
export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:5000/api/userprofile/currentuserprofile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// 📝 Update bio and fullName
export const updateProfileInfo = createAsyncThunk(
  "profile/updateProfileInfo",
  async ({ fullName, bio }, thunkAPI) => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/users/update-profile-info",
        { fullName, bio },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to update profile info");
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
      const res = await axios.put("http://localhost:5000/api/userprofile/update-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.profileImage;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to upload image");
    }
  }
);

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
      // FETCH
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
        state.profile.profileImage = action.payload;
      });
  },
});

export const { clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
