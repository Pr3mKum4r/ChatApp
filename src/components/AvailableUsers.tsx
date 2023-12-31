import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";

const AvailableUsers = () => {
    const { user } = useContext(AuthContext);
    const { availableUsers, createChat } = useContext(ChatContext);
    return (
        <>
            <div className="flex">
                {availableUsers && availableUsers?.map((availableUser, index) => {
                    return (
                        <div className="bg-teal-500 w-fit px-2 rounded-md mb-2 cursor-pointer mx-1" key={index} onClick={() => createChat(user.id, availableUser.id)}>
                            <p>{availableUser?.name}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default AvailableUsers;