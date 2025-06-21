// src/Redux/slices/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: localStorage.getItem("token") || null,
  error: null,
  loading: false,
  user: null,
  
};

export const registerUser = createAsyncThunk("auth/registerUser",
  async ({email,username,fullName,password},thunkAPI)=>{
    try{
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",{
          email,username,fullName,password
        }
      );
      localStorage.setItem("token",res.data.token)
      console.log("Login successful:", res.data);

      return res.data;
    }
    catch(e){
      const err = e.response?.data?.message || "Sign UP failed From FRONTend";
      return thunkAPI.rejectWithValue(err);
    }
  }
)


export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      console.log("Login successful:", response.data);

      return response.data;
    } catch (error) {
      const errmsg = error.response?.data?.message || "Login Failed";
      console.error("Error during login:", errmsg);
      return thunkAPI.rejectWithValue(errmsg);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    RegisterSuccess: (state, action) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        console.log("Payload in fulfilled:", payload);
        state.loading = false;
        state.token = payload.token;
        state.user = {
          _id: payload._id,
          username: payload.username,
          email: payload.email,
          fullName: payload.fullName,
        };
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(registerUser.fulfilled,(state,{payload})=>{
        state.loading=false;
        state.token=payload.token,
        state.user = {
           username: payload.username,
          email: payload.email,
          fullName: payload.fullName,
        };
        
      })
      .addCase(registerUser.rejected,(state,{payload})=>{
        state.error=payload;
        state.loading = false;
      })
  },
});

export const { RegisterSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
