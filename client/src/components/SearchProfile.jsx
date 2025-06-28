import React from "react";
import { Search } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch} from 'react-redux';
import { searchUsers } from '../Redux/slices/searchSlice'
import {clearSearchResults } from '../Redux/slices/searchSlice';

const SearchProfile = () => {
   const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  
  const dispatch = useDispatch();
useEffect(() => {
  dispatch(clearSearchResults());
}, [location.pathname,dispatch]);
useEffect(() => {
  const delay = setTimeout(() => {
    if (input.trim()) {
      dispatch(searchUsers(input));
    } else {
      dispatch(clearSearchResults()); // 🧹 clear if input is empty
    }
  }, 300); // debounce

  return () => clearTimeout(delay);
}, [input,dispatch]);
  const getUsername = JSON.parse(localStorage.getItem("user"));
  const username = getUsername?.username || "Problem";
 
  function getFirstUppercaseLetter(str) {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase();
  }

  return (
    <div  className="w-full px-4 py-4 md:px-8 bg-white shadow-sm rounded-xl ">
      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
          <input
          onChange={(e)=>{
            setInput(e.target.value)
          }}
          onClick={()=>{
            if(location.pathname==="/dashboard/explore"){
              return
            }
            else{navigate("/dashboard/explore")}
          }}
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#16ae5d]"
          />
          {/* {console.log(searchResults)} */}
        </div>

        {/* Profile icon */}
        <div className="flex items-center gap-2 ml-4">
          <motion.div
          
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold"
          >
            {getFirstUppercaseLetter(username)}
          </motion.div>
          <FaChevronDown size={20} className="text-gray-700" />
        </div>
      </div>
    </div>
  );
};

export default SearchProfile;
