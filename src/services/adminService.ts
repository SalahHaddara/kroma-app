import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export interface UserStats {
    totalDesigns: number;
    totalAnalyses: number;
    lastActive: string;
}

export interface UserWithStats {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
    stats: UserStats;
}


const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
