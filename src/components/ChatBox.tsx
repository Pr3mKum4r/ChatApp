import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchReciever } from "../hooks/useFetchReciever";
import moment from 'moment';
import InputEmoji from "react-input-emoji";
import sendIcon from '../assets/send.png';
import backIcon from '../assets/arrow.png';
import DefaultChatBox from "./DefaultChatBox";

interface UserData {
    id: string;
    name: string;
    email: string;
    token?: string;
    preferredLanguage: string;
}

const ChatBox = ({ handleBack }: {handleBack: ()=>void}) => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, sendTextMessage, appendMessage } = useContext(ChatContext);
    const { reciever } = useFetchReciever(currentChat, user);
    const [textMessage, setTextMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    if (!reciever) return <DefaultChatBox />

    console.log(user)

    const sendOptimisticTextMessage = (textMessage: string, user: UserData | null, reciever: UserData, currentChatId: string | undefined) => {
        const temporaryId = 'temp-' + new Date().getTime();
        if(!user){
            console.log('No user');
            return;
        }
        if(!currentChatId) return;
        const optimisticMessage = {
            id: temporaryId, // Temporary unique ID
            chatId: currentChatId,
            senderId: user.id,
            text: textMessage,
            createdAt: new Date(),
            originalLanguage: 'temp',
            targetLanguage: 'temp',
            translatedText: 'temp'
            // other fields as needed
        };
    
        // Optimistically update the messages array
        appendMessage(optimisticMessage);
    
        // Call the actual send message function
        sendTextMessage(textMessage, user, reciever, currentChatId, setTextMessage, temporaryId);
    };
    

    return (
        <div className="flex flex-col h-full">
            <div className="bg-slate-700 py-1 rounded-t-lg flex ">
                <img src={backIcon} alt='back' className="h-8 w-8 p-2 cursor-pointer lg:hidden" onClick={handleBack}/>
                <p className="w-11/12 text-center text-white">{reciever?.name}</p>
            </div>

            <div className="bg-slate-800 h-[73%] p-4 flex flex-col overflow-y-scroll">
                {messages && messages.map((message, index) => {
                    return message?.senderId === user?.id ?
                        <div key ={index} className="bg-emerald-500 w-fit p-2 rounded-lg my-1 self-end">
                            <p>{message.text}</p>
                            <p className="text-slate-700 text-[8pt] mt-1">{moment(message.createdAt).calendar()}</p>
                        </div> :
                        <div key={index} className="bg-[#91A3B0] w-fit p-2 rounded-lg my-1">
                            <p>{message.translatedText}</p>
                            <p className="text-slate-700 text-[8pt] mt-1">{moment(message.createdAt).calendar()}</p>
                        </div>;
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex bg-slate-800 rounded-b-lg p-4">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                />
                <button onClick={() => sendOptimisticTextMessage(textMessage, user, reciever, currentChat?.id)}>
                    <img src={sendIcon} alt="send" className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

export default ChatBox;