import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as authService from '../auth';

interface User {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (fullName: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: async () => {
    },
    signup: async () => {
    },
    logout: () => {
    }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authService.login(email, password);
        setUser(response.user);
        setIsAuthenticated(true);
        navigate('/dashboard');
    };

    const signup = async (fullName: string, email: string, password: string) => {
        const response = await authService.signup(fullName, email, password);
        setUser(response.user);
        setIsAuthenticated(true);
        navigate('/dashboard');
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);