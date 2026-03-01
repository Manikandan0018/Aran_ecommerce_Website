import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";
import { Link } from "react-router-dom";
import AuthLoader from "../components/AuthLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await API.post("/auth/forgot-password", { email });

      toast.success(data.message || "Reset link sent to email");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f1f3f6] px-4">
      {loading && <AuthLoader />}

      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        <form onSubmit={submitHandler} className="space-y-6">
          <input
            type="email"
            required
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-2 border-b outline-none"
          />

          <button className="w-full bg-[#fb641b] text-white py-3 font-bold">
            Send Reset Link
          </button>
        </form>

        <Link to="/login" className="block mt-6 text-center text-[#2874f0]">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
