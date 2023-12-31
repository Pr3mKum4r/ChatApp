import { useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useFetchReciever } from "../hooks/useFetchReciever";
import moment from 'moment';
import InputEmoji from "react-input-emoji";
import sendIcon from '../assets/send.png';

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, sendTextMessage } = useContext(ChatContext);
    const { reciever } = useFetchReciever(currentChat, user);
    const [textMessage, setTextMessage] = useState('');

    if (!reciever) return <p>No Chat Selected Yet !!!</p>

    console.log(user)

    return (
        <div className="flex flex-col h-full">
            <div className="bg-slate-700 py-1 rounded-t-lg">
                <p className="text-center text-white">{reciever?.name}</p>
            </div>
            
            <div className="bg-slate-800 h-[73%] p-4 flex flex-col overflow-y-scroll">
                {messages && messages.map((message, index) =>
                    <div key={index} className={`${message?.senderId === user?.id ?
                        "bg-emerald-500 w-fit p-2 rounded-lg my-1 self-end"
                        : "bg-[#91A3B0] w-fit p-2 rounded-lg my-1"}`}>
                        <p className="">{message.text}</p>
                        <p className="text-slate-700 text-[8pt] mt-1">{moment(message.createdAt).calendar()}</p>
                    </div>
                )}
            </div>
            <div className="flex bg-slate-800 rounded-b-lg p-4">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                />
                <button  onClick={() => sendTextMessage(textMessage, user, currentChat.id, setTextMessage)}>
                    <img src={sendIcon} alt="send" className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
}

export default ChatBox;