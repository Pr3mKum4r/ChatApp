import { createContext, useState, ReactNode, useEffect } from "react";

interface UserData {
    name: string;
    email: string;
    token?: string;
}

interface AuthContextType {
    user: UserData | null;
    setUser: (userData: UserData) => void;
    logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    logoutUser: () => { },
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const initialUser = JSON.parse(localStorage.getItem('user') || 'null');
    const [user, setUser] = useState<UserData | null>(initialUser);

    console.log(user);

    const updateUser = (userData: UserData) => {
        localStorage.setItem('user', JSON.stringify(userData));

        const userDataWithoutToken = { ...userData };
        delete userDataWithoutToken.token;

        setUser(userDataWithoutToken);
    };

    const logoutUser = () => {
        localStorage.removeItem('user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser: updateUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    );
};
