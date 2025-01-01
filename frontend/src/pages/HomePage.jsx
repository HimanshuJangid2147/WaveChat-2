import NoChatSelected from "../components/NoChatSelected";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import { useChatStore } from "../store/useChatStore";

const Container = ({ children, className = '' }) => (
  <div className={`bg-[#001823]/80 backdrop-blur-sm border-r border-[#00141f] rounded-lg shadow-cl h-[90vh] overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${className}`}>
    {children}
  </div>
);

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="fixed inset-0 top-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="relative z-10 flex items-center justify-center pt-10 px-4 gap-4">
        <Container className="md:w-1/4 lg:w-1/5">
          <Sidebar />
        </Container>
        
        <Container className="flex-1">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </Container>
      </div>
    </div>
  );
};

export default HomePage;