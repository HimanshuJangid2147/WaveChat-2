import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
        const messageData = {
            text: text.trim(),
            image: imagePreview,
        };
        
        // Clear the form before sending to prevent double submissions
        setText("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        await sendMessage(messageData);
        
    } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message");
    }
};

  return (
    <div className="p-4 w-full border-t border-[#00141f]">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#0a2a3d]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0a2a3d] hover:bg-[#0a2a3d]/80
              flex items-center justify-center transition-colors"
              type="button"
            >
              <X className="size-3 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-[#0a2a3d] border border-[#00141f] 
            text-white placeholder-gray-400 focus:outline-none focus:border-[#4a9eff]"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex p-2 rounded-full hover:bg-[#0a2a3d] transition-colors
              ${imagePreview ? "text-[#4a9eff]" : "text-gray-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="p-2 rounded-full bg-[#4a9eff] hover:bg-[#4a9eff]/90 transition-colors disabled:opacity-50"
          disabled={(!text.trim() && !imagePreview) || !selectedUser}
        >
          <Send size={20} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;