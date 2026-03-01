import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f1f3f6] py-10 px-4">
      {loading && <AuthLoader />}

      <div className="flex flex-col md:flex-row w-full max-w-[850px] bg-white shadow-lg rounded-sm overflow-hidden">
        <div className="md:w-2/5 bg-[#2874f0] p-10 text-white flex flex-col">
          <h2 className="text-3xl font-bold mb-4">Create Account</h2>
          <img src={home} alt="signup" className="mt-auto" />
        </div>

        <div className="md:w-3/5 p-10">
          <form onSubmit={submitHandler} className="space-y-6">
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            />

            <input
              type="text"
              name="mobile"
              required
              placeholder="Mobile Number"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            />

            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              onChange={handleChange}
              className="w-full py-2 border-b outline-none"
            />

            <button className="w-full bg-[#fb641b] text-white py-3 font-bold">
              Register
            </button>
          </form>

          <Link to="/login" className="block mt-6 text-center text-[#2874f0]">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
