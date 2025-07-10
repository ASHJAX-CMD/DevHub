import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/slices/authSlices";
import {
  fetchUserProfile,
  updateProfileInfo,
  updateProfileImage,
} from "../Redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchUserPosts } from "../Redux/slices/postSlice";
import PostProfile from "../components/PostsProfile";
import { CgProfile } from "react-icons/cg";
const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.profile);
  const { userPosts } = useSelector((state) => state.posts);
  const fileInputRef = useRef();

  const API_URL = import.meta.env.VITE_API_URL;

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [saveChanges, setSaveChanges] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchUserPosts());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setBio(profile.bio || "");
      if (profile.profileImage) {
        setAvatarPreview(`${API_URL}/uploads/profile/${profile.profileImage}`);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [profile, API_URL]);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    dispatch(updateProfileInfo({ fullName, bio }))
      .unwrap()
      .then(() => alert("✅ Profile updated"))
      .catch((err) => alert("❌ Update failed: " + err));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(updateProfileImage(file))
      .unwrap()
      .then((filename) => {
        const imageUrl = `${API_URL}/uploads/profile/${filename}?t=${Date.now()}`;
        setAvatarPreview(imageUrl);
        dispatch(fetchUserProfile()).then((res) => {
          if (res.payload) dispatch(setUser(res.payload));
        });
        alert("✅ Image updated");
      })
      .catch((err) => {
        alert("❌ Upload failed: " + err);
      });
  };

  if (loading || !profile) {
    return (
      <div className="text-center pt-20 text-lg text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-black pt-10">
      <div className="flex flex-col p-4 items-center w-full gap-4">
        {/* ← Back Arrow */}
        <div
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-gray-600 hover:text-white cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </div>

        {/* Profile Details */}
        <div className="w-full max-w-4xl bg-black/30 border-gray-900 shadow-md rounded-2xl p-2 flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:space-x-10 space-y-6 md:space-y-0 pt-6">
            {/* Profile Image */}
            <div className="w-full md:w-1/3 flex flex-col items-start md:items-start">
              <div className="w-20 h-20 md:w-32 md:h-32 relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full border"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center rounded-full">
                    <CgProfile className=" font-thin w-full h-full text-black" />
                  </div>
                )}

                <button
                  className="absolute bottom-0 right-0 bg-gray-200 px-3 py-1 text-sm rounded-xl shadow"
                  onClick={() => fileInputRef.current.click()}
                >
                  Edit
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* Editable Fields */}
            <form
              onSubmit={handleSaveChanges}
              className="w-full md:w-2/3 flex flex-col space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white">
                  Username
                </label>
                <p className="mt-1 text-white text-m font-semibold border border-gray-900 px-3 py-2 rounded-md">
                  {profile.username}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (e.target.value) setSaveChanges(true);
                  }}
                  className="mt-1 w-full p-2 border border-gray-900 rounded-md focus:outline-none bg-black text-white focus:ring-2 focus:ring-green-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">
                  Bio
                </label>
                <textarea
                  rows="3"
                  value={bio}
                  onChange={(e) => {
                    setBio(e.target.value);
                    if (e.target.value) setSaveChanges(true);
                  }}
                  placeholder="Tell us about yourself"
                  className="w-full h-12 p-2 border bg-black border-gray-900 text-white rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`${
                  saveChanges ? "" : "hidden"
                } self-end mt-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700`}
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="flex justify-around border-b border-t mt-4">
            {[
              { label: "Followers", count: profile.followers.length },
              { label: "Following", count: profile.following.length },
              { label: "Posts", count: profile.posts.length },
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

        {/* Posts */}
        <div className="text-white min-w-2/3 md:w-2/3 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userPosts.map((post) => (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
