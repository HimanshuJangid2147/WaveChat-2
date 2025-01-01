import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  unreadMessages: {},

  // method to handle profile updates
  updateUserProfile: (userId, newProfilePic) => {
    const { users, selectedUser } = get();
    // Update users list
    const updatedUsers = users.map((user) =>
      user._id === userId ? { ...user, profilePic: newProfilePic } : user
    );

    // Update selected user if it's the one being modified
    const updatedSelectedUser =
      selectedUser?._id === userId
        ? { ...selectedUser, profilePic: newProfilePic }
        : selectedUser;

    set({
      users: updatedUsers,
      selectedUser: updatedSelectedUser,
    });
  },

  // new method to subscribe to profile updates
  subscribeToProfileUpdates: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("profilePicUpdate", ({ userId, newProfilePic }) => {
      get().updateUserProfile(userId, newProfilePic);
    });
  },

  // new method to unsubscribe from profile updates
  unsubscribeFromProfileUpdates: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("profilePicUpdate");
  },

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },

  setMessageAsRead: (userId) => {
    set(state => ({
      unreadMessages: {
        ...state.unreadMessages,
        [userId]: 0
      }
    }));
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // Set messages to an empty array if no messages are returned
      set({ messages: res.data || [] });
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Only show error toast for actual errors, not for empty messages
      if (error.response?.status !== 404) {
        toast.error("Error fetching messages");
      }
      // Set messages to empty array on error
      set({ messages: [] });
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
      return res.data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error sending message");
      throw error;
    }
  },

  suscribeToNewMessages: () => {
    const socket = useAuthStore.getState().socket;
  
    socket.on("newMessage", (newMessage) => {
      const { messages, selectedUser, unreadMessages } = get();
      
      // Update messages array if it's from selected user
      if (selectedUser?._id === newMessage.senderId) {
        set({ messages: [...messages, newMessage] });
      } 
      // Increment unread count for other users
      else {
        set({
          unreadMessages: {
            ...unreadMessages,
            [newMessage.senderId]: (unreadMessages[newMessage.senderId] || 0) + 1
          }
        });
      }
    });
  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
