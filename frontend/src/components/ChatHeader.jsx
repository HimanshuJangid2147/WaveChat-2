import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, subscribeToProfileUpdates, unsubscribeFromProfileUpdates } = useChatStore();
  const { onlineUsers } = useAuthStore();

useEffect(() => {
  subscribeToProfileUpdates();
  return () => unsubscribeFromProfileUpdates();
}, [subscribeToProfileUpdates, unsubscribeFromProfileUpdates]);


  return (
    <div className="p-4 border-b border-[#00141f]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName}
              className="size-10 rounded-full object-cover ring-2 ring-[#00141f]"
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{selectedUser.fullName}</h3>
            <p className="text-sm text-gray-400">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setSelectedUser(null)}
          className="p-2 hover:bg-[#0a2a3d] rounded-full transition-colors"
        >
          <X className="text-gray-400 hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;