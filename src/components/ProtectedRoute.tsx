import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from '../services/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {isAuthenticated, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted URL
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    return <>{children}</>;
};