import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser, setUser } from "../Redux/slices/authSlices";
import { socket } from "../socket";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !email || !password || !fullName) {
    return alert("Please fill in all fields");
  }

  if (username.length < 4) {
    return alert("Username must be at least 4 characters");
  }

  if (fullName.length < 4) {
    return alert("Full name must be at least 4 characters");
  }

  if (password.length < 8) {
    return alert("Password must be at least 8 characters");
  }

  setIsLoading(true);
  const response = await dispatch(
    registerUser({ email, username, fullName, password })
  );
  setIsLoading(false);

  if (registerUser.fulfilled.match(response)) {
    const user = response.payload;
    localStorage.setItem("token", user.token);
    socket.emit("register", user._id);
    alert(`Registration Successful ${user.username}! Redirecting...`);
    navigate("/");
  } else {
    console.error("Registration failed:", response.payload);
    alert(response.payload || "Registration failed");
  }
};


  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/media/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Logo (optional) */}
      <img
        src="/media/logo.png"
        alt="Logo"
        className="absolute top-4 left-4 w-24 z-10"
      />

      {/* Signup Card */}
      <div className="relative z-10 bg-white/90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-md mx-4">
        <div className="flex justify-center mb-4">
          <span className="flex items-center text-2xl font-bold">
            <span className="text-[#13af64]">{"<"}</span>
            <span className="text-[#13af64]">{"/>"}</span>
            <span className="ml-2 text-black">DevHub</span>
          </span>
        </div>

        <h2 className="text-center text-xl font-semibold text-black mb-4">
          Create your account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-left text-black mb-1">
              Full Name
            </label>
            <input
              onChange={(e) => setFullname(e.target.value)}
              type="text"
              id="fullName"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-left text-black mb-1">
              Username
            </label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-left text-black mb-1">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-left text-black mb-1">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-bold py-2 rounded-full transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#13af64] hover:bg-green-600 text-white"
            }`}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-[0.8rem] text-black text-opacity-60">
          By continuing, you agree to DevHub's Terms of Service and acknowledge
          that you've read our Privacy Policy. Notice at collection.
        </p>

        <p className="text-center text-sm text-black mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="font-bold cursor-pointer underline text-[#13af64]"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}
