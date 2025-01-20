import axios from 'axios';

const API_URL = 'http://localhost:3000';

const authApi = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptor to include token in requests
authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface AuthResponse {
    token: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        avatar?: string;
        isAdmin: boolean;
    }
}

export const verifyToken = async (): Promise<AuthResponse> => {
    const response = await authApi.get('/auth/verify');
    return response.data;
};

export const signup = async (
    fullName: string,
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/signup', {
        fullName,
        email,
        password
    });
    return response.data;
};

export const login = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', {
        email,
        password
    });
    return response.data;
};

export const googleAuth = async (token: string): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/google', {token});
    return response.data;
};

export const githubAuth = async (code: string): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/github', {code});
    return response.data;
};