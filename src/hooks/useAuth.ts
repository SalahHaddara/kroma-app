import {useState, useEffect} from 'react';

interface AuthState {
    isAuthenticated: boolean;
    user: any | null;
    loading: boolean;
}