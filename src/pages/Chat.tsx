import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/UserChat";
import AvailableUsers from "../components/AvailableUsers";
import ChatBox from "../components/ChatBox";

const Chat = () => {
    const { userChats, updateCurrentChat } = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    return (
        <div className="flex bg-gray-900 h-lvh">
            <div className="w-1/3 p-10">
                <AvailableUsers/>
                <div className="flex flex-col">
                    {userChats?.map((chat, index) => {
                        return (
                            <div onClick={()=>updateCurrentChat(chat)} key={index} className="my-2">
                                <UserChat chat={chat} user={user}/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="w-2/3 p-10">
                <ChatBox/>
            </div>
        </div>
    )
}

export default Chat;