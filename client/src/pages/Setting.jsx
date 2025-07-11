import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";

const Setting = () => {
  const navigate = useNavigate();

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [email, setEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("❌ New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/setting/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setPasswordOpen(false);
    } catch (err) {
      alert("❌ " + (err?.response?.data?.error || "Password update failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("⚠️ Are you sure you want to delete your account? This action is permanent.");
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/setting/delete-account", {
        headers: { Authorization: `Bearer ${token}` },
        data: { email, password: deletePassword },
      });

      alert("✅ Account deleted");
      localStorage.removeItem("token");
      navigate("/signup");
    } catch (err) {
      alert("❌ " + (err?.response?.data?.error || "Account deletion failed"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative px-8 py-6">
      {/* Top Heading */}
      <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>

      {/* Logout Button Top Right */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-6 bg-red-700 text-white text-sm px-4 py-2 rounded-xl hover:bg-red-800 transition"
      >
        Log Out
      </button>

      {/* Settings Container (aligned left) */}
      <div className="flex flex-col items-start md:ml-12 space-y-8 max-w-xl">
        {/* Change Password Section */}
        <div className="bg-gray-900 w-full p-4 md:p-6 rounded-xl shadow-lg">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setPasswordOpen(!passwordOpen)}
          >
            <h2 className="text-l md:text-xl font-semibold">Change Password</h2>
            <FaChevronDown
              className={`text-white transform transition-transform ${
                passwordOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {passwordOpen && (
            <form onSubmit={handlePasswordChange} className="mt-6 flex flex-col space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="p-2 rounded-xl bg-black border border-gray-700"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="p-2 rounded-xl bg-black border border-gray-700"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                className="p-2 rounded-xl bg-black border border-gray-700"
              />
              <button
                type="submit"
                disabled={loading}
                className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="bg-gray-900 w-full md:p-6 p-4 rounded-xl shadow-lg">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setDeleteOpen(!deleteOpen)}
          >
            <h2 className="text-l md:text-xl font-semibold text-red-500">Delete Account</h2>
            <FaChevronDown
              className={`text-white transform transition-transform ${
                deleteOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {deleteOpen && (
            <form onSubmit={handleDeleteAccount} className="mt-6 flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-2 rounded-xl bg-black border border-gray-700"
              />
              <input
                type="password"
                placeholder="Your Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                required
                className="p-2 rounded-xl bg-black border border-gray-700"
              />
              <button
                type="submit"
                disabled={deleteLoading}
                className={`bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition ${
                  deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deleteLoading ? "Deleting..." : "Delete My Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
