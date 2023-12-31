import { useFetchReciever } from "../hooks/useFetchReciever";
import avatar from '../assets/avatar.svg';

const UserChat = ({ chat, user }) => {
    const { reciever } = useFetchReciever(chat, user);
    return (
        <>
            <div className="flex cursor-pointer">
                <div className="flex items-center m-2">
                    <img className="w-8 h-8" src={avatar} alt='avatar' />
                </div>
                <div className="flex flex-col w-11/12">
                    <div className="flex justify-end">
                        <div className="bg-green-400 w-2 h-2 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-white">{reciever?.name}</p>
                        <p className="text-gray-400">12/12/2024</p>
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-gray-400 text-sm">Text message</p>
                        <p className="text-white bg-teal-400 rounded-full w-4 h-4 text-xs flex justify-center items-center">2</p>
                    </div>
                </div>
            </div>
            <div className="h-[0.3px] mt-1 w-full bg-slate-600"></div>
        </>
    )
}

export default UserChat;