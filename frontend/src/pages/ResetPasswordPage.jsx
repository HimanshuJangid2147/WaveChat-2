import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Lock } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  
  const { 
    resetPassword, 
    isResetingPassword,
    verifyResetToken,
    isTokenValid
  } = useAuthStore();

  useEffect(() => {
    if (token) {
      verifyResetToken(token);
    }
  }, [token, verifyResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await resetPassword(token, password);
      navigate('/login');
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex justify-center items-center font-redhat">
        <div className="w-full max-w-md bg-[#0a2a3d] p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-400">Invalid or Expired Link</h2>
            <p className="mt-2 text-[#cdfdff]">Please request a new password reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center font-redhat">
      <div className="w-full max-w-md bg-[#0a2a3d] p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Lock className="size-6 text-primary" color="#9afcff" />
            </div>
            <h1 className="text-2xl font-semibold mt-2 text-[#cdfdff]">Reset Password</h1>
            <p className="text-base-content/60 text-[#cdfdff]">Enter your new password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label" htmlFor="password">
              <span className="label-text font-small text-[#cdfdff]">New Password:</span>
            </label>
            <input
              type="password"
              id="password"
              className="input input-bordered w-full rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="confirmPassword">
              <span className="label-text font-small text-[#cdfdff]">Confirm Password:</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input input-bordered w-full rounded-lg bg-transparent text-slate-400 border border-slate-600 p-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isResetingPassword}
              className="w-full rounded-lg py-2 px-4 text-[#cdfdff] border border-slate-400
                hover:bg-transparent bg-[#0a2a3d] focus:outline-none focus:ring-2 focus:ring-primary/40
                disabled:cursor-not-allowed"
            >
              {isResetingPassword ? (
                <Loader2 className="animate-spin size-5 mx-auto" color="#9afcff" />
              ) : (
                'Reset Password'
              )}
            </button>
            <div className="text-center text-[#cdfdff]">
              <a
                href="/login"
                className="font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
              >
                Back to Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}