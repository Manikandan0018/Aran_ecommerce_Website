import React, { useState, useContext, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import API from "../services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import AuthLoader from "../components/AuthLoader";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  /* =========================
     INPUT HANDLER
  ========================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /* =========================
     LOGIN SUBMIT
  ========================= */
  const submitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (loading) return;

      if (!credentials.email || !credentials.password) {
        return toast.warning("Enter email and password");
      }

      try {
        setLoading(true);

        const { data } = await API.post("/auth/login", credentials);

        login(data);
        toast.success("Welcome Back");

        if (data.isAdmin) {
          navigate("/admin/dashboard", {
            replace: true,
          });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [credentials, login, navigate, loading],
  );

  /* =========================
     GOOGLE LOGIN
  ========================= */
  const handleGoogleSuccess = useCallback(
    async (res) => {
      if (!res?.credential) return;

      try {
        setLoading(true);

        const { data } = await API.post("/auth/google", {
          token: res.credential,
        });

        login(data);
        toast.success("Welcome to Aran");

        navigate("/", { replace: true });
      } catch {
        toast.error("Login failed, try again");
      } finally {
        setLoading(false);
      }
    },
    [login, navigate],
  );

  return (
    <>
      {loading && <AuthLoader />}

      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-mauve-100 rounded-[3rem] p-10 lg:p-14 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] border border-[#3D4035]/5">
          <header className="text-center mb-10">
            <h2 className="text-3xl font-serif text-[#3D4035] italic">
              Welcome Back
            </h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B0B0A8] font-bold mt-2">
              Sign in to Aran
            </p>
          </header>

          <form onSubmit={submitHandler} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="EMAIL ADDRESS"
              value={credentials.email}
              onChange={handleChange}
              required
              className="w-full bg-mauve-200 px-6 py-4 rounded-2xl outline-none text-[11px] font-bold focus:bg-white focus:ring-1 focus:ring-[#3D4035]/10"
            />

            <input
              type="password"
              name="password"
              placeholder="PASSWORD"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full bg-mauve-200 px-6 py-4 rounded-2xl outline-none text-[11px] font-bold focus:bg-white focus:ring-1 focus:ring-[#3D4035]/10"
            />

            <button
              disabled={loading}
              className="w-full py-5 bg-[#3D4035] text-white text-[10px] font-black uppercase tracking-[0.5em] rounded-2xl hover:bg-black transition-all disabled:opacity-60"
            >
              {loading ? "Please Wait..." : "Sign In"}
            </button>
          </form>

          <div className="my-10 flex items-center gap-4">
            <div className="h-[1px] bg-gray-100 flex-1" />
            <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
              Social Access
            </span>
            <div className="h-[1px] bg-gray-100 flex-1" />
          </div>

          <div className="flex justify-center mb-10">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              shape="pill"
              text="signin_with"
            />
          </div>

          <p className="text-center text-[10px] uppercase font-bold text-[#B0B0A8]">
            No account?{" "}
            <Link to="/signup" className="text-[#3D4035] border-b ml-2">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default React.memo(Login);
