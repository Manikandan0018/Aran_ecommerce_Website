import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Import this
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";
import home from "../image/home.png";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- Manual Form Signup ---
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/register", formData);
      login(data);
      toast.success("Registration Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Google Signup/Login Handler ---
  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);
      // Send the token to the same /auth/google endpoint used in Login
      const { data } = await API.post("/auth/google", {
        token: response.credential,
      });

      login(data);
      toast.success("Google Signup Successful");
      navigate("/");
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error(error.response?.data?.message || "Google Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f1f3f6] py-10 px-4">
      {loading && <AuthLoader />}

      <div className="flex flex-col md:flex-row w-full max-w-[850px] bg-white shadow-lg rounded-sm overflow-hidden">
        {/* Left Panel */}
        <div className="md:w-2/5 bg-[#2874f0] p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Looks like you're new here!
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Sign up with your mobile number to get started
            </p>
          </div>
          <img
            src={home}
            alt="signup"
            className="w-full object-contain self-center opacity-90"
          />
        </div>

        {/* Right Panel */}
        <div className="md:w-3/5 p-10 flex flex-col">
          <form onSubmit={submitHandler} className="space-y-6 flex-1">
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />

            <input
              type="text"
              name="mobile"
              required
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />

            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />

            <button className="w-full bg-[#fb641b] text-white py-3 font-bold shadow-sm hover:shadow-md transition-all">
              Register
            </button>

            {/* Google Signup Button */}
            <div className="flex flex-col items-center gap-4 py-2">
              <span className="text-gray-400 text-xs">OR</span>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Signup Failed")}
                shape="square"
                text="signup_with" // Shows "Sign up with Google"
                width="100%"
              />
            </div>
          </form>

          <Link
            to="/login"
            className="block mt-6 text-center text-[#2874f0] font-bold text-sm"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
