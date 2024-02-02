import { ChatContext } from "@/context/ChatContext";
import { useContext, useEffect, useState } from "react";

interface UserChats {
    id: string;
    members: string[];
    createdAt?: Date;
}

interface Message {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    createdAt: Date;
    originalLanguage: string;
    targetLanguage: string;
    translatedText: string;
}

export const useFetchLatestMessage = (chat: UserChats) => {
    const {newMessage, notifications} = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState<Message | null>(null);
    const backendURL = 'https://chat-app-server-pr3mkum4r.vercel.app/';

    useEffect(() => {
        const getMessages = async () => {
            const res = await fetch(`${backendURL}api/v1/messages/${chat?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            const data = await res.json();
            const lastMessage = data[data.length - 1];
            setLatestMessage(lastMessage);
        };
        getMessages();
    }, [newMessage, notifications]);

    return {latestMessage};
};