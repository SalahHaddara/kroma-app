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