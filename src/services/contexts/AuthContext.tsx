import React, {createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: () => {
    },
    logout: () => {
    }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token with backend
            fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.user) {
                        setIsAuthenticated(true);
                        setUser(data.user);
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login');
    };

};

export const useAuth = () => useContext(AuthContext);