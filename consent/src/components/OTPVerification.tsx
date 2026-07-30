import React, { useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useVerifyOtpMutation } from "../hooks/consent/mutation/useVerifyOtp.mutation";

const OTPVerification = () => {
  const navigate = useNavigate();

  const { state } = useLocation() as {
    state?: {
      name?: string;
      mobile?: string;
    };
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { consentId } = useParams<{ consentId: string }>();

  const { isPending, mutateAsync } = useVerifyOtpMutation();

  const handleVerify = async (otpValue: string) => {
    if (otpValue.length < 6) {
      setError("Enter 6 digits");
      return;
    }
    if (isPending) return;

    setError("");

    const res = await mutateAsync({
      consentId: consentId ?? "",
      otp: otpValue,
    });

    if (res.status === "success") {
      navigate(`/${consentId}/consent`); // ✅ relative navigation
    } else {
      setError(res?.message ?? "Invalid or expired OTP. Please try again.");
    }
  };

  const onOtpComplete = (otpValue: string) => {
    handleVerify(otpValue);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];

    // ✅ Handle paste of full OTP
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      digits.forEach((digit, idx) => {
        newOtp[idx] = digit;
      });
      setOtp(newOtp);

      if (digits.length === 6) {
        onOtpComplete(digits.join(""));
      }
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✅ Auto-submit when complete
    if (newOtp.join("").length === 6 && !newOtp.includes("")) {
      onOtpComplete(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasted.length === 6) {
      const digits = pasted.split("");
      setOtp(digits);
      onOtpComplete(pasted);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      <Header title="Identity Verification" />

      <div className="p-5 flex-grow overflow-y-auto">
        <button
          onClick={() => navigate("/")}
          className="text-[10px] text-blue-800 font-bold mb-4 flex items-center uppercase tracking-wider"
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back
        </button>

        <p className="text-xs text-gray-600 mb-6">
          A security code has been sent to your number ending in{" "}
          <span className="font-bold text-gray-900">
            {state?.mobile?.slice(6)}
          </span>
          .
        </p>

        <div className="flex justify-between gap-1.5 mb-5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste} // 🔥 ADD THIS
              className="w-full aspect-square text-center text-lg font-bold border-2 border-gray-100 rounded-lg focus:border-blue-800 focus:outline-none transition-all shadow-sm"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-bold mb-4 bg-red-50 p-2 rounded text-center">
            {error}
          </p>
        )}
      </div>

      <div className="p-5 bg-white border-t border-gray-100">
        <button
          disabled={isPending}
          onClick={() => handleVerify(otp.join(""))}
          className="w-full bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          {isPending ? "Verifying..." : "Verify & Proceed"}
        </button>
      </div>
    </div>
  );  
};

export default OTPVerification;
