import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for searching users
export const searchUsers = createAsyncThunk(
  'search/searchUsers',
  async (username, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/search', {
        params: { username },
      });
      return res.data; // array of matched users
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Server error');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchResults: [],   // renamed from `users`
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.loading = false;
      state.error = null;
    }
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
