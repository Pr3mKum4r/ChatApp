import {useState, useEffect} from 'react';

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

export const useFetchReciever = (chat: UserChats | null, user: UserData | null) => {
    const [reciever, setReciever] = useState<UserData | null>(null);

    const recieverId = chat?.members?.find((id: string) => id !== user?.id);
    const backendURL = 'https://chat-app-server-pr3mkum4r.vercel.app/';
    useEffect(() => {
        const getUser = async () => {
            if(!recieverId) return;
            try{
                const res = await fetch(`${backendURL}api/v1/users/${recieverId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await res.json();
                setReciever(data);
            } catch (error) {
                console.error('Error fetching reciever:', error);
            }
        }

        getUser();
    }, [recieverId]);

    return {reciever};
}