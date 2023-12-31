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
    updateCurrentChat: (chat: UserChats) => void;
    messages: any;
}

export const ChatContext = createContext<AuthContextType>({ user: null });

export const ChatContextProvider = ({ children, user }: { children: ReactNode, user: UserData }) => {
    const [userChats, setUserChats] = useState(null);
    const childRef = useRef();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);

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
                childRef.current?.notify('Error fetching users!');
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
                childRef.current?.notify('Error fetching chats!');
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
                childRef.current?.notify('Error fetching messages!');
            }
        };

        fetchMessages();
    }, [currentChat]);

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
            childRef.current?.notify('Error creating chat!');
        }
    }

    return (
        <ChatContext.Provider value={{ userChats, availableUsers, createChat, updateCurrentChat, messages }}>
            {children}
            <ErrorAlert ref={childRef} />
        </ChatContext.Provider>
    );
};