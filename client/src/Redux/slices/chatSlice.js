// senderSlice.js (or chatSlice.js if managing both sender & receiver)
// adjust path as per your file
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    senderId: null,
    receiverId: null, // optional: if you're managing this too
  },
  reducers: {
    setSenderId: (state, action) => {
      state.senderId = action.payload;
    },
    setReceiverId: (state, action) => {
      state.receiverId = action.payload;
    },
    clearChatState: (state) => {
      state.senderId = null;
      state.receiverId = null;
    },
  },
});

export const { setSenderId, setReceiverId, clearChatState } = chatSlice.actions;

export default chatSlice.reducer;
