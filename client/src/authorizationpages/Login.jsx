import React, {  useEffect, useState } from "react";
import { fetchUserProfile } from "../Redux/slices/authSlices";
import { useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

export default function Login() {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(null);
// useEffect(() => {
//   const userId = localStorage.getItem("userId"); // or from Redux
//   if (userId) {
//     socket.emit("register", userId);
//     console.log("📡 Registered socket with userId:", userId);
//   }
// }, []);

  const handleSignup = () => {
    navigate("/signup");
    console.log("Navigating to signup page");
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return alert("Kya kr raha ho Fill to kr lo");
    }
    setIsloading(true); // start loading
    const result = await dispatch(fetchUserProfile({ email, password }));
    setIsloading(false);
   if (fetchUserProfile.fulfilled.match(result)) {
  console.log("Your Token Details", result.payload.token);

  // Save user
  localStorage.setItem("user", JSON.stringify(result.payload));
  localStorage.setItem("userId", result.payload._id); // 👈 save _id for later use

  // Register user with socket
  socket.emit("register", result.payload._id);
  console.log("📡 Registered socket after login:", result.payload._id);

  alert(`Welcome ${result.payload.username}`);
  navigate("/dashboard/home");
}
else {
      console.error("Login failed:", result.payload);
      alert(result.payload || "Login failed");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full min-h-full ">
        <img
          className="w-[20rem] absolute top-0 -mt-20 left-0"
          src="./media/logo.png"
          alt=""
        />
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src="./media/video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="bg-gray-100 rounded-3xl p-10 pt-20 pb-20 w-full max-w-md  shadow-md">
          <div className="flex justify-center mb-6">
            <span className="flex items-center text-2xl font-bold">
              <span className="text-[#13af64]">{"<"}</span>
              <span className="text-[#13af64]">{"/>"}</span>
              <span className="ml-2 text-black">DevHub</span>
            </span>
          </div>

          <h2 className=" text-xl font-semibold text-black mb-6">
            Log In to see more
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-black text-left mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
              value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  console.log(e.target.value);
                }}
                type="email"
                id="email"
                className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                className="block text-left text-black mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                id="password"
                className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-sm text-black text-left">
              Forgotten Password <span className="font-bold">?</span>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-bold py-2 rounded-full transition 
    ${
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-[#13af64] hover:bg-green-600 text-white"
    }`}
              >
                {isLoading ? "Logging In..." : "Log In"}
              </button>

              <span>
                <p className="mt-5 text-[0.8rem] text-black text-opacity-60">
                  By continuing, you agree to DevHub's Terms of Service and
                  acknowledge that you've read our Privacy Policy. Notice at
                  collection.
                </p>
                <p className=" font-semibold text-[0.8rem]">
                  Not on DevHub Yet?{" "}
                  <span
                    onClick={handleSignup}
                    className="cursor-pointer underline"
                  >
                    Sign Up
                  </span>
                </p>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
