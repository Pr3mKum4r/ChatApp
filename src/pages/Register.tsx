import { useRef, useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const childRef = useRef();
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('en');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const nameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const languageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    }

    const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const passwordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const confirmPasswordHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }
    const submitHandler = async () => {
        console.log(language);
        if (password === '' || name === '' || email === '' || language === '') {
            childRef.current?.notify('All fields are required!');
            return;
        }

        if (password !== confirmPassword) {
            childRef.current?.notify('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, preferredLanguage: language }),
            });
            const data = await res.json()

            if (res.status === 200) {
                navigate('/login');
            } else if (res.status === 400) {
                childRef.current?.notify(data.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            childRef.current?.notify('Login error!');
        } finally {
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
    };



    return (
        <section className="bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Create and account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Your name</label>
                                <input type="email" name="email" id="email" onChange={nameHandler} value={name} className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Enter your name" />
                            </div>
                            <div>
                                <label htmlFor="lang" className="block mb-2 text-sm font-medium text-white">Your preferred language</label>
                                <select id="countries" value={language} onChange={languageHandler} className="focus:outline-none text-sm rounded-lg block w-full p-2.5 bg-gray-700 placeholder-gray-400 text-white">
                                    <option value="en" selected>English</option>
                                    <option value="ja">Japanese</option>
                                    <option value="fr">French</option>
                                    <option value="es">Spanish</option>
                                    <option value="de">German</option>
                                    <option value="ru">Russian</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Your email</label>
                                <input type="email" name="email" id="email" onChange={emailHandler} value={email} className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="name@company.com" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                                <input type="password" name="password" onChange={passwordHandler} value={password} id="password" placeholder="••••••••" className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-white">Confirm password</label>
                                <input type="password" name="confirm-password" onChange={confirmPasswordHandler} value={confirmPassword} id="confirm-password" placeholder="••••••••" className="focus:outline-none sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
                            </div>
                            <button type="button" onClick={submitHandler} className="text-white w-full focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-blue-600 hover:bg-blue-700">Register</button>
                            <p className="text-sm font-light text-gray-400">
                                Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                            </p>
                            <ErrorAlert ref={childRef} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Register;