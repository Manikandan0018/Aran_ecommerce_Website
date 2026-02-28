import React, { useState, useEffect, useContext, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { HiOutlineShieldCheck, HiOutlineEnvelope } from "react-icons/hi2";
import { AuthContext } from "../context/AuthContext";

const VerifyEmail = () => {
  const { login } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  /* =========================
     ROUTE PROTECTION
  ========================= */
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  /* =========================
     COUNTDOWN TIMER
  ========================= */
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* =========================
     VERIFY OTP
  ========================= */
  const verifyHandler = useCallback(async () => {
    if (otp.length !== 6) return toast.warning("Enter valid 6-digit OTP");

    if (isVerifying) return;

    try {
      setIsVerifying(true);

      const { data } = await API.post("/auth/verify-otp", { email, otp });

      login(data);
      toast.success("Signup successful");

      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification Failed");
    } finally {
      setIsVerifying(false);
    }
  }, [otp, email, login, navigate, isVerifying]);

  /* =========================
     RESEND OTP
  ========================= */
  const resendHandler = useCallback(async () => {
    if (timer > 0 || isResending) return;

    try {
      setIsResending(true);

      await API.post("/auth/resend-otp", {
        email,
      });

      toast.success("New code sent");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    } finally {
      setIsResending(false);
    }
  }, [email, timer, isResending]);

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-sm border border-[#3D4035]/5 p-8 md:p-12 space-y-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-[#3D4035]/5 rounded-full flex items-center justify-center mx-auto text-[#3D4035]">
            <HiOutlineShieldCheck className="text-3xl" />
          </div>

          <h2 className="text-3xl font-serif text-[#3D4035]">
            Verify Your Email
          </h2>

          <p className="text-xs text-[#B0B0A8]">
            We sent a secure code to
            <br />
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
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit code"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#3D4035]/10 focus:border-[#3D4035] bg-[#FAF9F6] text-center tracking-[0.5em] font-bold"
            />
          </div>

          <button
            onClick={verifyHandler}
            disabled={isVerifying}
            className="w-full bg-[#3D4035] text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black disabled:opacity-60"
          >
            {isVerifying ? "Verifying..." : "Authenticate"}
          </button>
        </div>

        {/* RESEND SECTION */}
        <div className="pt-4 border-t">
          <p className="text-xs text-[#B0B0A8] mb-2">
            Didn't receive the code?
          </p>

          <button
            disabled={timer > 0 || isResending}
            onClick={resendHandler}
            className={`text-[10px] font-bold uppercase tracking-widest ${
              timer > 0 ? "text-[#B0B0A8] cursor-not-allowed" : "text-[#3D4035]"
            }`}
          >
            {isResending
              ? "Sending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VerifyEmail);
