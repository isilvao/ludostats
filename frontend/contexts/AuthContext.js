'use client'

import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;
    const [user, setUser] = useState(null);
    const {token, setToken} = useState(null);

    useEffect(() => {
        // Comprueba si el usuario está logueado

    }, [])

    const login = async (accessToken) => {
        try {
            setToken(accessToken)
        } catch (error) {
            console.error(error)
        }
    }

    const data = {
        accessToken: token,
        user,
        login
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}