import React, {useState, useEffect, useContext} from 'react';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {getSystemStats, getUsers, PaginatedUsers, SystemStats, UserWithStats} from "@/services/adminService";

const AdminDashboard = () => {
    const {theme} = useContext(ThemeContext);
    const isDark = theme === 'dark';

    const [stats, setStats] = useState<SystemStats | null>(null);
    const [users, setUsers] = useState<PaginatedUsers | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, [currentPage]);

    const fetchDashboardData = async () => {
        try {
            const [statsData, usersData] = await Promise.all([
                getSystemStats(),
                getUsers(currentPage, 10)
            ]);
            setStats(statsData);
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"/>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen mt-1 pt-20 pb-16 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
            <div className="max-w-7xl mx-auto px-4">
                {/* Placeholder for content */}
            </div>
        </div>
    );
};

export default AdminDashboard;