import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Users, Calendar, DollarSign, Ticket, FileText } from 'lucide-react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';
import { API_URL } from '../utils/config';

const DashboardCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group">
        <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center text-${color}-400 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        totalPasses: 0,
        totalRevenue: 0,
        recentRegistrations: [],
        registrationTrends: [],
        allRegistrations: []
    });
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, allRegRes] = await Promise.all([
                    axios.get(`${API_URL}/auth/stats`, config),
                    axios.get(`${API_URL}/registrations/all`, config)
                ]);

                setStats({
                    ...statsRes.data,
                    allRegistrations: allRegRes.data
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Group registrations by pass name
    const passRegistrationData = Object.values(
        (stats.allRegistrations || []).reduce((acc, reg) => {
            const passName = reg.pass?.name || "Unknown Pass";

            if (!acc[passName]) {
                acc[passName] = {
                    name: passName,
                    registrations: 0
                };
            }

            acc[passName].registrations += 1;
            return acc;
        }, {})
    );

    if (loading) return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white">
            <Sidebar />
            <div className="flex-1 flex items-center justify-center">
                <Loader text="Loading Dashboard..." />
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">

                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Dashboard
                            </h1>
                            <p className="text-gray-400 mt-1">Welcome back, Admin</p>
                        </div>
                    </header>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <DashboardCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="blue" />
                        <DashboardCard title="Real Registrations" value={stats.totalRegistrations} icon={Users} color="purple" />
                        <DashboardCard title="Live Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
                        <DashboardCard title="Active Passes" value={stats.totalPasses} icon={Ticket} color="yellow" />
                    </div>

                    {/* Pass Registration Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Registrations per Pass</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={passRegistrationData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="name" stroke="#999" />
                                        <YAxis stroke="#999" />
                                        <Tooltip
                                            cursor={{ fill: '#333' }}
                                            contentStyle={{
                                                backgroundColor: '#1a1a1a',
                                                border: 'none',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar
                                            dataKey="registrations"
                                            fill="#8884d8"
                                            barSize={40}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Site Config Shortcut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div onClick={() => window.location.href = '/admin/content'} className="cursor-pointer">
                            <DashboardCard title="Site Config" value="Content" icon={FileText} color="cyan" />
                        </div>
                    </div>

                    {/* Recent Registrations */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Recent Registrations (Paid)</h2>
                        <div className="space-y-4">
                            {stats.recentRegistrations.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No recent activity</p>
                            ) : stats.recentRegistrations.map((reg) => (
                                <div key={reg._id} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {reg.studentName} - {reg.pass?.name || 'Pass'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(reg.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-green-400">₹{reg.amount}</p>
                                        <p className="text-[10px] text-gray-500">{reg.rollNumber}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
