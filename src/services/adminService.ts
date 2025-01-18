import axios from 'axios';

const API_URL = 'http://localhost:3000/admin';

export interface UserStats {
    totalDesigns: number;
    totalAnalyses: number;
    lastActive: string;
}
