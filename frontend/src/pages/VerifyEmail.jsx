import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { HiOutlineShieldCheck, HiOutlineEnvelope } from "react-icons/hi2";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(30); // 30-second cooldown for resend

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // Protect the route: if no email is found, redirect to register
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  // Countdown logic
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const verifyHandler = async () => {
    if (otp.length < 4) return toast.warning("Please enter a valid OTP");

    try {
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Identity Verified");

      // Redirect to home or dashboard after success
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification Failed");
    }
  };

  const resendHandler = async () => {
    setIsResending(true);
    try {
      await API.post("/auth/resend-otp", { email });
      toast.success("A new code has been sent.");
      setTimer(60); // Reset timer to 60 seconds
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-sm border border-[#3D4035]/5 p-8 md:p-12 space-y-8 text-center">
        {/* ICON & TITLE */}
        <div className="space-y-3">
          <div className="w-16 h-16 bg-[#3D4035]/5 rounded-full flex items-center justify-center mx-auto text-[#3D4035]">
            <HiOutlineShieldCheck className="text-3xl" />
          </div>
          <h2 className="text-3xl font-serif text-[#3D4035]">
            Verify Your Email
          </h2>
          <p className="text-xs text-[#B0B0A8] leading-relaxed">
            We sent a secure code to <br />
            <span className="text-[#3D4035] font-semibold">{email}</span>
          </p>
        </div>

        {/* OTP INPUT */}
        <div className="space-y-4">
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B0A8]" />
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Only numbers
              placeholder="Enter 6-digit code"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#3D4035]/10 focus:border-[#3D4035] outline-none bg-[#FAF9F6] text-center tracking-[0.5em] font-bold text-[#3D4035] transition-all"
            />
          </div>

          <button
            onClick={verifyHandler}
            className="w-full bg-[#3D4035] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-lg shadow-[#3D4035]/10"
          >
            Authenticate
          </button>
        </div>

        {/* RESEND SECTION */}
        <div className="pt-4 border-t border-gray-50">
          <p className="text-xs text-[#B0B0A8] mb-2">
            Didn't receive the code?
          </p>
          <button
            disabled={timer > 0 || isResending}
            onClick={resendHandler}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
              timer > 0
                ? "text-[#B0B0A8] cursor-not-allowed"
                : "text-[#3D4035] border-b border-[#3D4035]/20 hover:border-[#3D4035]"
            }`}
          >
            {isResending
              ? "Sending..."
              : timer > 0
                ? `Resend Code in ${timer}s`
                : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
