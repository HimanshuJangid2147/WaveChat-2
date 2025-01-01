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
  isChangingUsername: false,
  isSubimmiting: false,
  isResetingPassword: false,
  isVerifyingResetToken: false,
  onlineUsers: [],
  
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
      const res = await axiosInstance.put("/auth/update-profile", data);
      console.log("Server response:", res.data);

      set({ 
        authUser: res.data.updatedUser, 
        isUpdatingProfile: false
      });

      toast.success("Profile updated successfully");
      return res.data.updatedUser;    
    } catch (error) {
      console.log("Update Error:", error?.response?.data);
      toast.error(error?.response?.data?.error || "Error updating profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  changeUsername: async (newUsername) => {
    set({ isChangingUsername: true });
    try {
          // Check if we have a valid auth user first
    const currentUser = useAuthStore.getState().authUser;
    if (!currentUser) {
      throw new Error("You must be logged in to change username");
    }

      const res = await axiosInstance.put("/auth/change-username", {
        username: newUsername.trim(),
      });

      // Update the auth user state with the new data
      set({ 
        authUser: res.data,
        isChangingUsername: false 
      });

      toast.success("Username updated successfully");
      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Failed to update username";
      toast.error(errorMessage);
      
      // Throw the error so we can handle it in the component
      throw {
        message: errorMessage,
        field: error?.response?.data?.field || 'username',
        status: error?.response?.status
      };
    } finally {
      set({ isChangingUsername: false });
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
