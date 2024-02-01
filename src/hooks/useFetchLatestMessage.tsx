import { ChatContext } from "@/context/ChatContext";
import { useContext, useEffect, useState } from "react";

export const useFetchLatestMessage = (chat) => {
    const {newMessage, notifications} = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const res = await fetch(`http://localhost:8000/api/v1/messages/${chat?.id}`, {
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