import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../Redux/slices/authSlices";
import {
  fetchUserProfile,
  updateProfileInfo,
  updateProfileImage,
} from "../Redux/slices/profileSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Lucide icon (optional)

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.profile);
  const fileInputRef = useRef();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setBio(profile.bio || "");
      if (profile.profileImage) {
        setAvatarPreview(`http://localhost:5000/uploads/profile/${profile.profileImage}`);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [profile]);

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
      const imageUrl = `http://localhost:5000/uploads/profile/${filename}?t=${Date.now()}`;
      setAvatarPreview(imageUrl);

      // ✅ Sync both profile and auth slices
      dispatch(fetchUserProfile()).then((res) => {
        if (res.payload) {
          dispatch(setUser(res.payload)); // ✅ update auth.user
        }
      });

      alert("✅ Image updated");
    })
    .catch((err) => {
      alert("❌ Upload failed: " + err);
    });
};


  if (loading || !profile) {
    return <div className="text-center pt-20 text-lg">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-[linear-gradient(to_bottom,#fbfaf8_30%,white_30%)] pt-10">
              {/* ← Back Arrow */}
        <div
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 text-gray-600 hover:text-black cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </div>

      <div className="w-[800px] bg-white shadow-md rounded-2xl p-8 flex flex-col space-y-8 relative">

        {/* Top Section */}
        <div className="flex space-x-10 pt-6">
          {/* Left: Profile Image */}
          <div className="w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 relative">
              <img
                src={avatarPreview || "/media/logo.png"}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border"
              />
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

          {/* Right: Profile Details */}
          <form
            onSubmit={handleSaveChanges}
            className="w-2/3 flex flex-col space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-gray-900 font-semibold border px-3 py-2 rounded-md bg-[#fbfaf8]">
                {profile.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="w-full h-24 p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-300"
              ></textarea>
            </div>

            <button
              type="submit"
              className="self-end mt-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Stats Section */}
        <div className="flex justify-around mt-4">
          {[
            { label: "Followers", count: profile.followers.length },
            { label: "Following", count: profile.following.length },
            { label: "Posts", count: profile.posts.length },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center border rounded-lg px-6 shadow-sm bg-[#fbfaf8]"
            >
              <p className="text-xl font-bold">{item.count}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
