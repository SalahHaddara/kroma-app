import axios from 'axios';
import {DesignResponse} from "@/services/imageService";
import {DesignAnalysisResult} from "@/types/designAnalysis";

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

export const generateImageDesign = async (file: File): Promise<DesignResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<DesignResponse>('/get-design/generate-from-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export async function analyzeDesign(imageFile: File): Promise<DesignAnalysisResult> {
    try {
        // Validate file
        if (!imageFile.type.startsWith('image/')) {
            throw new Error('Please upload a valid image file');
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error('Image must be smaller than 5MB');
        }

        console.log('Sending file:', {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type
        });

        const formData = new FormData();
        formData.append('image', imageFile);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await axios.post<DesignAnalysisResult>(
            `http://localhost:3000/analysis/analyze`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total!
                    );
                    console.log('Upload progress:', percentCompleted);
                },
                timeout: 30000
            }
        );

        return response.data;
    } catch (error) {
        console.error('Design Analysis Error:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || error.message);
        }
        throw error;
    }
}

export async function getAnalysisHistory(): Promise<DesignAnalysisResult[]> {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get<DesignAnalysisResult[]>(`http://localhost:3000/get-design/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch analysis history');
    }
}

export default api;