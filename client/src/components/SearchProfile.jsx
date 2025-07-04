import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, clearSearchResults } from "../Redux/slices/searchSlice";

const SearchProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const { user } = useSelector((state) => state.auth); // ✅ Pulling from auth slice
  const username = user?.username || "User";
  const profileImage = user?.profileImage;

  useEffect(() => {
    dispatch(clearSearchResults());
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (input.trim()) {
        dispatch(searchUsers(input));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [input, dispatch]);

  const getFirstUppercaseLetter = (str) => {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase();
  };

  return (
    <div className="w-full px-4 py-4 md:px-8 bg-white shadow-sm rounded-xl">
      <div className="flex items-center justify-between">
        {/* 🔍 Search bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
            onChange={(e) => setInput(e.target.value)}
            onClick={() => {
              if (location.pathname !== "/dashboard/explore") {
                navigate("/dashboard/explore");
              }
            }}
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#16ae5d]"
          />
        </div>

        {/* 👤 Profile Icon */}
        <div className="flex items-center gap-2 ml-4">
          <motion.div
            onClick={() => navigate("/profile")}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
          >
            {profileImage ? (
              <img
                src={`http://localhost:5000/uploads/profile/${profileImage}?t=${Date.now()}`} // ✅ Cache-busting
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-black text-white flex items-center justify-center font-bold">
                {getFirstUppercaseLetter(username)}
              </div>
            )}
          </motion.div>
          <FaChevronDown size={20} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;
