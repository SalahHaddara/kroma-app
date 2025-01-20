import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../../services/contexts/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const {isAuthenticated, isAdmin, loading} = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"/>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace/>;
    }

    return <>{children}</>;
};
