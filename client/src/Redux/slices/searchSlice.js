import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ✅ Axios instance with dynamic base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔍 Async thunk for searching users
export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (username, { rejectWithValue }) => {
    try {
      const res = await API.get('/api/users/search', {
        params: { username },
      });
      return res.data; // matched users
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
