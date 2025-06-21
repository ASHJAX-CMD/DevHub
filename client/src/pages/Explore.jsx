import React from 'react'
import Navbar from '../components/Navbar'
import SearchProfile from '../components/SearchProfile'

const Explore = () => {
    
  return (
    <>
    <div className="h-screen w-screen flex bg-[#fbfaf8]">
      
      <div className="flex flex-col  flex-1 p-4 overflow-y-auto space-y-6">
      <SearchProfile />
      <p className='text-2xl text-center text-red-500'  >Under Deverlopment !</p>
      </div>
      
    </div>
    </>
  )
}

export default Explore
