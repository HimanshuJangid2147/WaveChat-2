import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16">
      <div className="max-w-md text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-[#0a2a3d] flex items-center justify-center animate-pulse">
            <MessageSquare className="w-10 h-10 text-[#4a9eff] transition-transform hover:scale-110" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-[#cdfdff]">Welcome to Wave-Chat!</h2>
        <p className="text-gray-400">
          Select a conversation from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;