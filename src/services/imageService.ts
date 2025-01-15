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
