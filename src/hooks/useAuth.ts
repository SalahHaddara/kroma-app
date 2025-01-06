import {useState, useEffect} from 'react';

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

    
}