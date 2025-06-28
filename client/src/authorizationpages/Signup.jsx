import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Redux/slices/authSlices";
import { useDispatch} from "react-redux";
import { socket } from "../socket";
// import jwtDecode from "jwt-decode";
import { setUser } from "../Redux/slices/authSlices";
export default function Signup() {
const dispatch = useDispatch();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token); // decode user info from token
  //       dispatch(setUser(decoded)); // Set into redux
  //     } catch (err) {
  //       console.error("Invalid token");
  //     }
  //   }
  // }, []);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullname] = React.useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!username || !email || !password || !fullName) {
      alert("Please fill in all fields");
      return;
    }

    const respone = await dispatch(registerUser({email,username,fullName,password}))
   
    if(registerUser.fulfilled.match(respone)){
      console.log("Your Token Details", respone.payload.token);
      localStorage.setItem("token",respone.payload.token)
      socket.emit("register", respone.payload._id);
      console.log("📡 Registered socket after login:", respone.payload._id);
      
      // alert(`Welcome ${respo`ne.payload.username}`);
      alert(`Registration Successfull ${respone.payload.username}! Redirecting to Login Page...`)
      navigate("/");

    }
     else {
      console.error("Login failed:", respone.payload);
      alert(respone.payload || "Login failed");
    }
}

  return (
    <>
    <div className="flex items-center justify-center min-h-full ">
    <img className="w-[20rem] absolute top-0 -mt-20 left-0" src="./media/logo.png" alt="" />
    <video
    autoPlay
    muted
    loop
    className="absolute inset-0 w-full h-full object-cover -z-10"
  >
    <source src="./media/video1.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
      <div className="bg-gray-100 rounded-3xl p-10 w-full max-w-md shadow-md">
        {/* Logo/Header */}
        <div className="flex justify-center mb-6">
          <span className="flex items-center text-2xl font-bold">
            <span className="text-[#13af64]">{'<'}</span>
            <span className="text-[#13af64]">{'/>'}</span>
            <span className="ml-2 text-black">DevHub</span>
          </span>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-black mb-6">
          Create your account
        </h2>

        {/* Signup Form */}
        <form className="space-y-4">

              <div>
            <label className="block text-left text-black mb-1" htmlFor="fullName">FullName</label>
            <input
            onChange={(e) => setFullname(e.target.value)}
              type="text"
              id="fullName"
              className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
              placeholder="Enter your FullName"
            />
          </div>

          <div>
            <label className="block text-left text-black mb-1" htmlFor="username">UserName</label>
            <input
            onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
              placeholder="Enter your UserName"
            />
          </div>

          <div>
            <label className="block text-left text-black mb-1" htmlFor="email">Email</label>
            <input
            onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-left text-black mb-1" htmlFor="password">Password</label>
            <input
            onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-2xl border-black/30 border  text-left focus:outline-none"
              placeholder="Create a password"
            />
          </div>

          <div className="pt-4">
            <button
            onClick={handleSubmit}
              type="submit"
              className="w-full bg-[#13af64] text-white font-bold py-2 rounded-full hover:bg-green-600 transition"
            >
              Sign Up
            </button>
          </div>
        </form>
         <p className="mt-5 text-[0.8rem] text-black text-opacity-60" >By continuing, you agree to DevHub's Terms of Service 
                and acknowledge that you've read our Privacy Policy. Notice at collection.</p>
        {/* Already have an account */}
        <p className="text-center text-sm text-black mt-4">
          Already have an account? <span onClick={()=>{navigate("/")}} className="font-bold cursor-pointer">Log In</span>
        </p>
      </div>
    </div>
    </>
  );
}
