import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, MapPin, Clock } from 'lucide-react';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import EventDetailsModal from '../components/EventDetailsModal';
import { API_URL } from '../utils/config';

const HodDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('adminUser'));
        setUser(userData);
        fetchDepartmentData();
    }, []);

    const fetchDepartmentData = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/auth/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching department data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader text="Loading Department Data..." />;
    }

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-inter">
            <Sidebar />

            <div className="flex-1 ml-0 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Department Dashboard
                        </h1>
                        <p className="text-gray-400 mt-2 text-xl">{user?.department} Department</p>
                    </div>
                    <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20">
                        <p className="text-sm text-gray-400">Total Participants</p>
                        <h2 className="text-2xl font-bold text-white">{data?.totalParticipants || 0}</h2>
                    </div>
                </div>

                {/* Charts Section */}
                {data?.yearDistribution?.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold mb-4">Participant Year Distribution</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={data.yearDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            nameKey="_id"
                                            label
                                        >
                                            {data.yearDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        {/* Add more charts if needed, e.g., registrations per event */}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-8">
                    {data?.events?.map((event) => (
                        <div key={event._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-blue-400">{event.title}</h3>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(event.date).toLocaleDateString()}</span>
                                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {event.venue}</span>
                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-xs">{event.category}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors font-medium border border-blue-500/30"
                                >
                                    View Details
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-black/20 rounded-xl p-4">
                                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Coordinators</h4>
                                    <div className="space-y-2">
                                        {event.facultyCoordinators?.map((coord, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-white">{coord.name} (Faculty)</span>
                                                <span className="text-gray-500">{coord.phone}</span>
                                            </div>
                                        ))}
                                        {event.studentCoordinators?.map((coord, idx) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-white">{coord.name} (Student)</span>
                                                <span className="text-gray-500">{coord.phone}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                                    <Users className="w-8 h-8 text-gray-500 mb-2" />
                                    <p className="text-gray-400 text-sm">View full participants list</p>
                                    <p className="text-xs text-gray-600 mt-1">Click 'View Details' to manage.</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {data?.events?.length === 0 && (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-gray-500 text-lg">No events found for {user?.department} department.</p>
                        </div>
                    )}
                </div>
            </div>

            <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} isAdminView={true} />
        </div>
    );
};

export default HodDashboard;
