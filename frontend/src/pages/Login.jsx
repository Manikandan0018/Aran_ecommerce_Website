import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";
import home from "../image/home.png"

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await API.post("/auth/login", credentials);
      login(data);
      toast.success("Login Successful");
      navigate(data.isAdmin ? "/admin/dashboard" : from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f1f3f6] py-10 px-4">
      {loading && <AuthLoader />}

      <div className="flex flex-col md:flex-row w-full max-w-[850px] min-h-[520px] bg-white shadow-lg rounded-sm overflow-hidden">
        {/* Left Panel: Flipkart Style Branding */}
        <div className="md:w-2/5 bg-[#2874f0] p-10 text-white flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Login</h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <img
            src={home}
            alt="login-branding"
            className="w-full object-contain self-center opacity-90"
          />
        </div>

        {/* Right Panel: Form */}
        <div className="md:w-3/5 p-10 flex flex-col">
          <form onSubmit={submitHandler} className="space-y-6 flex-1">
            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter Email/Mobile number"
                onChange={handleChange}
                className="w-full py-2 outline-none text-sm peer"
              />
            </div>

            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0]">
              <input
                type="password"
                name="password"
                required
                placeholder="Enter Password"
                onChange={handleChange}
                className="w-full py-2 outline-none text-sm"
              />
              <Link
                to="/forgot"
                className="absolute right-0 top-2 text-[12px] text-[#2874f0] font-medium"
              >
                Forgot?
              </Link>
            </div>

            <p className="text-[12px] text-gray-500">
              By continuing, you agree to Aran's{" "}
              <span className="text-[#2874f0]">Terms of Use</span> and{" "}
              <span className="text-[#2874f0]">Privacy Policy</span>.
            </p>

            <button className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold shadow-sm hover:shadow-md transition-all">
              Login
            </button>

            <div className="flex items-center justify-center py-2">
              <GoogleLogin
                onSuccess={(res) => console.log(res)}
                shape="square"
                text="continue_with"
              />
            </div>
          </form>

          <Link
            to="/signup"
            className="mt-auto text-center text-[#2874f0] font-bold text-sm hover:bg-gray-50 py-3"
          >
            New to Aran? Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
