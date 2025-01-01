import { create } from 'zustand';
import toast  from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';
// import { useAuthStore } from './useAuthStore.js';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,


    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const res = await axiosInstance.get('/messages/users');
            set({ users: res.data });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async(userId) => {
        console.log('Fetching messages for userId:', userId); // Debug userId
        set({ isMessageLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log('API Response:', res.data); // Log the API response
            set({ messages: res.data });
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Error fetching messages');
        } finally {
            set({ isMessageLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
            return res.data;
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Error sending message');
            throw error;
        }
    }, 

    setSelectedUser: (selectedUser) => {
        set({ selectedUser })
    },
}));