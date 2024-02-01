import { useFetchReciever } from "../hooks/useFetchReciever";
import avatar from '../assets/avatar.svg';
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";
import { useFetchLatestMessage } from "@/hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
    const { reciever } = useFetchReciever(chat, user);
    const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);
    const {latestMessage} = useFetchLatestMessage(chat);

    const unreadNotifications = notifications?.filter((notification) => notification.isRead === false);
    const userNotifications = unreadNotifications?.filter((notification) => notification.senderId === reciever?.id);

    const isOnline = onlineUsers?.find((user) => user.userId === reciever?.id);

    const truncateText = (text) =>{
        let shortText = text.substring(0, 20);
        if(text.length > 20){
            return `${shortText}...`;
        }
        return shortText;
    }

    return (
        <>
            <div className="flex cursor-pointer" onClick={()=>{
                if(userNotifications?.length !== 0){
                    markThisUserNotificationsAsRead(userNotifications, notifications);
                }
            }}>
                <div className="flex items-center m-2">
                    <img className="w-8 h-8" src={avatar} alt='avatar' />
                </div>
                <div className="flex flex-col w-11/12">
                    <div className="flex justify-end">
                        <div className={isOnline ? "bg-green-400 w-2 h-2 rounded-full" : ""}></div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-white">{reciever?.name}</p>
                        <p className="text-gray-400">{moment(latestMessage?.createdAt).calendar()}</p>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-gray-400 text-sm">{
                            latestMessage?.text && truncateText(latestMessage?.text)
                        }</p>
                        <p className={userNotifications?.length > 0 ? "text-white bg-teal-400 rounded-full w-4 h-4 text-xs flex justify-center items-center" : "hidden"}>{userNotifications?.length}</p>
                    </div>
                </div>
            </div>
            <div className="h-[0.3px] mt-1 w-full bg-slate-600"></div>
        </>
    )
}

export default UserChat;