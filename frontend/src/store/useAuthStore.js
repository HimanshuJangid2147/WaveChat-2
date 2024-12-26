import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isTokenValid: false,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSubimmiting: false,
  isResetingPassword: false,
  isVerifyingResetToken: false,
  
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error("Invalid email or password", error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isResetingPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isResetingPassword: false });
    }
  },

  verifyResetToken: async (token) => {
    set({ isVerifyingResetToken: true });
    try {
      const response = await axiosInstance.get(
        `/auth/verify-reset-token/${token}`
      );
      const data = response.data;

      if (data.valid) {
        set({ isTokenValid: true });
      } else {
        set({ isTokenValid: false });
      }
    } catch (error) {
      set({ isTokenValid: false });
      console.error("Error verifying token:", error);
    } finally {
      set({ isVerifyingResetToken: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isResetingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success("Password reset successfully.");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to reset password.");
      throw error;
    } finally {
      set({ isResetingPassword: false });
    }
  },

  // other relevant state and actions...
}));
