import { createContext, use, useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
import api from "../config/axios";

type user = {
    name: string
    email: string
}
type userAuth = {
    isLoggedIn: boolean
    user: user | null
    login:(email:string, password:string) => Promise<void>
    signup:(name:string, email:string, password:string) => Promise<void>
    logout: () => Promise<void>
}
const AuthContext = createContext<userAuth | null>(null)
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<user | null>(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    useEffect(() => {}, [])
    
    const login = async (email: string, password: string) => {
        const response = await api.post("/user/login", {
            email,
            password,
        });
        if (response.status !== 200) {
            throw new Error("Unable to login");
        }
        const data = response.data;
        if (data) {
            setUser({ name: data.name, email: data.email });
            setIsLoggedIn(true);
        }
    };
    
    const signup = async (name: string, email: string, password: string) => {
        const response = await api.post("/user/signup", {
            name,
            email,
            password,
        });
        if (response.status !== 201) {
            throw new Error("Unable to signup");
        }
        const data = response.data;
        if (data) {
            setUser({ name: data.name, email: data.email });
            setIsLoggedIn(true);
        }
    };
    
    const logout = async () => {};

    const value = {
        isLoggedIn,
        user,
        login,
        signup,
        logout
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);