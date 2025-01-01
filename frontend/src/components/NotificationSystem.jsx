import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { useSound } from 'use-sound';

const NotificationSystem = () => {
  const { selectedUser, users, setSelectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const [playNotification] = useSound('/notification.mp3', { volume: 0.5 });
  
  const handleNewMessage = useCallback((newMessage) => {
    if (selectedUser?._id !== newMessage.senderId && newMessage.senderId !== authUser._id) {
      const sender = users.find(user => user._id === newMessage.senderId);
      playNotification();
      
      toast.custom((t) => (
        <div 
          className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-[#002437] shadow-lg rounded-lg pointer-events-auto 
            hover:bg-[#003451] transition-colors cursor-pointer`}
          onClick={() => {
            setSelectedUser(sender);
            toast.dismiss(t.id);
          }}
        >
          <div className="flex p-4">
            <div className="flex-shrink-0 relative">
              <img
                className="h-12 w-12 rounded-full border-2 border-[#4a9eff]"
                src={sender?.profilePic || '/avatar.png'}
                alt=""
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#002437]" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-white">
                {sender?.username || 'User'}
              </p>
              <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                {newMessage.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.dismiss(t.id);
              }}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: 'top-right'
      });
    }
  }, [selectedUser?._id, users, authUser._id, playNotification, setSelectedUser]);

  useEffect(() => {
    const socket = useAuthStore.getState().socket;
    socket?.on("newMessage", handleNewMessage);
    return () => socket?.off("newMessage", handleNewMessage);
  }, [handleNewMessage]);

  return null;
};

export default NotificationSystem;