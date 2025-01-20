import axios from 'axios';
import {DesignAnalysisResult} from '@/types/designAnalysis';

const API_URL = 'http://localhost:3000/analysis';

export async function analyzeDesign(imageFile: File): Promise<DesignAnalysisResult> {
    try {
        if (!imageFile.type.startsWith('image/')) {
            throw new Error('Please upload a valid image file');
        }

        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error('Image must be smaller than 5MB');
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await axios.post(
            `${API_URL}/analyze`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                timeout: 30000
            }
        );

        // If we received a raw text response, process it
        if (typeof response.data === 'string' || response.data.rawAnalysis) {
            const analysisText = response.data.rawAnalysis || response.data;

            // Return structured format
            return {
                analysis: {
                    rawText: analysisText // Store the raw text for processing by the component
                }
            };
        }

        return response.data;
    } catch (error) {
        console.error('Design Analysis Error:', error);
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.error || error.message);
        }
        throw error;
    }
}