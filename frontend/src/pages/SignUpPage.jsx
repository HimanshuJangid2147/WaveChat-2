import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageSquare,
  User,
  Lock,
  SquareUserRound,
  EyeOff,
  Eye,
  Link as LucideLink,
  Loader2,
} from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";
import "../components/extraa/Responsiveness.css"

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return toast.error("Full name is required.");
    }
    if (!formData.username.trim()) {
      return toast.error("Username is required.");
    }
    if (!formData.email.trim()) {
      return toast.error("Email is required.");
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return toast.error("Please enter a valid email address.");
    }
    if (!formData.password.trim()) {
      return toast.error("Password is required.");
    }
    if (!formData.confirmPassword.trim()) {
      return toast.error("Confirm password is required.");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    if (!formData.gender) {
      return toast.error("Gender is required.");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="auth-container grid grid-cols-1 lg:grid-cols-2 font-redhat">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 bg-gradient-to-b from-[#002233]/80 to-[#001522]/80 backdrop-blur-sm">
        <div className="form-container space-y-6">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare
                  className="size-6 text-primary"
                  color="#9afcff"
                />
              </div>
              <h1 className="text-2xl font-semibold mt-2 text-[#cdfdff]">
                Create Account
              </h1>
              <p className="text-base-content/60 text-[#cdfdff]">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="form-wrapper space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label" htmlFor="fullName">
                <span className="label-text font-small text-[#cdfdff]">
                  Full Name:
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    className="size-5 text-base-content/40"
                    color="#9afcff"
                  />
                </div>
                <input
                  id="fullname"
                  type="text"
                  className={
                    "input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                  }
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Username */}
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text font-small text-[#cdfdff]">
                  Username:
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SquareUserRound
                    className="size-5 text-base-content/40"
                    color="#9afcff"
                  />
                </div>
                <input
                  id="username"
                  type="text"
                  className="input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text font-small text-[#cdfdff]">
                  Email:
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className="size-5 text-base-content/40"
                    color="#9afcff"
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  className={
                    "input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                  }
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="form-control">
              <fieldset>
                <legend className="label-text text-[#cdfdff] mb-2">Gender:</legend>
                <div className="gender-selection flex gap-4 mt-2">
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 text-[#cdfdff]"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={value}
                        className="radio radio-primary"
                        checked={formData.gender === value}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        aria-label={label}
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Password Fields */}
            <div className="password-fields flex gap-4">
              {/* Password */}
              <div className="form-control">
                <label className="label" htmlFor="password">
                  <span className="label-text font-small text-[#cdfdff]">
                    Password:
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="size-5 text-base-content/40"
                      color="#9afcff"
                    />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={
                      "input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                    }
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff
                        className="size-5 text-base-content/40"
                        color="#9afcff"
                      />
                    ) : (
                      <Eye
                        className="size-5 text-base-content/40"
                        color="#9afcff"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-control">
                <label className="label" htmlFor="confirmPassword">
                  <span className="label-text font-small text-[#cdfdff]">
                    Confirm Password:
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock
                      className="size-5 text-base-content/40"
                      color="#9afcff"
                    />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className={
                      "input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                    }
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff
                        className="size-5 text-base-content/40"
                        color="#9afcff"
                      />
                    ) : (
                      <Eye
                        className="size-5 text-base-content/40"
                        color="#9afcff"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-footer flex flex-col gap-4">
              <button
                type="submit"
                className="w-full rounded-lg py-3 px-4 text-[#cdfdff] border border-slate-400
                          hover:bg-transparent bg-[#0a2a3d] focus:outline-none focus:ring-2 focus:ring-primary/40
                          disabled:cursor-not-allowed"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="animate-spin size-5" color="#9afcff" />
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Link to Login Page */}
              <div className="text-center text-[#cdfdff]">
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
                >
                  <p>Already have an account? </p>
                  <LucideLink color="#9afcff" /> {/* This is the Lucide icon */}
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex justify-center items-center relative">
        <AuthImagePattern
          title="Join our community"
          subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
        />
      </div>
    </div>
  );
};

export default SignUpPage;
