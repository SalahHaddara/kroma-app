import axios from 'axios'

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