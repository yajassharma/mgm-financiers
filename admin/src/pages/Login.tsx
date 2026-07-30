import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignInMutation } from "../hooks/auth/mutation/useSignIn.mutation";
import { loginValidation } from "../form/login/validation";
import { loginIniValues as loginValues } from "../form/login/values";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import logo from "../assets/images/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { isPending, mutateAsync } = useSignInMutation();
  const signIn = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidation),
    defaultValues: loginValues,
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setError("");
    const res = await mutateAsync(data);
    if (res.status === "success") {
      localStorage.setItem("token", res.data?.token || "");
      signIn({
        auth: { token: res.data?.token || "", type: "Bearer" },
        userState: res.data?.authUserState,
      });
      navigate("/");
    } else {
      setError(res?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex bg-mgm-surface">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-mgm-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mgm-navy via-[#16213e] to-[#0f3460]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border border-mgm-gold/10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full border border-mgm-gold/10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full border border-mgm-gold/10" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <img src={logo} alt="MGM Financiers" className="w-32 h-32 object-contain mb-8" />
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">MGM Financiers</h2>
          <p className="text-mgm-gold text-sm font-medium uppercase tracking-widest">Admin Panel</p>
          <div className="mt-12 max-w-xs text-center">
            <p className="text-white/40 text-sm leading-relaxed">
              Manage payments, grievances, and consents from one secure dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logo} alt="MGM Financiers" className="w-16 h-16 object-contain mx-auto mb-3" />
            <h1 className="text-xl font-bold text-mgm-navy tracking-tight">MGM Financiers</h1>
            <p className="text-xs text-mgm-muted uppercase tracking-widest font-medium mt-1">Admin Panel</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-mgm-navy mb-1">Welcome back</h2>
            <p className="text-sm text-mgm-muted mb-8">Sign in to your admin account</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-3 text-sm bg-white border border-mgm-border rounded-xl outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-all"
                  placeholder="admin@mgmfinanciers.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-mgm-muted">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password")}
                  className="w-full px-4 py-3 text-sm bg-white border border-mgm-border rounded-xl outline-none focus:border-mgm-gold focus:ring-2 focus:ring-mgm-gold/10 transition-all"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-mgm-navy text-white font-semibold rounded-xl hover:bg-mgm-navy/90 transition-all disabled:opacity-50 shadow-sm mt-3 text-sm"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-[11px] text-mgm-muted mt-8">
            &copy; 2026 MGM Financiers. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
