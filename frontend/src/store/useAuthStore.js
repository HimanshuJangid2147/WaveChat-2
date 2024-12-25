import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isSubimmiting: false,
  isResetingPassword: false,
  isVerifyingResetToken: false,
//   isLoggingOut: false,

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
      toast.error(error.response.data.message);
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
      await axiosInstance.get(`/auth/verify-reset-token/:token/${token}`);
      toast.success("Reset token verified successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isVerifyingResetToken: false });
    }
  },

  resetPassword: async (data) => {
    set({ isResetingPassword: true });
    try {
      await axiosInstance.post("/auth/reset-password", data);
      toast.success("Password reset successfully. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isResetingPassword: false });
    }
  },



  // isLoggedOut: false, // This is not used in this example, but it's a good idea to keep track of the logout status.

  // other relevant state and actions...
}));