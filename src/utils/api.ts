import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const generateDesign = async (prompt: string) => {
    const response = await api.post('/get-design/tokens', {prompt});
    return response.data;
};

export const getLatestDesign = async () => {
    const response = await api.get('/get-design/latest-tokens');
    return response.data;
};

export default api;