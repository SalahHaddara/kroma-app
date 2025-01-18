import React, {useState, useEffect, useContext} from 'react';
import {ThemeContext} from '@/services/contexts/ThemeContext';
import {Card} from '@/components/ui/card';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {Users, BarChart, Activity, AlertCircle} from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from '@/components/ui/table';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    getUsers, getSystemStats, removeUser,
    UserWithStats, SystemStats, PaginatedUsers
} from '@/services/adminService';

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats && (
                        <>
                            <StatCard
                                title="Total Users"
                                value={stats.overview.totalUsers}
                                icon={Users}
                            />
                            <StatCard
                                title="Active Users"
                                value={stats.overview.activeUsers}
                                icon={Activity}
                            />
                            <StatCard
                                title="Total Designs"
                                value={stats.overview.totalDesigns}
                                icon={BarChart}
                            />
                            <StatCard
                                title="Total Analyses"
                                value={stats.overview.totalAnalyses}
                                icon={AlertCircle}
                            />
                        </>
                    )}
                </div>
                {stats && (
                    <Card
                        className={`p-6 mb-8 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Daily Usage
                        </h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={stats.dailyStats}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis
                                        dataKey="_id"
                                        stroke={isDark ? '#94a3b8' : '#475569'}
                                    />
                                    <YAxis stroke={isDark ? '#94a3b8' : '#475569'}/>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                            color: isDark ? '#ffffff' : '#000000',
                                        }}
                                    />
                                    <Legend/>
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        name="Designs Created"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                )}
                {users && (
                    <Card className={`p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Users
                        </h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Total Designs</TableHead>
                                    <TableHead>Total Analyses</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell
                                            className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>{user.fullName}</TableCell>
                                        <TableCell
                                            className={isDark ? 'text-slate-300' : 'text-slate-900'}>{user.email}</TableCell>
                                        <TableCell
                                            className={isDark ? 'text-slate-300' : 'text-slate-900'}>{user.stats.totalDesigns}</TableCell>
                                        <TableCell
                                            className={isDark ? 'text-slate-300' : 'text-slate-900'}>{user.stats.totalAnalyses}</TableCell>
                                        <TableCell className={isDark ? 'text-slate-300' : 'text-slate-900'}>
                                            {new Date(user.stats.lastActive).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteDialogOpen(true);
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between items-center mt-4">
                            <Button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                variant="outline"
                                className={isDark ? 'border-slate-700 hover:bg-slate-800' : ''}
                            >
                                Previous
                            </Button>

                            <Button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, users.pagination.pages))}
                                disabled={currentPage === users.pagination.pages}
                                variant="outline"
                                className={isDark ? 'border-slate-700 hover:bg-slate-800' : ''}
                            >
                                Next
                            </Button>
                        </div>
                    </Card>
                )}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm User Removal</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to remove {selectedUser?.fullName}?
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteUser}
                            >
                                Remove User
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminDashboard;