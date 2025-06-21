import React from 'react'
import Navbar from '../components/Navbar'
import SearchProfile from '../components/SearchProfile'
import CreatePost from '../components/CreatePost'

const Create = () => {
  CreatePost
  return (
       <div className="h-screen w-screen flex bg-[#fbfaf8]">
      
      {/* Sidebar */}
     

      <div className="flex-1 p-6">
        <SearchProfile />
        <CreatePost />
      </div>
    </div>
  )
}

export default Create;
