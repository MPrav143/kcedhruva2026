import React from 'react';
import axios from 'axios';
import { X, Calendar, MapPin, User, Mail, Phone, Info, Clock, Tag, Building2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDetailsModal = ({ event, onClose, showRegister = false, isAdminView = false }) => {
    const [participants, setParticipants] = React.useState([]);
    const [loadingParticipants, setLoadingParticipants] = React.useState(false);
    const [userRole, setUserRole] = React.useState('');

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
        setUserRole(user.role);

        if (event && isAdminView && (user.role === 'admin' || user.role === 'hod' || user.role === 'principal' || user.role === 'dean')) {
            fetchParticipants();
        }
    }, [event, isAdminView]);

    const fetchParticipants = async () => {
        setLoadingParticipants(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`http://localhost:5000/api/registrations/events/${event._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setParticipants(data);
        } catch (error) {
            console.error("Failed to fetch participants", error);
        } finally {
            setLoadingParticipants(false);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`http://localhost:5000/api/registrations/events/${event._id}/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${event.title}_participants.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download CSV", error);
            alert("Failed to download CSV");
        }
    };

    if (!event) return null;

    const isWorkshop = event.category === 'Workshop' || event.eventType === 'Workshop';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1a1c2e] border border-blue-500/20 w-full max-w-xl max-h-[50vh] overflow-y-auto rounded-2xl shadow-2xl relative custom-scrollbar flex flex-col md:flex-row"
                >
                    {/* Left Side: Image & Tags */}
                    <div className="md:w-2/5 h-64 md:h-auto relative shrink-0">
                        <img
                            src={event.image ? (event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`) : 'https://via.placeholder.com/800x600?text=Event+Poster'}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Event+Poster'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c2e] via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider
                                ${event.category === 'Technical' ? 'bg-blue-600 text-white' :
                                    event.category === 'Cultural' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                                {event.category}
                            </span>
                            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                                {event.title}
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm flex items-center gap-2">
                                <Building2 size={16} />
                                {event.department || event.club || 'General Event'}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                {isAdminView && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-green-900/20"
                                    >
                                        <Tag size={14} /> Download CSV
                                    </button>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Date</p>
                                        <p className="font-medium text-sm">{event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Time</p>
                                        <p className="font-medium text-sm">{event.timings || event.time || 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Venue</p>
                                        <p className="font-medium text-sm">{event.venue || 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                        <Tag size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Prize Details</p>
                                        <div className="space-y-0.5">
                                            {event.winnerPrize ? (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">Winner:</span>
                                                    <span className="font-bold text-yellow-400">{event.winnerPrize}</span>
                                                </div>
                                            ) : null}
                                            {event.runnerPrize ? (
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-gray-400">Runner:</span>
                                                    <span className="font-semibold text-gray-300">{event.runnerPrize}</span>
                                                </div>
                                            ) : null}
                                            {!event.winnerPrize && !event.runnerPrize && (
                                                <p className="font-medium text-sm text-yellow-400">{event.prize || 'Exciting Prizes!'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Sections */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-400">
                                        <Info size={18} />
                                        About the {isWorkshop ? 'Workshop' : 'Event'}
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                                        {event.description || 'Join us for an unforgettable experience! Details for this event are coming soon.'}
                                    </p>
                                </div>

                                {event.rounds && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-400">
                                            <Calendar size={18} />
                                            Rounds Details
                                        </h3>
                                        <div className="text-gray-300 leading-relaxed text-sm bg-purple-500/5 p-4 rounded-xl border border-purple-500/10 whitespace-pre-wrap font-mono theme-rounds">
                                            {event.rounds}
                                        </div>
                                    </div>
                                )}

                                {event.rules && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-400">
                                            <Tag size={18} />
                                            Guidelines & Rules
                                        </h3>
                                        <div className="text-gray-300 leading-relaxed text-sm bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 whitespace-pre-wrap">
                                            {event.rules}
                                        </div>
                                    </div>
                                )}

                                {event.pptTemplateUrl && (
                                    <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ExternalLink className="text-blue-400" size={20} />
                                            <div>
                                                <p className="text-sm font-bold text-white">Presentation Template</p>
                                                <p className="text-xs text-gray-400">Required for technical rounds</p>
                                            </div>
                                        </div>
                                        <a
                                            href={event.pptTemplateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all"
                                        >
                                            Download
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Coordinators */}
                            <div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-indigo-400">
                                    <User size={20} />
                                    Coordinators
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(event.facultyCoordinators || []).concat(event.studentCoordinators || []).map((c, idx) => (
                                        <div key={idx} className="bg-white/5 p-3 rounded-xl flex items-center gap-3 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                                                {c.name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{c.name}</p>
                                                <a href={`tel:${c.phone}`} className="text-xs text-gray-500 hover:text-blue-400 flex items-center gap-1 mt-0.5">
                                                    <Phone size={10} /> {c.phone}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Participant List (Protected) */}
                            {isAdminView && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                <div className="border-t border-white/10 pt-8">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                                        <User size={20} />
                                        Registered Participants ({participants.length})
                                    </h3>

                                    {loadingParticipants ? (
                                        <p className="text-gray-400 text-sm italic">Loading participants...</p>
                                    ) : participants.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No registrations yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto bg-black/20 rounded-xl border border-white/5">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-white/5 text-gray-400 uppercase">
                                                    <tr>
                                                        <th className="px-4 py-2">Name</th>
                                                        <th className="px-4 py-2">Dept/Year</th>
                                                        <th className="px-4 py-2">Roll No</th>
                                                        <th className="px-4 py-2">Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {participants.map((p, i) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors text-gray-300">
                                                            <td className="px-4 py-2 font-medium text-white">{p.studentName}</td>
                                                            <td className="px-4 py-2">{p.department} - {p.year}</td>
                                                            <td className="px-4 py-2">{p.rollNumber}</td>
                                                            <td className="px-4 py-2">{p.phone}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Register Button */}
                            {showRegister && (
                                <button
                                    onClick={() => window.location.assign(`/register/${event._id}`)}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/40 transform hover:scale-[1.02] active:scale-100"
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EventDetailsModal;
