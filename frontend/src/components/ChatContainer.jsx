import { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import NoMessages from "./NoMessages";

const ChatContainer = () => {
  const { messages, selectedUser, isMessageLoading, getMessages, suscribeToNewMessages,  unSubscribeFromMessages} = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);
  const messageContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const smoothScrollTo = (element, to, duration) => {
    const start = element.scrollTop;
    const change = to - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth deceleration
      const easeOutCubic = progress => 1 - Math.pow(1 - progress, 3);
      
      element.scrollTop = start + change * easeOutCubic(progress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Handle scroll events with debounce
  const handleScroll = useCallback(() => {
    if (!messageContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isNearBottom);
  }, []);

  // Enhanced smooth scroll to bottom
  const scrollToBottom = useCallback((instant = false) => {
    if (!messageContainerRef.current || !messagesEndRef.current) return;

    const container = messageContainerRef.current;
    const scrollTarget = container.scrollHeight - container.clientHeight;

    if (instant) {
      container.scrollTop = scrollTarget;
    } else {
      smoothScrollTo(container, scrollTarget, 300); // 300ms duration
    }
  }, []);

  // Scroll to bottom only when new messages arrive AND auto-scroll is enabled
  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll, scrollToBottom]);

  // Force scroll to bottom when changing conversations
  useEffect(() => {
    if (selectedUser) {
      scrollToBottom(true); // instant scroll for conversation change
      setAutoScroll(true);
    }
  }, [selectedUser._id, scrollToBottom, selectedUser]);

  // Fetch messages when selected user changes
  useEffect(() => {
      getMessages(selectedUser._id);

      suscribeToNewMessages();
      return () => unSubscribeFromMessages();
  }, [selectedUser._id, getMessages, suscribeToNewMessages, unSubscribeFromMessages]);

  const containerStyle = "flex flex-col h-full max-h-full";
  const messageContainerStyle = `
    flex-1 overflow-y-auto p-2 md:p-4 space-y-4
    scrollbar-thin scrollbar-thumb-[#0a2a3d] scrollbar-track-transparent
    scroll-smooth
  `;

  if (isMessageLoading) {
    return (
      <div className={containerStyle}>
        <ChatHeader />
        <div className={messageContainerStyle}>
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <ChatHeader />
      <div 
        ref={messageContainerRef}
        onScroll={handleScroll}
        className={messageContainerStyle}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full ring-2 ring-[#00141f]/50">
                    <img 
                      src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png" } 
                      alt="Avatar"
                      className="object-cover" 
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1 text-gray-300">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className={`chat-bubble ${
                  message.senderId === authUser._id 
                    ? "bg-[#0a2a3d]/90 backdrop-blur-sm" 
                    : "bg-[#00141f]/90 backdrop-blur-sm"
                }`}>
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Message image" 
                      className="max-w-[200px] w-full rounded-md mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <NoMessages username={selectedUser.username} />
        )}
      </div>
      <MessageInput scrollToBottom={() => {
        scrollToBottom();
        setAutoScroll(true);
      }} />
    </div>
  );
};

export default ChatContainer;