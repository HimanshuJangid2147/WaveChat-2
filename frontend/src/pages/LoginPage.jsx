// import React from 'react';
import { MessageSquare, Mail, Lock, Eye, Link, EyeOff, Loader2 } from 'lucide-react';
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData ] = useState({
    email: "",
    username: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-redhat z-10">
      <div className="flex flex-col justify-center items-center p-6 sm:p-4 bg-gradient-to-b from-[#002233] to-[#001522]">
        <div className="w-full max-w-md space-y-8">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" color="#9afcff" />
              </div>
              <h1 className="text-2xl font-semibold mt-2 text-[#cdfdff]">
                Welcome Back
              </h1>
              <p className="text-base-content/60 text-[#cdfdff]">
                Sign in to your account
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleOnSubmit} className="space-y-6">
            {/* Email */}
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text font-small text-[#cdfdff]">Email:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" color="#9afcff" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text font-small text-[#cdfdff]">Password:</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" color="#9afcff" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                />
                <span className="text-sm text-[#cdfdff]">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full rounded-lg py-2 px-4 text-[#cdfdff] border border-slate-400
                hover:bg-transparent bg-[#0a2a3d] focus:outline-none focus:ring-2 focus:ring-primary/40
                disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
              </button>
              <div className="text-center text-[#cdfdff] ">
                <a href="/signup" className="font-semibold text-blue-400 flex gap-2 items-center justify-center">
                  <p>Don&apos;t have an account?{" "}</p>
                  <Link />
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex justify-center items-center relative">
        <AuthImagePattern
          title="Welcome back"
          subtitle={"Sign in to continue your conversations and catch up with your messages."}
        />
      </div>
    </div>
  );
};

export default LoginPage;