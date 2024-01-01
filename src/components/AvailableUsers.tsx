import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const AvailableUsers = () => {
    const { user } = useContext(AuthContext);
    const { availableUsers, createChat, onlineUsers } = useContext(ChatContext);
    return (
        <>
            <div className="flex">
                {availableUsers && availableUsers?.map((availableUser, index) => {
                    return (
                        <div className="relative bg-teal-500 w-fit px-2 rounded-md mb-2 cursor-pointer mx-1" key={index} onClick={() => createChat(user.id, availableUser.id)}>
                            <div className={onlineUsers?.some((user) => user?.userId === availableUser.id) ? "absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full border border-green-700" : ""}></div>
                            <p>{availableUser?.name}</p>
                        </div>

                    )
                })}
            </div>
        </>
    )
}

export default AvailableUsers;