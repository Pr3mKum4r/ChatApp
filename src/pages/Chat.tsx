import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/UserChat";
import AvailableUsers from "../components/AvailableUsers";
import ChatBox from "../components/ChatBox";

const Chat = () => {
    const { userChats, updateCurrentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const [isChatBoxVisible, setIsChatBoxVisible] = useState(false);

    const handleChatSelection = (chat) => {
        updateCurrentChat(chat);
        setIsChatBoxVisible(true); // Show chat box on smaller screens when a chat is selected
    };

    const handleBackClick = () => {
        setIsChatBoxVisible(false);
    }
    return (
        <div className="flex bg-gray-900 h-[calc(100vh-64px)]">
            <div className={`lg:w-1/3 p-10 ${isChatBoxVisible ? 'hidden lg:block' : 'w-full'}`}>
                <AvailableUsers/>
                <div className="flex flex-col">
                    {userChats?.map((chat, index) => {
                        return (
                            <div onClick={()=> handleChatSelection(chat)} key={index} className="my-2">
                                <UserChat chat={chat} user={user}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={`lg:w-2/3 p-10 ${isChatBoxVisible ? 'w-full' : 'hidden lg:block'}`}>
                <ChatBox handleBack={handleBackClick}/>
            </div>
        </div>
    )
}

export default Chat;