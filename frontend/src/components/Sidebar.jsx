import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  // const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col">
      <div className="border-b border-[#00141f] p-5">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#4a9eff]" />
          <span className="font-medium text-white hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto py-3 scrollbar-thin scrollbar-thumb-[#0a2a3d] scrollbar-track-transparent">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-[#0a2a3d] transition-all duration-200 rounded-lg my-2
              ${selectedUser?._id === user._id ? "bg-[#0a2a3d] ring-1 ring-[#4a9eff]/20" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full ring-2 ring-[#00141f]"
              />
              {users.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full ring-2 ring-[#001823]" />
              )}
            </div>
            
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium text-white truncate">{user.username}</div>
              <div className="text-sm text-gray-400">
                {users.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        
        {users.length === 0 && (
          <div className="text-center text-gray-400 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;