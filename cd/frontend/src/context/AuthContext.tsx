import { createContext, use, useEffect } from "react"
import { useState } from "react"
import { useContext } from "react"
type user = {
    name: string
    email: string
}
type userAuth = {
    isLoogedIn: boolean
    user: user | null
    login:(email:string, password:string) => Promise<void>
    signup:(name:string, email:string, password:string) => Promise<void>
    logout: () => Promise<void>
}
const AuthContext = createContext<userAuth | null>(null)
export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<user | null>(null)
    const [isLoogedIn, setIsLoogedIn] = useState(false)
    
    useEffect(() => {}, [])
    const login = async (email: string, password: string) => {};
    const signup = async (name: string, email: string, password: string) => {};
    const logout = async () => {};

    const value = {
        isLoogedIn,
        user,
        login,
        signup,
        logout
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);