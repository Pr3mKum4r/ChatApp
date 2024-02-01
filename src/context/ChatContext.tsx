import { createContext, ReactNode, useEffect, useState, useRef, useCallback } from "react";
import ErrorAlert from "../components/ErrorAlert";
import { Socket, io } from "socket.io-client";

interface UserData {
    id: string;
    name: string;
    email: string;
    token?: string;
    preferredLanguage: string;
}

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

interface OnlineUser {
    userId: string;     
    socketId: string;   
}

interface ChatContextType {
    user: UserData | null;
    userChats: UserChats[] | null;
    availableUsers: UserData[] | null;
    createChat: (firstId: string, secondId: string) => void;
    currentChat: UserChats | null;
    updateCurrentChat: (chat: UserChats) => void;
    messages: Message[] | null;
    sendTextMessage: (textMessage: string, sender: UserData, chatId: string, setTextMessage: (newMessage: string) => void) => void;
    onlineUsers: OnlineUser[] | null;
    setMessages: () => void;
}

const defaultChatContext: ChatContextType = {
    user: null,
    userChats: null,
    availableUsers: null,
    createChat: () => {}, 
    currentChat: null,
    updateCurrentChat: () => {},
    messages: null,
    sendTextMessage: () => {}, 
    onlineUsers: null,
    setMessages: () => {}
};

export const ChatContext = createContext<ChatContextType>(defaultChatContext);

export const ChatContextProvider = ({ children, user }: { children: ReactNode, user: UserData }) => {
    const [userChats, setUserChats] = useState(null);
    const childRef = useRef();
    const [availableUsers, setAvailableUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    //initialize the socket
    useEffect(() =>{
        const newSocket: Socket = io("http://localhost:3000");
        setSocket(newSocket);
        return () => newSocket.disconnect();
    }, [user]);

    //Add new user to online users
    useEffect(() => {
        if(!socket) return;
        socket.emit('addNewUser', user?.id);
        socket.on('emitOnlineUsers', (onlineUsers: any) => {
            setOnlineUsers(onlineUsers);
        });
        return () => socket.off('emitOnlineUsers');
    }, [socket]);

    //Send message
    useEffect(() => {
        if(!socket) return;
        const recieverId = currentChat?.members?.find((id: string) => id !== user?.id);
        socket.emit("sendMessage", {...newMessage, receiverId: recieverId });
    }, [newMessage]);

    //Recieve message and notification
    useEffect(() => {
        if(!socket) return;
        socket.on("getMessage", (data: any) => {
            if(currentChat?.id !== data.chatId) return;
            setMessages((prev)=> [...prev, data]);
        });
        socket.on("getNotification", (data: any) => {
            const isChatOpen = currentChat?.members.some(id => id === data.senderId);
            if(isChatOpen){
                setNotifications(prev => [{...data, isRead:true}, ...prev])
            }
            else{
                setNotifications(prev => [data, ...prev])
            }
        });
        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        }
    }, [socket, currentChat]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/v1/users', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const resData = await res.json();
                const availableUsersForChat = resData.filter((availableUser: UserData) => {
                    let isChatCreated = false;
                    if (availableUser.id === user.id) return false;
                    if (userChats) {
                        isChatCreated = userChats?.some((chat: UserChats) => {
                            return chat.members[0] === availableUser.id || chat.members[1] === availableUser.id;
                        });
                    }
                    return !isChatCreated;
                })
                setAvailableUsers(availableUsersForChat);
                setAllUsers(resData);
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

    const translateMessage = async ( sourceLanguage: string, messageText: string, targetLanguage: string) => {
        try {
            const res = await fetch('http://localhost:8000/api/v1/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    sourceLanguage: sourceLanguage, 
                    messageText: messageText, 
                    targetLanguage: targetLanguage 
                }),
            });
            const data = await res.json();
            return data.translatedText;
        } catch (err) {
            console.log(err);
        }
    }   

    const sendTextMessage = async (textMessage: string, sender: UserData, reciever: UserData, chatId: string, setTextMessage: (newMessage: string) => void, temporaryId: string) => {
        try{
            setTextMessage('');
            const originalLanguage = sender?.preferredLanguage;
            const targetLanguage = reciever?.preferredLanguage;

            console.log(sender);
            console.log(targetLanguage);

            const translatedText = await translateMessage(originalLanguage, textMessage, targetLanguage);

            const res = await fetch('http://localhost:8000/api/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    chatId: chatId,
                    senderId: sender?.id,
                    text: textMessage,
                    originalLanguage: originalLanguage,
                    targetLanguage: targetLanguage,
                    translatedText: translatedText,
                }),
            });
            const data = await res.json();
            setNewMessage(data);
            setMessages(prevMessages => {
                return prevMessages.map(message => 
                    message.id === temporaryId ? { ...message, ...data, id: data.id } : message
                );
            });
        } catch (err) {
            console.log(err);
            setMessages(prevMessages => prevMessages.filter(message => message.id !== temporaryId));
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

    const markAllNotificationsAsRead = useCallback((notifications) => {
        const mNotifications = notifications.map((notification) => {
            return {
                ...notification,
                isRead: true,
            }
        });
        setNotifications(mNotifications);
    }, []);

    const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
            const mNotifications = notifications.map((el) => {
                let notification;
                thisUserNotifications.forEach((n) => {
                    if(n.senderId === el.senderId){
                        notification = {
                            ...n,
                            isRead: true,
                        }
                    }
                    else{
                        notification = el;
                    }
                });
                return notification;
            });
            setNotifications(mNotifications);
    }, []);

    return (
        <ChatContext.Provider value={{ userChats, availableUsers, createChat, currentChat, updateCurrentChat, messages, sendTextMessage, onlineUsers, notifications, setMessages, allUsers, markAllNotificationsAsRead, markThisUserNotificationsAsRead}}>
            {children}
            <ErrorAlert ref={childRef} />
        </ChatContext.Provider>
    );
};