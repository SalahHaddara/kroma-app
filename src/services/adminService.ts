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

export interface PaginatedUsers {
    users: UserWithStats[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface UserDetails {
    user: {
        _id: string;
        fullName: string;
        email: string;
        avatar?: string;
    };
    stats: UserStats & {
        averageDesignsPerDay: number;
    };
    history: {
        designs: any[];
        analyses: any[];
    };
}

export interface SystemStats {
    overview: {
        totalUsers: number;
        totalDesigns: number;
        totalAnalyses: number;
        activeUsers: number;
    };
    dailyStats: {
        _id: string;
        count: number;
    }[];
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

export const getUsers = async (page: number = 1, limit: number = 10): Promise<PaginatedUsers> => {
    try {
        const response = await adminApi.get(`/users?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const getUserDetails = async (userId: string): Promise<UserDetails> => {
    try {
        const response = await adminApi.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch user details');
    }
};

export const removeUser = async (userId: string): Promise<void> => {
    try {
        await adminApi.delete(`/users/${userId}`);
    } catch (error) {
        throw new Error('Failed to remove user');
    }
};

export const getSystemStats = async (): Promise<SystemStats> => {
    try {
        const response = await adminApi.get('/stats');
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch system statistics');
    }
};