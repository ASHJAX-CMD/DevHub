import React from 'react'
import { ChevronDown, Search } from 'lucide-react'; // Import Search icon
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from 'react-redux';
const SearchProfile = () => {
  const getUsername =  JSON.parse(localStorage.getItem("user"));
 const username = getUsername.username || "problem";

 function getFirstUppercaseLetter(str) {
  if (!str || typeof str !== 'string') return ''; // handle empty or invalid input
  return str.charAt(0).toUpperCase();
}
  return (
   
    
            <div className=" mt-6 p-6">
               {console.log(getUsername)}
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Search Bar with Icon */}
          <div className="  relative  w-[90%]">
            <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-[rgba(0,0,0,0.9)] pl-10 pr-4 py-2  rounded-3xl focus:outline-none focus:ring-1 focus:ring-[#16ae5d]"
            />
          </div>

          {/* Profile Image + Down Arrow */}
          <div className="flex items-center mr-5 space-x-2">
            {/* <img
              src="./media/Profile (2).png"
              alt="Profile"
              className="h-14 w-14 rounded-full object-cover"
            /> */}
            <div className="bg-black text-white w-12 h-12 flex items-center justify-center rounded-full text-sm font-bold">
              {console.log(username)}
              {getFirstUppercaseLetter(username)}
            </div>
             <FaChevronDown  
             size={25}
               style={{
          color: '#000',
          fontWeight: 'bold',
           // green if active, gray if not
        }} />
          </div>
        </div>
       

        {/* Main content below the top bar */}
        
      </div>
    
  )
}

export default SearchProfile
