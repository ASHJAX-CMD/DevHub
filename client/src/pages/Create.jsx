import React from 'react';
import SearchProfile from '../components/SearchProfile';
import CreatePost from '../components/CreatePost';

const Create = () => {
  return (
    <div className="flex flex-col flex-1 bg-[#fbfaf8] p-4 space-y-6 overflow-y-auto h-full">
      {/* Search bar and profile icon at top */}
      <SearchProfile />

      {/* Create Post Section */}
      <CreatePost />
    </div>
  );
};

export default Create;
