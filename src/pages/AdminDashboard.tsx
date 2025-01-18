import React, {useState, useEffect, useContext} from 'react';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {getSystemStats, getUsers, PaginatedUsers, SystemStats, UserWithStats} from "@/services/adminService";
import {Card} from '@/components/ui/card';

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

    const StatCard = ({title, value, icon: Icon}) => (
        <Card className={`p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {title}
                    </p>
                    <h3 className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {value}
                    </h3>
                </div>
                <Icon className={`h-8 w-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}/>
            </div>
        </Card>
    );

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