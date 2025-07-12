import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import PostProfile from "../components/PostsProfile";
import { useSelector, useDispatch } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { toggleFollow } from "../Redux/slices/postSlice";

const PublicUserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [useer, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/userprofile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
      }
    };
    fetchUserData();
  }, [userId, API_URL]);

  const handleFollowToggle = async () => {
    try {
      const isCurrentlyFollowing = useer.followers.some(
        (follower) => follower._id === user._id
      );

      await dispatch(toggleFollow({ userId: useer._id, isCurrentlyFollowing }));

      setUser((prev) => {
        const updatedFollowers = isCurrentlyFollowing
          ? prev.followers.filter((f) => f._id !== user._id)
          : [...prev.followers, { _id: user._id, username: user.username }];
        return { ...prev, followers: updatedFollowers };
      });
    } catch (err) {
      console.error("Toggle follow failed:", err);
    }
  };

  if (!useer) {
    return (
      <div className="text-center pt-20 text-lg text-white">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-black pt-10">
      <div className="flex flex-col p-4 items-center w-full gap-4">
        <div
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-gray-600 hover:text-white cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </div>

        <div className="w-full max-w-4xl bg-black/30 border-gray-900 shadow-md rounded-2xl p-2 flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-6 md:space-y-0 pt-6">
            <div className="w-full md:w-1/3 flex flex-col items-start">
              <div className="w-20 h-20 md:w-32 md:h-32">
                {useer.profileImage ? (
                  <img
                    src={
                      useer.profileImage?.startsWith("http")
                        ? useer.profileImage
                        : `${API_URL}/uploads/profile/${useer.profileImage}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-full">
                    <CgProfile className="font-thin w-full h-full text-black" />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Username
                </label>
                <p className="mt-1 text-white text-m font-semibold border border-gray-900 px-3 py-2 rounded-md">
                  {useer.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <p className="mt-1 text-white px-3 py-2 border border-gray-900 rounded-md">
                  {useer.fullName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Bio
                </label>
                <p className="mt-1 text-white px-3 py-2 border border-gray-900 rounded-md">
                  {useer.bio}
                </p>
              </div>

              {/* 🔁 Follow / Unfollow Button */}
             <div className="flex justify-end">
               {user._id !== useer._id && (
                <button
                  onClick={handleFollowToggle}
                  className={`mt-2 px-4 w-1/2  py-2 text-white rounded-md text-sm ${
                    useer.followers.some((f) => f._id === user._id)
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {useer.followers.some((f) => f._id === user._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
             </div>
            </div>
          </div>

          <div className="flex justify-around border-b border-t mt-4">
            {console.log(useer.posts.length)}
            {[
              { label: "Followers", count: useer.followers.length },
              { label: "Following", count: useer.following.length },
              { label: "Posts", count: useer.posts.length },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg px-6 shadow-sm"
              >
                <p className="text-xl text-white font-bold">{item.count}</p>
                <p className="text-sm text-white">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white min-w-2/3 md:w-2/3 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post._id}>
                <PostProfile
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
                {console.log(post.likedByUser)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
