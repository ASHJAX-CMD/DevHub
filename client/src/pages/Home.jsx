import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchProfile from "../components/SearchProfile";
import PostCard from "../components/Postcard";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../Redux/slices/postSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { allPosts, loading, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="h-auto overflow-hidden scrollbar-none mb-12  w-auto flex bg-black">
      <div className="flex flex-col scrollbar-none  flex-1 p-4 overflow-y-auto space-y-6">
        <SearchProfile />
        <div className="space-y-4 mb-8 scrollbar-none">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
{allPosts.map((post) => (
  <div key={post._id} className="mb-8">
    <PostCard
      sharesCount={post.shares?.length || 0}
      postId={post._id}
      content={post.content}
      images={post.images}
      file={post.file}
      createdAt={post.createdAt}
      userId={post.userId}
      likesCount={post.likesCount}
      likedByUser={post.likedByUser}
    />
    {console.log(post.userId)}
  </div>
))}

        </div>
      </div>
    </div>
  );
};

export default Home;
