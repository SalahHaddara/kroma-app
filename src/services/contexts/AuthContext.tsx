import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
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
    const location = useLocation();

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
            setIsAuthenticated(true);

            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, {replace: true});
        } catch (error) {
            // Clean up any partial data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (fullName: string, email: string, password: string) => {
        setLoading(true);
        try {
            const response = await authService.signup(fullName, email, password);

            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            setUser(response.user);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"/>
            </div>
        );
    }

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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export {AuthContext};