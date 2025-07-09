import Navbar from "../components/Navbar";
import SearchProfile from "../components/SearchProfile";
import PostCard from "../components/Postcard";
import Home from "../pages/Home";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
 

  return (
// Dashboard.jsx
<div className="flex w-screen scrollbar-none bg-black h-screen">
  <div className="flex " >
    <Navbar />
  </div>
  <div className="flex-1 w-full  scrollbar-none h-full overflow-y-auto">
    <Outlet />
  </div>
</div>

  );
};

export default Dashboard;
