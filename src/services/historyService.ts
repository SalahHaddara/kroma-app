import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export interface HistoryItem {
    _id: string;
    prompt: string;
    createdAt: string;
    designImage?: string;
    designTokens?: {
        colors: string[][];
        typography: {
            fontFamily: string;
            sizes: {
                h1: number;
                h2: number;
                paragraph: number;
            };
        };
        quote: {
            styles: {
                backgroundColor: string;
                cornerRadius: string;
                padding: string;
            };
            quoteSymbol: {
                color: string;
                fontSize: string;
            };
            quote: {
                text: string;
                color: string;
                fontSize: string;
                fontWeight: string;
                letterSpacing: string;
            };
            author: {
                name: string;
                color: string;
                fontSize: string;
                fontWeight: string;
                letterSpacing: string;
            };
        };
    };
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface HistoryResponse {
    history: HistoryItem[];
    pagination: PaginationInfo;
}

export const getHistoryItems = async (page = 1, limit = 6): Promise<HistoryResponse> => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await axios.get(`${API_URL}/history`, {
        params: {page, limit},
        headers: {Authorization: `Bearer ${token}`},
    });

    return response.data.data;
};