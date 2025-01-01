import { MessagesSquare } from 'lucide-react';

const NoMessages = ({ username }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-[#0a2a3d]/50 p-4 rounded-full mb-4">
        <MessagesSquare className="w-8 h-8 text-[#4a9eff]" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">No messages yet</h3>
      <p className="text-gray-400 max-w-md">
        Start a conversation with {username} by sending your first message below!
      </p>
    </div>
  );
};

export default NoMessages;