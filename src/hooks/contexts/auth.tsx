import { jwtDecode } from 'jwt-decode'
import { createContext, ReactNode, useContext, useState } from 'react'

export interface LoggedUserData {
    userId: number
    name: string
    userType: number
}

interface AuthContextData {
    loggedUser: LoggedUserData | undefined
    setLoggedUser: (value: LoggedUserData | undefined) => void
    defineLoggedUserByToken: (token: string) => LoggedUserData
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthContextProviderProps {
    children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [loggedUser, setLoggedUser] = useState<LoggedUserData | undefined>(undefined)

    const defineLoggedUserByToken = (token: string) => {
        let decodedToken: LoggedUserData

        try {
            decodedToken = jwtDecode<LoggedUserData>(token)
        } catch (error) {
            throw new Error('Token inválido')
        }

        decodedToken = {
            userId: Number(decodedToken.userId),
            name: decodedToken.name,
            userType: Number(decodedToken.userType)
        }

        setLoggedUser(decodedToken)

        return decodedToken
    }

    return (
        <AuthContext.Provider value={{
            loggedUser, setLoggedUser,
            defineLoggedUserByToken
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    return useContext(AuthContext)
}
