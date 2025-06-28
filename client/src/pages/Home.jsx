import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchProfile from '../components/SearchProfile';
import PostCard from '../components/Postcard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../Redux/slices/postSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { allPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="h-auto overflow-hidden w-auto flex bg-[#fbfaf8]">
      
      <div className="flex flex-col flex-1 p-4 overflow-y-auto space-y-6">
        <SearchProfile />
        <div className="space-y-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {allPosts.map((post) => (
            <PostCard
              key={post._id}
              content={post.content}
              images={post.images}
              file={post.file}
              createdAt={post.createdAt}
              userId={post.userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
