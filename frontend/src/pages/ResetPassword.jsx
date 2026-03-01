import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import AuthLoader from "../components/AuthLoader";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const { data } = await API.put(`/auth/reset-password/${token}`, {
        password,
      });

      toast.success(data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f1f3f6] px-4">
      {loading && <AuthLoader />}

      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <input
            type="password"
            required
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-2 border-b outline-none"
          />

          <input
            type="password"
            required
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full py-2 border-b outline-none"
          />

          <button className="w-full bg-[#fb641b] text-white py-3 font-bold">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
