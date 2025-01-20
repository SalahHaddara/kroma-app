import {useState, useEffect} from 'react';
import axios from "axios";

const API_URL = 'http://localhost:3000';

interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    loading: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        loading: true
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Verify token and get user data
            axios.get(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setAuthState({
                        isAuthenticated: true,
                        user: response.data.user,
                        loading: false
                    });
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setAuthState({
                        isAuthenticated: false,
                        user: null,
                        loading: false
                    });
                });
        } else {
            setAuthState({
                isAuthenticated: false,
                user: null,
                loading: false
            });
        }
    }, []);

    return authState;
};