import React from 'react'
import SearchProfile from '../components/SearchProfile';
const Alert = () => {
  return (
    <div className=" flex bg-[#fbfaf8]">
      
      <div className="flex flex-col   flex-1 p-4 overflow-y-auto space-y-6">
      <SearchProfile />
      <p className='text-2xl text-center text-red-500'  >Under Deverlopment !</p>
      </div>
      
    </div>
  )
}

export default Alert;
