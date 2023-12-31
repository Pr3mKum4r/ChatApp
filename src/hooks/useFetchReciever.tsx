import {useState, useEffect} from 'react';

export const useFetchReciever = (chat, user) => {
    const [reciever, setReciever] = useState(null);

    const recieverId = chat?.members?.find((id: string) => id !== user?.id);

    useEffect(() => {
        const getUser = async () => {
            if(!recieverId) return;
            try{
                const res = await fetch(`http://localhost:8000/api/v1/users/${recieverId}`, {
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
    }, []);

    return {reciever};
}