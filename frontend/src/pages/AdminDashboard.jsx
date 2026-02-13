import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { Users, Calendar, DollarSign, Ticket, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
        registrationTrends: []
    });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, allRegRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/auth/stats', config),
                    axios.get('http://localhost:5000/api/registrations/all', config)
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
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Dashboard</h1>
                            <p className="text-gray-400 mt-1">Welcome back, Admin</p>
                        </div>
                    </header>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <DashboardCard title="Total Events" value={stats.totalEvents} icon={Calendar} color="blue" />
                        <DashboardCard title="Real Registrations" value={stats.totalRegistrations} icon={Users} color="purple" />
                        <DashboardCard title="Live Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
                        <DashboardCard title="Active Passes" value={stats.totalPasses} icon={Ticket} color="yellow" />
                    </div>

                    {/* Analytics Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Registrations by Department</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={stats.registrationTrends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                        <XAxis dataKey="_id" stroke="#999" />
                                        <YAxis stroke="#999" />
                                        <Tooltip cursor={{ fill: '#333' }} contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                                        <Bar dataKey="value" fill="#8884d8" name="Students">
                                            {stats.registrationTrends?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Can add more charts here if backend provides more data */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div onClick={() => window.location.href = '/admin/content'} className="cursor-pointer">
                            <DashboardCard title="Site Config" value="Content" icon={FileText} color="cyan" />
                        </div>
                    </div>

                    {/* Recent Activity */}
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
                                            <p className="font-medium">{reg.studentName} - {reg.pass?.name || 'Pass'}</p>
                                            <p className="text-xs text-gray-500">{new Date(reg.createdAt).toLocaleString()}</p>
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
                    {/* All Registrations Table */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-xl font-bold">All Registrations</h2>
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await axios.get('http://localhost:5000/api/registrations/export', {
                                            headers: { Authorization: `Bearer ${token}` },
                                            responseType: 'blob',
                                        });
                                        const url = window.URL.createObjectURL(new Blob([response.data]));
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.setAttribute('download', 'all_registrations.csv');
                                        document.body.appendChild(link);
                                        link.click();
                                    } catch (err) {
                                        console.error("Export failed", err);
                                        alert("Failed to download CSV");
                                    }
                                }}
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-bold"
                            >
                                <FileText size={16} /> Download CSV
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-gray-400 text-sm border-b border-white/10">
                                        <th className="p-3">Ticket ID</th>
                                        <th className="p-3">Student</th>
                                        <th className="p-3">Pass</th>
                                        <th className="p-3">Dept/Year</th>
                                        <th className="p-3">Contact</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {loading ? (
                                        <tr><td colSpan="7" className="p-4 text-center">Loading...</td></tr>
                                    ) : stats.allRegistrations?.length === 0 ? (
                                        <tr><td colSpan="7" className="p-4 text-center text-gray-500">No registrations found</td></tr>
                                    ) : (
                                        stats.allRegistrations?.slice(0, 50).map((reg) => (
                                            <tr key={reg._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-3 font-mono text-xs text-gray-400">{reg.ticketId || reg._id.slice(-6)}</td>
                                                <td className="p-3">
                                                    <div className="font-medium">{reg.studentName}</div>
                                                    <div className="text-xs text-gray-500">{reg.rollNumber}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="text-blue-400">{reg.pass?.name}</div>
                                                    <div className="text-[10px] text-gray-500">ID: {reg.pass?._id.slice(-6)}</div>
                                                </td>
                                                <td className="p-3 text-gray-300">{reg.department} - {reg.year}</td>
                                                <td className="p-3">
                                                    <div>{reg.email}</div>
                                                    <div className="text-xs text-gray-500">{reg.phone}</div>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${reg.paymentStatus === 'Completed' ? 'bg-green-500/20 text-green-400' :
                                                        reg.paymentStatus === 'Failed' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {reg.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="p-3 font-medium">₹{reg.amount}</td>
                                            </tr>
                                        ))
                                    )}
                                    {stats.allRegistrations?.length > 50 && (
                                        <tr>
                                            <td colSpan="7" className="p-3 text-center text-gray-500 text-xs">
                                                Showing recent 50 of {stats.allRegistrations.length}. Download CSV for full list.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
