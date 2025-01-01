import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading, subscribeToProfileUpdates, unsubscribeFromProfileUpdates } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // subscription to profile updates
  useEffect(() => {
    subscribeToProfileUpdates();
    return () => unsubscribeFromProfileUpdates();
  }, [subscribeToProfileUpdates, unsubscribeFromProfileUpdates]);

  const filteredUsers = users
    .filter((user) => showOnlineOnly ? onlineUsers.includes(user._id) : true)
    .filter((user) => 
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col">
      {/* Header Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-[#4a9eff]" />
            <span className="text-white text-lg font-medium">Contacts</span>
          </div>
          <div className="text-emerald-500 text-sm">
            {onlineUsers.length - 1} online
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#002437] text-white placeholder-gray-400 rounded-md pl-10 pr-4 py-2.5 focus:outline-none"
          />
        </div>

        {/* Online Only Toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="rounded border-gray-600 bg-transparent w-4 h-4"
          />
          <span className="text-gray-300 text-sm">Show online only</span>
        </label>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#0a2a3d]" />

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full px-4 py-3 flex items-center gap-3 transition-colors
              hover:bg-[#002437] relative
              ${selectedUser?._id === user._id ? "bg-[#002437]" : ""}
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#001824]" />
              )}
            </div>
            
            <div className="flex flex-col items-start">
              <span className="text-white font-medium">{user.username}</span>
              <span className={`text-sm ${onlineUsers.includes(user._id) ? "text-emerald-500" : "text-gray-400"}`}>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No contacts found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;