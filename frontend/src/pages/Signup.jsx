import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/auth/register", formData);
      toast.success("OTP Code Sent");
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (res) => {
    try {
      setLoading(true);
      const { data } = await API.post("/auth/google", {
        token: res.credential,
      });
      login(data);
      toast.success("Account created");
      navigate("/");
    } catch {
      toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <AuthLoader />}

      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-[460px] bg-mauve-100 rounded-[4rem] p-10 lg:p-16 border border-gray-100">
          <header className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#3D4035] leading-none mb-4">
              Create Identity
            </h2>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#B0B0A8] font-black">
              Register with Aran Studio
            </p>
          </header>

          <form onSubmit={submitHandler} className="space-y-4">
            <input
              name="name"
              placeholder="FULL NAME"
              onChange={handleChange}
              className="w-full px-8 py-5 bg-mauve-200 rounded-3xl outline-none text-[11px] tracking-widest font-bold text-gray-600 placeholder:text-gray-400 border border-transparent focus:border-[#3D4035]/10 transition-all"
            />
            <input
              name="email"
              placeholder="EMAIL ADDRESS"
              onChange={handleChange}
              className="w-full px-8 py-5 bg-mauve-200 rounded-3xl outline-none text-[11px] tracking-widest font-bold text-gray-600 placeholder:text-gray-400 border border-transparent focus:border-[#3D4035]/10 transition-all"
            />
            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              onChange={handleChange}
              className="w-full px-8 py-5 bg-mauve-200 rounded-3xl outline-none text-[11px] tracking-widest font-bold text-gray-600 placeholder:text-gray-400 border border-transparent focus:border-[#3D4035]/10 transition-all"
            />
            <button
              disabled={loading}
              className="w-full py-5 bg-[#3D4035] text-white text-[10px] font-black uppercase tracking-[0.6em] rounded-3xl hover:bg-black transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-[9px] text-gray-800 font-bold tracking-widest uppercase italic">
              One-Click
            </span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <div className="flex justify-center mb-10">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              shape="pill"
              theme="outline"
              text="signup_with"
            />
          </div>

          <p className="text-center text-[10px] tracking-widest text-[#B0B0A8] uppercase font-bold">
            Joined before?{" "}
            <Link
              to="/login"
              className="text-[#3D4035] border-b border-[#3D4035] ml-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
