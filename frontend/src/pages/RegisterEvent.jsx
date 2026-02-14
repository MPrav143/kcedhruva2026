import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Calendar, MapPin, User, Phone, BookOpen, Clock, ExternalLink, IndianRupee } from 'lucide-react';
import { API_URL } from '../utils/config';

const RegisterEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events/${eventId}`);
                setEvent(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                // navigate('/events'); // Redirect if invalid
            }
        };
        if (eventId) fetchEvent();
    }, [eventId, navigate]);

    if (loading) return <Loader text="Loading event details..." />;
    if (!event) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">Event not found</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 md:py-20 font-sans">
                {/* Top Section: Hero Image & Registration */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Left: Event Image (4:3) with Stylish Overlay */}
                    <div className="lg:col-span-2 relative aspect-[4/3] rounded-3xl overflow-hidden group shadow-2xl border border-white/10">
                        <img
                            src={getImageUrl(event.image) || 'https://via.placeholder.com/800x400'}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/90 to-transparent">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4 inline-block shadow-lg">
                                {event.category}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight leading-tight drop-shadow-lg">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    {/* Right: Glassmorphism Registration Box */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center h-full relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        <h2 className="text-3xl font-bold mb-6 text-white relative z-10">
                            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Spot</span>
                        </h2>
                        <p className="text-gray-300 mb-8 leading-relaxed relative z-10 text-lg">
                            Join us for an unforgettable experience. Participate, compete, and win big. Get your pass now!
                        </p>
                        <button
                            onClick={() => navigate('/passes')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-1 relative z-10 text-lg"
                        >
                            Get Entry Pass
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-8">

                    {/* Row 1: Description & Rules */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Description */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors shadow-lg">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shadow-inner">
                                    <BookOpen size={24} />
                                </div>
                                About Event
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {/* Rules */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors shadow-lg">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-red-500/20 rounded-lg text-red-400 shadow-inner">
                                    <BookOpen size={24} />
                                </div>
                                Rules & Regulations
                            </h3>
                            <div className="text-gray-300 text-base leading-relaxed pl-4">
                                {event.rules ? (
                                    Array.isArray(event.rules) ? (
                                        <ul className="list-disc space-y-3 marker:text-red-400">
                                            {event.rules.map((rule, idx) => (
                                                <li key={idx}>{rule}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{event.rules}</p>
                                    )
                                ) : (
                                    <p className="italic text-gray-500">No specific rules mentioned.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Rounds & Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Rounds */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full hover:bg-white/[0.07] transition-colors shadow-lg">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 shadow-inner">
                                    <Calendar size={24} />
                                </div>
                                Rounds Structure
                            </h3>
                            <div className="space-y-4">
                                {event.rounds && event.rounds.length > 0 ? (
                                    Array.isArray(event.rounds) ? event.rounds.map((round, index) => (
                                        <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <h5 className="font-bold text-white text-lg mb-2">{round.name}</h5>
                                            <p className="text-gray-400 text-base">{round.description}</p>
                                        </div>
                                    )) : <p className="text-gray-300 whitespace-pre-wrap">{event.rounds}</p>
                                ) : (
                                    <p className="text-gray-500 italic">No specific rounds details.</p>
                                )}
                            </div>
                        </div>

                        {/* Details Grid (Nested) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                            {/* Venue */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-green-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <MapPin size={16} /> Venue
                                </span>
                                <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{event.venue}</span>
                            </div>

                            {/* Date */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Calendar size={16} /> Date
                                </span>
                                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{new Date(event.date).toLocaleDateString()}</span>
                            </div>

                            {/* Time */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock size={16} /> Time
                                </span>
                                <span className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                    {(event.fromTime && event.toTime) ? `${event.fromTime} - ${event.toTime}` : (event.timings || 'TBA')}
                                </span>
                            </div>

                            {/* Dept */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BookOpen size={16} /> Dept
                                </span>
                                <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{event.department || 'General'}</span>
                            </div>

                            {/* Winner Prize */}
                            <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                                <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 z-10">
                                    <IndianRupee size={16} /> Winner Prize
                                </span>
                                <span className="text-2xl font-extrabold text-white z-10 group-hover:scale-105 transition-transform">{event.winnerPrize || 'TBA'}</span>
                            </div>

                            {/* Runner Prize */}
                            <div className="bg-gradient-to-br from-gray-500/10 to-transparent border border-gray-500/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gray-500/10 rounded-full blur-xl -mr-10 -mt-10" />
                                <span className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 z-10">
                                    <IndianRupee size={16} /> Runner Prize
                                </span>
                                <span className="text-2xl font-extrabold text-white z-10 group-hover:scale-105 transition-transform">{event.runnerPrize || 'TBA'}</span>
                            </div>

                            {event.pptTemplateUrl && (
                                <div className="col-span-1 sm:col-span-2">
                                    <a href={event.pptTemplateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all font-semibold">
                                        <ExternalLink size={18} /> Download PPT Template
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Faculty Coordinators */}
                    {(event.facultyCoordinators?.length > 0) && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-lg">
                            <h4 className="text-xl font-bold text-purple-400 mb-8 inline-block border-b-2 border-purple-500/30 pb-2">Faculty Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.facultyCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-white/5 px-8 py-6 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold w-[250px] text-white text-lg">{coordinator.name}</span>
                                            {coordinator.phone && (
                                                <a href={`tel:${coordinator.phone}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                                                    <Phone size={14} />
                                                    <span>{coordinator.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Row 4: Student Coordinators */}
                    {(event.studentCoordinators?.length > 0) && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center shadow-lg">
                            <h4 className="text-xl font-bold text-blue-400 mb-8 inline-block border-b-2 border-blue-500/30 pb-2">Student Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.studentCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-white/5 px-8 py-6 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold w-[250px] text-white text-lg">{coordinator.name}</span>
                                            {coordinator.phone && (
                                                <a href={`tel:${coordinator.phone}`} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
                                                    <Phone size={14} />
                                                    <span>{coordinator.phone}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterEvent;
