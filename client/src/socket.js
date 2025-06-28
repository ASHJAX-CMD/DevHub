// socket.js
import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000"; // dev/prod
export const socket = io(URL, {
  withCredentials: true, // if needed for cookies
  autoConnect: false, // control when to connect
});
