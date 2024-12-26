import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore.js";
import { useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Waves from "./components/extraa/Waves";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

const App = () => {
  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({authUser});

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircleIcon className="animate-spin size-10" />

      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Waves className="-z-50"/>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage /> : <Navigate to="/login"/> } />
        <Route path="/signup" element={ !authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={ authUser ? <ProfilePage /> : <Navigate to="/login"/> } />
        <Route path="/forgot-password" element={ !authUser ? <ForgotPasswordPage /> : <Navigate to="/login" />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage /> } />
      </Routes>   
      <Toaster />
    </div>
  )
}

export default App;