import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const AvailableUsers = () => {
    const { user } = useContext(AuthContext);
    const { availableUsers, createChat, onlineUsers } = useContext(ChatContext);
    return (
        <>
            {(availableUsers || []).length > 0 ? <p className="px-2 py-2 text-white font-poppins">Available users</p> : <p></p>}
            <div className="flex">
                {availableUsers && availableUsers?.map((availableUser, index) => {
                    return (
                        <div className="relative bg-teal-500 w-fit px-2 rounded-md mb-2 cursor-pointer mx-1" key={index} onClick={() => user && createChat(user?.id, availableUser.id)}>
                            <div className={onlineUsers?.some((user) => user?.userId === availableUser.id) ? "absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full border border-green-700" : ""}></div>
                            <p className="font-poppins">{availableUser?.name}</p>
                        </div>

                    )
                })}
            </div>
        </>
    )
}

export default AvailableUsers;