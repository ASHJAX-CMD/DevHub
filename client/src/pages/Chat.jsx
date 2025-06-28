
import MessagesPanel from '../components/MessagesPanel';
import SearchProfile from '../components/SearchProfile'





const Chat = () => {

const dummyMessages = [
  { senderId: "123", text: "Hey, how are you?" },
  { senderId: "456", text: "I'm good, how about you?" },
  { senderId: "123", text: "Chilling and coding 🔥" },
];

const currentUserId = "123"; // Your logged-in user's ID


  return (
    <>
    
    <div className=" flex h-screen bg-[#fbfaf8]">
      <div className="flex flex-col h-full flex-1 p-4 overflow-y-auto space-y-6">
      <SearchProfile />
      <MessagesPanel messages={dummyMessages} currentUserId={currentUserId} />;
      
      </div>
      
    </div>
    </>
  )
}

export default Chat
