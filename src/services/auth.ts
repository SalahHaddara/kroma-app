import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

interface AuthResponse {
    token: string;
    user: {
        _id: string;
        fullName: string;
        email: string;
        avatar?: string;
    }
}

export const signup = async (fullName: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/signup`, {
        fullName,
        email,
        password
    });
    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
    });
    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
};

export const googleAuth = async (token: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/google`, {token});
    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
};

export const githubAuth = async (code: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/github`, {code});
    const data = response.data;
    localStorage.setItem('token', data.token);
    return data;
};

export const logout = (): void => {
    localStorage.removeItem('token');
};