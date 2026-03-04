import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
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
    securityQuestion: "",
    securityAnswer: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= REGISTER ================= */

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        email: formData.email.toLowerCase(),
        securityAnswer: formData.securityAnswer.toLowerCase(),
      };

      const { data } = await API.post("/auth/register", payload);

      login(data);
      toast.success("Registration Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= GOOGLE SIGNUP ================= */

  const handleGoogleSuccess = async (response) => {
    try {
      setLoading(true);

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
        {/* LEFT PANEL */}

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

        {/* RIGHT PANEL */}

        <div className="md:w-3/5 p-10 flex flex-col">
          <form onSubmit={submitHandler} className="space-y-6 flex-1">
            {/* NAME */}
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />
            {/* EMAIL */}
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />
            {/* MOBILE */}
            <input
              type="text"
              name="mobile"
              required
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />
            {/* SECURITY QUESTION */}
            <p className="text-xs text-green-700">
              Please remember your security answer. It will be required to reset
              your password.
            </p>{" "}
            <select
              name="securityQuestion"
              required
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            >
              <option value="">Select Security Question</option>

              <option value="What is your favorite food?">
                What is your favorite food?
              </option>

              <option value="What is your first school name?">
                What is your first school name?
              </option>

              <option value="What is your childhood nickname?">
                What is your childhood nickname?
              </option>

              <option value="What is your favorite movie?">
                What is your favorite movie?
              </option>
            </select>
            {/* SECURITY ANSWER */}
            <input
              type="text"
              name="securityAnswer"
              required
              placeholder="Answer"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            />
            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none focus:border-[#2874f0]"
            />
            {/* REGISTER BUTTON */}
            <button className="w-full bg-[#fb641b] text-white py-3 font-bold shadow-sm hover:shadow-md transition-all">
              Register
            </button>
            {/* GOOGLE SIGNUP */}
            <div className="flex flex-col items-center gap-4 py-2">
              <span className="text-gray-400 text-xs">OR</span>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Signup Failed")}
                shape="square"
                text="signup_with"
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
