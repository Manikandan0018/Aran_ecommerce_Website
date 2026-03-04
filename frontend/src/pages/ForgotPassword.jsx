import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import home from "../image/home.png"

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const getQuestion = async () => {
    try {
      const { data } = await API.post("/auth/forgot-question", { email });
      setQuestion(data.question);
    } catch (err) {
      toast.error("User not found please enter vaild email");
    }
  };

  const resetPassword = async () => {
    try {
      await API.post("/auth/reset-password", { email, answer, newPassword });
      toast.success("Password Reset Successful");
    } catch (err) {
      toast.error("Invalid Answer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      {/* Main Card */}
      <div className="flex flex-col md:flex-row w-full max-w-[650px] min-h-[450px] bg-white rounded shadow-lg overflow-hidden">
        {/* Left Sidebar (Flipkart Blue) */}
        <div className="bg-[#2874f0] md:w-2/5 p-10 text-white">
          <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
          <p className="text-gray-200 text-lg leading-relaxed">
            Verify your details to recover your account and continue shopping.
          </p>
          <div className="mt-20 hidden md:block">
            <img
              src={home}
              alt="Flipkart Icon"
              className="w-full opacity-80"
            />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between">
          <div className="space-y-6">
            {!question ? (
              <div className="relative">
                <input
                  type="email"
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="absolute left-0 top-2 text-gray-500 pointer-events-none transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                  Enter Email
                </label>
                <button
                  onClick={getQuestion}
                  className="w-full bg-[#fb641b] text-white font-semibold py-3 mt-8 rounded-sm shadow hover:bg-orange-600 transition"
                >
                  CONTINUE
                </button>
              </div>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">
                  <span className="font-bold text-[#2874f0]">Question:</span>{" "}
                  {question}
                </div>

                <div className="relative">
                  <input
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer"
                    placeholder=" "
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  <label className="absolute left-0 top-2 text-gray-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                    Your Answer
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="password"
                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#2874f0] transition-colors peer"
                    placeholder=" "
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label className="absolute left-0 top-2 text-gray-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[#2874f0] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                    New Password
                  </label>
                </div>

                <button
                  onClick={resetPassword}
                  className="w-full bg-[#fb641b] text-white font-semibold py-3 rounded-sm shadow hover:bg-orange-600 transition"
                >
                  RESET PASSWORD
                </button>
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="text-center pt-6">
            <Link
              to="/login"
              className="block mt-6 text-center text-[#2874f0] font-bold text-sm"
            >
             Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
