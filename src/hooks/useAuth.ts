import {useState, useEffect} from 'react';
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
            });
        }
    }, []);

    return authState;
};