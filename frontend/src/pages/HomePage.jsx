import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";
import NotificationSystem from "../components/NotificationSystem";

const Container = ({ children, className = '' }) => (
  <div className={`bg-[#001823]/80 backdrop-blur-sm border-r border-[#00141f] rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768 && selectedUser) {
      setShowSidebar(false);
    }
  }, [selectedUser]);

  return (
    <div className="fixed inset-0 top-16"> 
      <NotificationSystem />
      <div className="relative h-[calc(100vh-4rem)] p-2 md:p-4 flex gap-4">
        {/* Mobile overlay */}
        {showSidebar && window.innerWidth < 768 && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Toggle Sidebar Button */}
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed right-4 bottom-4 z-[60] p-3 bg-[#0a2a3d] rounded-full shadow-lg md:hidden
            hover:bg-[#0a2a3d]/80 transition-colors"
        >
          {showSidebar ? <X className="text-white" /> : <Menu className="text-white" />}
        </button>

        {/* Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 left-0 h-full w-[280px] md:w-[320px]
          transition-all duration-300 ease-in-out z-50
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Container className="h-full">
            <Sidebar onClose={() => setShowSidebar(false)} />
          </Container>
        </div>
        
        {/* Main Chat Area */}
        <Container className="min-h-full w-full flex-1 md:block">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </Container>
      </div>
    </div>
  );
};

export default HomePage;