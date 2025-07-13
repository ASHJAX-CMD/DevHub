import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "../Redux/slices/authSlices";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Kya kr raha ho? Fill to kr lo.");
    }

    setIsloading(true);
    const result = await dispatch(fetchUserProfile({ email, password }));
    setIsloading(false);

    if (fetchUserProfile.fulfilled.match(result)) {
      const user = result.payload;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      socket.emit("register", user._id);
      alert(`Welcome ${user.username}`);
      navigate("/dashboard/home");
    } else {
      alert(result.payload || "Login failed");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
      {/* Video Background */}
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
      {console.log(import.meta.env.VITE_API_URL)}
{console.log(import.meta.env.VITE_SOCKET_URL)}


      {/* Login Box */}
      <div className="relative z-10 bg-white/90 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-md mx-4">
        <div className="flex justify-center mb-4">
          <span className="flex items-center text-2xl font-bold">
            <span className="text-[#13af64]">{"<"}</span>
            <span className="text-[#13af64]">{"/>"}</span>
            <span className="ml-2 text-black">DevHub</span>
          </span>
        </div>

        <h2 className="text-xl font-semibold text-black mb-4">
          Log In to see more
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-left text-black mb-1">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-left text-black mb-1"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-2xl border border-black/30 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-sm text-black text-left">
            Forgotten Password <span className="font-bold">?</span>
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
            {isLoading ? "Logging In..." : "Log In"}
          </button>

          <p className="mt-4 text-[0.8rem] text-black text-opacity-60">
            By continuing, you agree to DevHub's Terms of Service and acknowledge
            that you've read our Privacy Policy. Notice at collection.
          </p>

          <p className="text-[0.8rem] font-semibold">
            Not on DevHub Yet?{" "}
            <span
              onClick={handleSignup}
              className="cursor-pointer underline text-[#13af64]"
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
