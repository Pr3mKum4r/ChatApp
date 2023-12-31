import { createContext, ReactNode, useEffect, useState, useRef } from "react";
import ErrorAlert from "../components/ErrorAlert";

interface UserData {
    id: string;
    name: string;
    email: string;
}

interface UserChats {
    id: string;
    members: string[];
    createdAt: Date;
}


interface AuthContextType {
    user: UserData | null;
    userChats: UserChats[] | null;
    availableUsers: UserData[] | null;
    createChat: (firstId: string, secondId: string) => void;
    currentChat: UserChats | null;
    updateCurrentChat: (chat: UserChats) => void;
    messages: any;
    sendTextMessage: (textMessage: string, sender: any, chatId: string, setTextMessage: any) => void;
}

export const ChatContext = createContext<AuthContextType>({ user: null });

export const ChatContextProvider = ({ children, user }: { children: ReactNode, user: UserData }) => {
    const [userChats, setUserChats] = useState(null);
    const childRef = useRef();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/users', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const resData = await res.json();
                const availableUsersForChat = resData.filter((availableUser) => {
                    let isChatCreated = false;
                    if (availableUser.id === user.id) return false;
                    if (userChats) {
                        isChatCreated = userChats?.some((chat) => {
                            return chat.members[0] === availableUser.id || chat.members[1] === availableUser.id;
                        });
                    }
                    return !isChatCreated;
                })
                setAvailableUsers(availableUsersForChat);
            } catch (err) {
                console.log(err);
            }
        }
        getUsers();
    }, [userChats]);

    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/chats/${user?.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                if (res.status === 400) {
                    childRef.current?.notify(data.message);
                }
                setUserChats(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserChats();
    }, [user]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:8000/api/v1/messages/${currentChat?.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                if (res.status === 400) {
                    childRef.current?.notify(data.message);
                }
                setMessages(data);
                console.log(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchMessages();
    }, [currentChat]);

    const sendTextMessage = async (textMessage: string, sender: UserData, chatId: string, setTextMessage: any) => {
        try{
            const res = await fetch('http://localhost:8000/api/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    chatId: chatId,
                    senderId: sender?.id,
                    text: textMessage,
                }),
            });
            const data = await res.json();
            setTextMessage('');
            setNewMessage(data);
            setMessages((prev)=> [...prev, data]);
        } catch (err) {
            console.log(err);
        }
    }

    const updateCurrentChat = (chat: UserChats) => {
        setCurrentChat(chat);
    }

    const createChat = async (firstId: string, secondId: string) => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstId, secondId }),
            });
            const data = await res.json();
            setUserChats((prev)=> [...prev, data]);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <ChatContext.Provider value={{ userChats, availableUsers, createChat, currentChat, updateCurrentChat, messages, sendTextMessage }}>
            {children}
            <ErrorAlert ref={childRef} />
        </ChatContext.Provider>
    );
};