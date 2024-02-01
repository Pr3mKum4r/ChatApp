import { AuthContext } from '@/context/AuthContext';
import bell from '../assets/bell.png';
import Popover from '@mui/material/Popover';
import React, { useContext } from 'react';
import { ChatContext } from '@/context/ChatContext';
import moment from 'moment';

const Notification = () => {

    const { user } = useContext(AuthContext);
    const { notifications, userChats, allUsers, markAllNotificationsAsRead } = useContext(ChatContext);

    const unreadNotifications = notifications?.filter((notification) => notification.isRead === false);
    const modifiedNotifications = notifications?.map((notification) => {
        const sender = allUsers?.find((user) => user.id === notification.senderId);

        return {
            ...notification,
            senderName: sender?.name,
        };
    });

    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div className='px-5 flex items-center'>
            <div className='relative p-2'>
                <img src={bell} className='h-5 w-5 cursor-pointer' alt='bell' onClick={handleClick} />
                {unreadNotifications?.length > 0 && <span className='bg-red-500 rounded-full h-4 w-4 ml-1 text-xs text-white absolute left-4 top-0 flex justify-center items-center'>{unreadNotifications?.length}</span>}
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                style={{ marginTop: '8px', padding: '20px' }}
            >
                <div className='p-3 bg-slate-800 border-slate-800 w-fit self-start flex flex-col'>
                    <div className='flex mb-2'>
                        <h1 className='text-teal-200'>Notifcations</h1>
                        <p className='text-teal-200 ml-5 cursor-pointer' onClick={()=> markAllNotificationsAsRead(notifications)}>Mark all as read</p>
                    </div>
                    {modifiedNotifications?.length === 0 ? <span className='text-white text-sm'>No Notifications Yet !!!</span> : null}
                    {modifiedNotifications && modifiedNotifications.map((notification, index) => {
                        return <div key={index} className={notification.isRead ? 'flex flex-col text-white py-2 px-2 mb-2 border-b-2 rounded-md' : 'flex flex-col text-white py-2 px-2 mb-2 border-b-2 bg-slate-700 rounded-md'}>
                            <span className='text-sm'>{`${notification.senderName} sent you a new message`}</span>
                            <span className='text-xs'>{moment(notification.date).calendar()}</span>
                        </div>
                    })}
                </div>
            </Popover>
        </div>
    )
}

export default Notification;