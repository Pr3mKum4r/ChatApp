import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    // State to manage the toggle status of the navbar
    const [isOpen, setIsOpen] = useState(false);

    // Function to toggle the navbar
    const toggleNavbar = () => setIsOpen(!isOpen);

    const { user, logoutUser } = useContext(AuthContext);

    return (
        <nav className="flex items-center justify-between flex-wrap bg-black lg:px-32 p-4">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">ChatApp</span>
            </div>
            <div className="block lg:hidden">
                <button onClick={toggleNavbar} className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div>
                {user && <span className="text-white mr-4">Logged in as {user.name}</span>}
            </div>
            <div className={`${isOpen ? 'max-h-40' : 'max-h-0'} w-full transition-all duration-500 ease-in-out overflow-hidden lg:max-h-full lg:flex lg:items-end lg:w-48`}>
                <div className="text-sm lg:flex-grow">
                    {
                        user ? (
                            <>
                                <a onClick={()=> logoutUser()} href="/login" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                    Logout
                                </a>
                            </>
                        ) : (
                            <>
                                <a href="/login" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                                    Login
                                </a>
                                <a href="/register" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
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
