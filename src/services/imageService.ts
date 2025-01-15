import axios from 'axios';

const API_URL = 'http://localhost:3000';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ImageValidationResult {
    isValid: boolean;
    error?: string;
}

export interface DesignResponse {
    prompt: string;
    designSystem: {
        colors: string[];
        typography: {
            fontFamily: string;
            fontSize: string;
        };
    };
    inspirationImages: string[];
}

export const validateImage = (file: File): ImageValidationResult => {
    if (!file.type.startsWith('image/')) {
        return {
            isValid: false,
            error: 'File must be an image'
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: 'Image must be less than 5MB'
        };
    }

    return {isValid: true};
};

