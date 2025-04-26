import { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    axios
      .post("/api/change-password", { oldPassword, newPassword })
      .then(() => {
        alert("Password changed successfully!");
        setMessage("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch(() => setMessage("Error changing password"));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('/bamboo-bg.png')] bg-cover bg-no-repeat backdrop-blur-sm px-4 py-10">
      <div className="w-full max-w-lg p-10 bg-white/90 rounded-3xl shadow-2xl shadow-green-300 border-2 border-green-200 transition-transform duration-300 hover:scale-[1.015]">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-green-900">🔐 Change Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 text-lg">
          <div>
            <label className="block mb-2 font-semibold text-green-900">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-green-900">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-green-900">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-green-800"
              required
            />
          </div>

          {message && (
            <p className="text-red-600 text-center font-medium">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3 rounded-2xl transition duration-200"
          >
            🌿 Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
