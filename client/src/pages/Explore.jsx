import React from "react";
import SearchProfile from "../components/SearchProfile";
import { useSelector } from "react-redux";
import {motion} from "framer-motion"
import {useNavigate} from "react-router-dom"
import { useDispatch } from "react-redux";
import { setReceiverId } from "../Redux/slices/chatSlice"; 
const Explore = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {searchResults}=useSelector((state)=>state.search);
 
  return (
    <div className="flex flex-col flex-1 p-4 space-y-6 h-full">
      <SearchProfile />
      <div className="space-y-4">
       {searchResults.length === 0 ? (
    <p className="text-lg">Searching for a FriLoper ?</p>
  ) : (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-md font-semibold mb-2 text-gray-700">Search Results:</p>
      <div className="space-y-2">
        {searchResults.map((user) => (
          <motion.div 
           whileHover={{ scale: 1.02 }}
          onClick={()=>{
             dispatch(setReceiverId(user._id));
            console.log(user._id)
            navigate('/dashboard/direct-message')
            }}
            
          key={user._id} className="border-b cursor-pointer p-6 pb-2">
            <p className="font-medium">{user.fullName}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
            {console.log(user._id)}
          </motion.div>
        ))}
      </div>
    </div>
  )}

      </div>
    </div>
  );
};

export default Explore;
