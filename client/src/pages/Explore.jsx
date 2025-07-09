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
    <p className="text-white text-center text-lg">Searching for a FriLoper ?</p>
  ) : (
    <div className="bg-black p-2 rounded-xl shadow">
      <p className="text-md font-semibold mb-2 text-gray-300">Search Results:</p>
      <div className="space-y-2 p-2 bg-black rounded-xl ">
        {searchResults.map((user) => (
          <motion.div 
          
           whileHover={{ scale: 1.02 }}
          onClick={()=>{
             dispatch(setReceiverId(user._id));
            console.log(user._id)
            navigate('/dashboard/direct-message')
            }}
            
          key={user._id} className="border bg-black cursor-pointer md:p-4 p-3 rounded-2xl pb-2">
            <p className="font-medium text-white">{user.fullName}</p>
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
