import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart as LucideBarChart, Users, DollarSign, Calendar, Filter, ChevronDown, CheckCircle } from 'lucide-react';
import Loader from '../components/Loader';
import Sidebar from '../components/Sidebar';
import EventDetailsModal from '../components/EventDetailsModal';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { API_URL } from '../utils/config';

const DEPT_FULL_NAMES = {
    'CSE': 'Department of Computer Science and Engineering',
    'ECE': 'Department of Electronics and Communication Engineering',
    'EEE': 'Department of Electrical and Electronics Engineering',
    'MECH': 'Department of Mechanical Engineering',
    'CIVIL': 'Department of Civil Engineering',
    'IT': 'Department of Information Technology',
    'AIDS': 'Department of Artificial Intelligence and Data Science',
    'CSD': 'Department of Computer Science and Design',
    'ETE': 'Department of Electronics and Telecommunication Engineering',
    'CST': 'Department of Computer Science and Technology',
    'CSECS': 'Department of CSE (Cyber Security)',
    'MCA': 'Department of Master of Computer Applications',
    'MBA': 'Department of Master of Business Administration',
    'S&H': 'Department of Science and Humanities'
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#F24E1E'];

const PrincipalDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterSub, setFilterSub] = useState('All');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        setUserRole(user.role || 'principal');
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/auth/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    // Derived state for filtered events (if we had full event list in stats, otherwise this is illustrative)
    // Assuming stats.departmentStats contains aggregate data, but for "List of events" we might need a separate endpoint or expansion.
    // However, let's use what we have or placeholder for the "List" request.
    // The user asked to "show events list to all with filters".
    // Currently `stats` has `departmentStats` (counts) but not full list. 
    // Let's assume we need to fetch all events to show the list.
    // For now, I'll add the UI structure for filters and the list placeholder/logic assuming data exists or will be fetched.

    const [allEvents, setAllEvents] = useState([]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const { data } = await axios.get(`${API_URL}/events`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllEvents(data);
            } catch (error) {
                console.error("Error fetching events", error);
            }
        }
        fetchEvents();
    }, []);

    const filteredEvents = allEvents.filter(event => {
        if (filterCategory !== 'All' && event.category !== filterCategory) return false;
        if (filterSub !== 'All') {
            if (event.category === 'Technical' && event.department !== filterSub) return false;
            if (event.category === 'Cultural' && event.club !== filterSub) return false;
        }
        return true;
    });

    const getSubOptions = () => {
        if (filterCategory === 'Technical') return Object.keys(DEPT_FULL_NAMES);
        if (filterCategory === 'Cultural') return ['On Stage', 'Off Stage', 'Dance Club', 'Music Club', 'Tamil Mandram']; // Example clubs
        return [];
    };

    const [selectedEvent, setSelectedEvent] = useState(null);

    if (loading) {
        return <Loader text="Loading Analytics..." />;
    }

    return (
        <div className="flex min-h-screen bg-[#050505] text-white font-inter">
            <Sidebar />

            <div className="flex-1 ml-0 lg:ml-64 p-8">
                {/* Header with Unique Style */}
                <div className="mb-12 relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                        Institutional Overview
                    </h1>
                    <p className="text-yellow-100/60 text-lg">
                        {userRole === 'dean' ? "Dean's Dashboard" : "Principal's Dashboard"}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="p-4 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wider">Total Events</p>
                            <h3 className="text-4xl font-bold">{stats?.totalEvents}</h3>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="p-4 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wider">Registrations</p>
                            <h3 className="text-4xl font-bold">{stats?.totalRegistrations}</h3>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center space-x-4 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="p-4 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
                            <DollarSign className="w-8 h-8 text-green-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-wider">Revenue</p>
                            <h3 className="text-4xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-8 text-gray-200">Event Distribution</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={stats?.eventsPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="_id"
                                        paddingAngle={5}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {stats?.eventsPieData?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-8 text-gray-200">Department Participation</h2>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <BarChart data={stats?.registrationPieData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                    <XAxis dataKey="_id" stroke="#666" tick={{ fill: '#888' }} />
                                    <YAxis stroke="#666" tick={{ fill: '#888' }} />
                                    <Tooltip cursor={{ fill: '#333' }} contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }} />
                                    <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]}>
                                        {stats?.registrationPieData?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Global Event List with Filters */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h2 className="text-2xl font-bold flex items-center">
                            <Filter className="w-6 h-6 mr-3 text-yellow-400" />
                            Event Management
                        </h2>

                        <div className="flex gap-4">
                            <div className="relative">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => { setFilterCategory(e.target.value); setFilterSub('All'); }}
                                    className="bg-black/40 border border-white/20 text-white px-4 py-2 rounded-xl appearance-none pr-10 focus:outline-none focus:border-yellow-500/50"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="Technical">Technical</option>
                                    <option value="Cultural">Cultural</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Workshop">Workshop</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {filterCategory !== 'All' && getSubOptions().length > 0 && (
                                <div className="relative">
                                    <select
                                        value={filterSub}
                                        onChange={(e) => setFilterSub(e.target.value)}
                                        className="bg-black/40 border border-white/20 text-white px-4 py-2 rounded-xl appearance-none pr-10 focus:outline-none focus:border-yellow-500/50"
                                    >
                                        <option value="All">All {filterCategory === 'Technical' ? 'Departments' : 'Clubs'}</option>
                                        {getSubOptions().map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="py-4 px-4">Event Name</th>
                                    <th className="py-4 px-4">Category</th>
                                    <th className="py-4 px-4">Organizer</th>
                                    <th className="py-4 px-4">Coordinators</th>
                                    <th className="py-4 px-4">Date</th>
                                    <th className="py-4 px-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEvents.map((event, index) => (
                                    <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-4 font-medium text-white">{event.title}</td>
                                        <td className="py-4 px-4">
                                            <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 border border-white/5">
                                                {event.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-400">
                                            {event.department && DEPT_FULL_NAMES[event.department]
                                                ? DEPT_FULL_NAMES[event.department].replace('Department of ', '')
                                                : (event.department || event.club || 'General')}
                                        </td>
                                        <td className="py-4 px-4 text-xs text-gray-400">
                                            <div className="flex flex-col gap-1">
                                                {event.facultyCoordinators && event.facultyCoordinators.length > 0 && (
                                                    <div>
                                                        <span className="text-blue-400 font-bold">Faculty:</span> {event.facultyCoordinators[0].name} ({event.facultyCoordinators[0].phone})
                                                    </div>
                                                )}
                                                {event.studentCoordinators && event.studentCoordinators.length > 0 && (
                                                    <div>
                                                        <span className="text-green-400 font-bold">Student:</span> {event.studentCoordinators[0].name} ({event.studentCoordinators[0].phone})
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-400">
                                            {new Date(event.date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => setSelectedEvent(event)}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            No events found matching filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Event Details Modal */}
            <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} isAdminView={true} />
        </div>
    );
};

export default PrincipalDashboard;
