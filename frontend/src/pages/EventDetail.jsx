import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { X, Calendar, MapPin, User, Mail, Phone, Info, Clock, Tag, Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { API_URL, BASE_URL } from '../utils/config';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [loadingParticipants, setLoadingParticipants] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events/${id}`);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch event details", error);
                setLoading(false);
            }
        };

        // We could check user role, but for the "participants page" (Home/Public), 
        // we strictly hide this data as requested.
        setUserRole('');

        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (event && (userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean')) {
            fetchParticipants();
        }
    }, [event, userRole]);

    const fetchParticipants = async () => {
        setLoadingParticipants(true);
        try {
            const token = localStorage.getItem('adminToken');
            const { data } = await axios.get(`${API_URL}/registrations/events/${id}`, {
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
            const response = await axios.get(`${API_URL}/registrations/events/${id}/export`, {
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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><Loader text="Loading event details..." /></div>;
    if (!event) return <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h2 className="text-2xl font-bold mb-4">Event not found</h2>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 rounded-lg">Go back</button>
    </div>;

    const isWorkshop = event.category === 'Workshop' || event.eventType === 'Workshop';

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </button>

                <div className="bg-[#1a1c2e] border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
                    {/* Left Side: Image & Tags */}
                    <div className="lg:w-2/5 h-[400px] lg:h-auto relative shrink-0">
                        <img
                            src={event.image ? (event.image.startsWith('http') ? event.image : `${BASE_URL}${event.image}`) : 'https://via.placeholder.com/800x600?text=Event+Poster'}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Event+Poster'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c2e] via-transparent to-transparent" />
                        <div className="absolute bottom-10 left-10 right-10">
                            <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-[0.2em]
                                ${event.category === 'Technical' ? 'bg-blue-600 text-white' :
                                    event.category === 'Cultural' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                                {event.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl mb-4">
                                {event.title}
                            </h1>
                            <p className="text-gray-300 text-lg flex items-center gap-3">
                                <Building2 size={20} className="text-blue-400" />
                                {event.department || event.club || 'General Event'}
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1 p-8 lg:p-12">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex-1">
                                {(userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                    <button
                                        onClick={handleDownloadCSV}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-900/20"
                                    >
                                        <Tag size={16} /> Download CSV Report
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-12">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Date</p>
                                        <p className="font-semibold text-lg">{event.date ? new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Time</p>
                                        <p className="font-semibold text-lg">
                                            {(event.fromTime && event.toTime)
                                                ? `${event.fromTime} - ${event.toTime}`
                                                : (event.timings || event.time || 'TBA')}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Venue</p>
                                        <p className="font-semibold text-lg">{event.venue || 'TBA'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                        <Tag size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Prize Details</p>
                                        <div className="space-y-1">
                                            {event.winnerPrize ? (
                                                <p className="font-bold text-lg text-yellow-400 flex items-center justify-between">
                                                    <span>Winner:</span>
                                                    <span>{event.winnerPrize}</span>
                                                </p>
                                            ) : null}
                                            {event.runnerPrize ? (
                                                <p className="font-semibold text-gray-300 flex items-center justify-between text-sm">
                                                    <span>Runner:</span>
                                                    <span>{event.runnerPrize}</span>
                                                </p>
                                            ) : null}
                                            {!event.winnerPrize && !event.runnerPrize && (
                                                <p className="font-bold text-lg text-yellow-400">{event.prize || 'Exciting Prizes!'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Sections */}
                            <div className="grid grid-cols-1 gap-10">
                                <section>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-blue-400">
                                        <Info size={22} />
                                        About the {isWorkshop ? 'Workshop' : 'Event'}
                                    </h3>
                                    <div className="text-gray-300 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 text-[1.05rem]">
                                        {event.description || 'Join us for an unforgettable experience! Details for this event are coming soon.'}
                                    </div>
                                </section>

                                {event.rounds && (
                                    <section>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-purple-400">
                                            <Calendar size={22} />
                                            Rounds & Structure
                                        </h3>
                                        <div className="text-gray-300 leading-relaxed bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10 whitespace-pre-wrap font-mono text-sm theme-rounds">
                                            {event.rounds}
                                        </div>
                                    </section>
                                )}

                                {event.rules && (
                                    <section>
                                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-orange-400">
                                            <Tag size={22} />
                                            Rules & Guidelines
                                        </h3>
                                        <div className="text-gray-300 leading-relaxed bg-orange-500/5 p-6 rounded-2xl border border-orange-500/10 whitespace-pre-wrap text-[1.05rem]">
                                            {event.rules}
                                        </div>
                                    </section>
                                )}

                                {event.pptTemplateUrl && (
                                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                                                <ExternalLink size={28} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-white mb-1">Presentation Template</h4>
                                                <p className="text-sm text-gray-400 tracking-wide">Mandatory for all technical presentation rounds</p>
                                            </div>
                                        </div>
                                        <a
                                            href={event.pptTemplateUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full md:w-auto px-10 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/40 transform hover:scale-105 active:scale-95 text-center"
                                        >
                                            Download Template
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Coordinators */}
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-indigo-400">
                                    <User size={24} />
                                    Event Coordinators
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {(event.facultyCoordinators || []).concat(event.studentCoordinators || []).map((c, idx) => (
                                        <div key={idx} className="bg-white/5 p-5 rounded-2xl flex items-center gap-4 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all group">
                                            <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                                {c.name?.charAt(0) || 'C'}
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white mb-1">{c.name}</p>
                                                <a href={`tel:${c.phone}`} className="text-sm text-gray-500 hover:text-blue-400 flex items-center gap-2 transition-colors">
                                                    <Phone size={14} /> {c.phone}
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Participant List (Protected) */}
                            {(userRole === 'admin' || userRole === 'hod' || userRole === 'principal' || userRole === 'dean') && (
                                <section className="border-t border-white/10 pt-12">
                                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-400">
                                        <User size={28} />
                                        Participant Manifest ({participants.length})
                                    </h3>

                                    {loadingParticipants ? (
                                        <div className="flex items-center gap-3 text-gray-400 animate-pulse">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Synchronizing participant data...
                                        </div>
                                    ) : participants.length === 0 ? (
                                        <div className="bg-white/5 p-8 rounded-2xl text-center border border-white/5">
                                            <p className="text-gray-500 italic">No registrations have been recorded for this event yet.</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto bg-black/40 rounded-2xl border border-white/10">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white/5 text-gray-400 uppercase text-xs tracking-[0.2em]">
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Dept & Year</th>
                                                        <th className="px-6 py-4">Roll Number</th>
                                                        <th className="px-6 py-4">Contact</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/10">
                                                    {participants.map((p, i) => (
                                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                            <td className="px-6 py-4 font-bold text-white group-hover:text-blue-400 transition-colors">{p.studentName}</td>
                                                            <td className="px-6 py-4 text-gray-400">{p.department} <span className="mx-2 text-white/10">|</span> Year {p.year}</td>
                                                            <td className="px-6 py-4 font-mono text-gray-400 text-sm tracking-widest">{p.rollNumber}</td>
                                                            <td className="px-6 py-4">
                                                                <a href={`tel:${p.phone}`} className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                                                                    <Phone size={14} /> {p.phone}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Register Button */}
                            <div className="pt-10 flex flex-col items-center">
                                <button
                                    onClick={() => window.location.assign(`/register/${event._id}`)}
                                    className="w-full md:w-auto min-w-[300px] py-5 px-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xl font-black rounded-2xl transition-all shadow-2xl shadow-blue-900/50 transform hover:scale-105 active:scale-95 uppercase tracking-widest"
                                >
                                    Register Now
                                </button>
                                <p className="mt-4 text-gray-500 text-sm italic">Limited slots available. Secure your spot today!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;
