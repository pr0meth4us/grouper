"use client"
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: never | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:8080/auth/status', {
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const userData = await response.json();
        setUser(userData);
    };

    const signup = async (email: string, password: string, name: string) => {
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password, name }),
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        const userData = await response.json();
        setUser(userData);
    };

    const logout = async () => {
        await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};