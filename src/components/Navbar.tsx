import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Popover from '@mui/material/Popover';
import profile from '../assets/profile.svg';
import Notification from './Notification';
import logo from '../assets/logo.jpg';

const Navbar = () => {
    // State to manage the toggle status of the navbar
    // const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the navbar
    // const toggleNavbar = () => setIsOpen(!isOpen);

    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const { user, logoutUser } = useContext(AuthContext);

    return (
        <nav className="flex items-center justify-between flex-wrap bg-black lg:px-14 px-2">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <img src={logo} alt='logo' className='h-20 w-[85px]'/>
            </div>
            {/* <div className="block lg:hidden">
                <button onClick={toggleNavbar} className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div> */}
            {/* <div>
                {user && <span className="text-white mr-4">Logged in as {user.name}</span>}
            </div> */}
            <div className={` transition-all duration-500 ease-in-out overflow-hidden lg:max-h-full lg:flex lg:items-end`}>
                <div className="text-sm lg:flex-grow flex items-center">
                    {
                        user ? (
                            <>
                                <Notification/>
                                <div>
                                    {user && <span className="text-white text-lg mr-4 font-poppins">{user.name}</span>}
                                </div>
                                <div onClick={handleClick}>
                                    <img className="w-8 h-8 cursor-pointer" src={profile} alt='avatar' />
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
                                    style={{marginTop: '8px', padding: '20px' }}
                                >
                                    <div className='p-3 bg-slate-800 border-slate-800 w-fit self-start flex flex-col items-center'>
                                        <a onClick={() => logoutUser()} href="/login" className="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                                            Logout
                                        </a>
                                    </div>
                                </Popover>
                                {/* <Popover>
                                    <PopoverTrigger>
                                        <img className="w-8 h-8 cursor-pointer" src={profile} alt='avatar' />
                                    </PopoverTrigger>
                                    <PopoverContent className='bg-slate-800 border-slate-800 w-fit self-start flex flex-col items-center'>
                                        <a onClick={() => logoutUser()} href="/login" className="block lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                                            Logout
                                        </a>
                                    </PopoverContent>
                                </Popover> */}
                            </>
                        ) : (
                            <>
                                <a href="/login" className="font-poppins lg:font-bold lg:text-lg font-semibold block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                    Login
                                </a>
                                <a href="/register" className="font-poppins lg:font-bold lg:text-lg font-semibold block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                    Register
                                </a>
                            </>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
