import Navbar from "../components/Navbar";
import SearchProfile from "../components/SearchProfile";
import PostCard from "../components/Postcard";
import Home from "../pages/Home";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
 

  return (
    <div className="h-screen w-screen flex bg-[#fbfaf8]">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
