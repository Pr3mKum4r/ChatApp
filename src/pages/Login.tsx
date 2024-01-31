import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../components/ErrorAlert';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const childRef = useRef();
    const { setUser } = useContext(AuthContext);

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value.toLowerCase());
    }

    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const submitHandler = async () =>{
        try {
            const res = await fetch('http://localhost:8000/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json()

            if (res.status === 200) {
                setUser(data);
                navigate('/');
            } else if(res.status === 400) {
                childRef.current?.notify(data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            childRef.current?.notify('Login error!');
        } finally {
            setEmail('');
            setPassword('');
        }
    }

    return (
        <section className="bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                <input type="email" name="email" onChange={emailHandler} value={email} id="email" className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                <input type="password" name="password" onChange={passwordHandler} value={password} id="password" placeholder="••••••••" className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
                            </div>
                            <button type="button" onClick={submitHandler} className="text-white w-full focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700">Login</button>
                            <p className="text-sm font-light text-gray-400">
                                Don’t have an account yet? <a href="/register" className="font-medium hover:underline text-primary-500">Sign up</a>
                            </p>
                            <ErrorAlert ref={childRef} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login;