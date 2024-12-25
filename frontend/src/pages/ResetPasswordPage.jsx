import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { verifyToken, resetPassword, isResettingPassword, isTokenValid } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await verifyToken(token);
      } catch (error) {
        console.error(error);
        toast.error("Invalid or expired token. Please request a new reset link.");
        navigate("/forgot-password");
      }
    };

    if (token) checkToken();
  }, [token, verifyToken, navigate]);

  const validateForm = () => {
    if (!formData.password.trim()) {
      return toast.error("Password is required.");
    }
    if (formData.password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await resetPassword(token, formData.password); // Passing the token and new password
        toast.success("Password reset successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(error.message || "Failed to reset password.");
      }
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#002233] to-[#001522] font-redhat">
        <div className="text-center text-[#cdfdff]">
          <h1 className="text-2xl font-semibold">Invalid or Expired Token</h1>
          <p className="text-sm mt-2">
            Please request a new password reset link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-[#002233] to-[#001522] font-redhat">
      <div className="w-full max-w-md p-6 rounded-lg bg-[#0a2a3d] border border-slate-600">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-[#cdfdff]">Reset Password</h1>
          <p className="text-sm text-[#cdfdff]/70">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password */}
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text text-[#cdfdff]">New Password:</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" color="#9afcff" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                placeholder="New Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" color="#9afcff" />
                ) : (
                  <Eye className="size-5 text-base-content/40" color="#9afcff" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text text-[#cdfdff]">Confirm Password:</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" color="#9afcff" />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" color="#9afcff" />
                ) : (
                  <Eye className="size-5 text-base-content/40" color="#9afcff" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg py-2 px-4 text-[#cdfdff] border border-slate-400
              hover:bg-transparent bg-[#001f33] focus:outline-none focus:ring-2 focus:ring-primary/40
              disabled:cursor-not-allowed"
            disabled={isResettingPassword}
          >
            {isResettingPassword ? (
              <Loader2 className="animate-spin size-5 mx-auto" color="#9afcff" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
