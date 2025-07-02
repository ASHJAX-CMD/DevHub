import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "./socket";
import { setOnlineUsers } from "./Redux/slices/onlineUserSlice";

const SocketHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("onlineUsersList", (userIds) => {
      console.log("👥 Updated online users:", userIds);
      dispatch(setOnlineUsers(userIds));
    });

    socket.on("userOnline", (userId) => {
      console.log("🟢 User came online:", userId);
    });

    socket.on("userOffline", (userId) => {
      console.log("🔴 User went offline:", userId);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("userOnline");
      socket.off("userOffline");
      socket.off("onlineUsersList");
    };
  }, [dispatch]);

  return null; // this component doesn’t render anything
};

export default SocketHandler;
