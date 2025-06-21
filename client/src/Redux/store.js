import { configureStore } from '@reduxjs/toolkit'
import postReducer from './slices/postSlice'
import authReducer from "./slices/authSlices"
// import navbarReducer from './slices/navbarSlice'
export const store = configureStore({
 reducer: {
    posts: postReducer,
    auth: authReducer,
    
  },
})