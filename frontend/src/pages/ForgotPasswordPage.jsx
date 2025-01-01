import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const isResetingPassword = useAuthStore((state) => state.isResetingPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!email.trim()) {
      return toast.error("Please Enter a Valid E-mail address.");
    }

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center font-redhat">
      <div className="w-full max-w-md bg-[#0a2a3d] p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mail className="size-6 text-primary" color="#9afcff" />
            </div>
            <h1 className="text-2xl font-semibold mt-2 text-[#cdfdff]">
              Forgot Password
            </h1>
            <p className="text-base-content/60 text-[#cdfdff]">
              Enter your email to reset your password
            </p>
          </div>
        </div>
        {isSubmitted ? (
          <div className="text-center text-[#cdfdff]">
            <p className="text-green-400">Password reset link sent to your email!</p>
            <p>Please check your inbox and follow the instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text font-small text-[#cdfdff]">
                  Email:
                </span>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="w-full rounded-lg py-2 px-4 text-[#cdfdff] border border-slate-400
                    hover:bg-transparent bg-[#0a2a3d] focus:outline-none focus:ring-2 focus:ring-primary/40
                    disabled:cursor-not-allowed"
                disabled={isResetingPassword}
              >
                {isResetingPassword ? (
                  <Loader2 className="animate-spin size-5 mx-auto" color="#9afcff" />
                ) : (
                  "Reset Password"
                )}
              </button>
              <div className="text-center text-[#cdfdff]">
                <Link
                  to="/login"
                  className="font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;