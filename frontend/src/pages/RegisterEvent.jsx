import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Calendar, MapPin, User, Phone, BookOpen, Clock, ExternalLink, IndianRupee, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/config';
import Doodles from '../components/Doodles';

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

                // If accessed via ID but has a slug, redirect to slug-based URL
                if (eventId.match(/^[0-9a-fA-F]{24}$/) && data.slug) {
                    navigate(`/register/${data.slug}`, { replace: true });
                }

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

    // Validation Helpers
    const isNotEmpty = (str) => {
        if (str === null || str === undefined) return false;
        if (typeof str !== 'string') return true;
        const s = str.trim();
        return s !== '' && s.toLowerCase() !== 'undefined' && s.toLowerCase() !== 'null';
    };

    const hasRounds = event.rounds && Array.isArray(event.rounds) && event.rounds.some(r => isNotEmpty(r.name) || isNotEmpty(r.description));
    const hasRules = event.rules && (
        Array.isArray(event.rules)
            ? event.rules.some(r => isNotEmpty(r))
            : isNotEmpty(event.rules)
    );

    const isValidPrize = (p) => isNotEmpty(p);
    const hasGeneralPrize = event.generalPrize && Array.isArray(event.generalPrize) && event.generalPrize.some(p => isNotEmpty(p));

    return (
        <div className="min-h-screen bg-violet-950 text-white font-inter flex flex-col relative overflow-x-hidden">
            <Doodles />
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-24 pb-10 md:pt-32 md:pb-20 font-sans">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 hover:border-white/20 group backdrop-blur-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>
                {/* Top Section: Hero Image & Registration */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* Left: Event Image (1:1) with Stylish Overlay */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`relative ${['Sports', 'Cultural'].includes(event.category) ? 'aspect-[4/5]' : 'aspect-square'} rounded-3xl overflow-hidden group shadow-2xl border border-white/10`}
                    >
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
                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight leading-tight drop-shadow-lg">
                                {event.title}
                            </h1>
                            {/* {event.theme && (Array.isArray(event.theme) ? event.theme.filter(t => isNotEmpty(t)).length > 0 : isNotEmpty(event.theme)) && (
                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest rounded-md border border-blue-500/30">
                                        Themes / Topics
                                    </span>
                                    {Array.isArray(event.theme) ? (
                                        <div className="flex flex-wrap gap-2">
                                            {event.theme.filter(t => isNotEmpty(t)).map((topic, i) => (
                                                <span key={i} className="text-white font-medium bg-white/10 px-3 py-1 rounded-lg border border-white/5">{topic}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-white font-medium">{event.theme}</span>
                                    )}
                                </div>
                            )} */}
                        </div>
                    </motion.div>

                    {/* Right: Glassmorphism Registration Box */}
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group hover:border-white/20 transition-colors h-fit self-center"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                        <h2 className="text-3xl font-bold mb-4 text-white relative z-10">
                            Secure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Spot</span>
                        </h2>
                        <p className="text-gray-300 mb-6 leading-relaxed relative z-10 text-lg">
                            Join us for an unforgettable experience. Participate, compete, and win big. Get your pass now!
                        </p>
                        <button
                            onClick={() => navigate('/passes')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 transform hover:-translate-y-1 relative z-10 text-lg"
                        >
                            Get Entry Pass
                        </button>
                    </motion.div>
                </div>

                {/* Main Content Grid */}
                <div className="space-y-8">

                    {/* Row 1: Description & Rules */}
                    <div className={`grid grid-cols-1 ${hasRules ? 'lg:grid-cols-2' : ''} bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.07] transition-colors shadow-lg gap-8`}>
                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shadow-inner">
                                    <BookOpen size={24} />
                                </div>
                                About Event
                            </h3>
                            <p className="text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </motion.div>

                        {/* Rules */}
                        {hasRules && (
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 hover:bg-white/[0.07] transition-colors shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded-lg text-red-400 shadow-inner">
                                        <BookOpen size={24} />
                                    </div>
                                    Rules & Regulations
                                </h3>
                                <div className="text-gray-300 text-base leading-relaxed pl-4">
                                    {Array.isArray(event.rules) ? (
                                        <ul className="list-disc space-y-3 marker:text-red-400">
                                            {event.rules.filter(r => isNotEmpty(r)).map((rule, idx) => (
                                                <li key={idx}>{rule}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{event.rules}</p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Row 2: Rounds & Details Grid */}
                    <div className={`grid grid-cols-1 ${hasRounds ? 'lg:grid-cols-2' : ''} gap-8`}>
                        {/* Rounds */}
                        {hasRounds && (
                            <motion.div
                                initial={{ opacity: 0, y: -30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 h-full hover:bg-white/[0.07] transition-colors shadow-lg"
                            >
                                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 shadow-inner">
                                        <Calendar size={24} />
                                    </div>
                                    Rounds Structure
                                </h3>
                                <div className="space-y-4">
                                    {Array.isArray(event.rounds) ? event.rounds.filter(r => isNotEmpty(r.name) || isNotEmpty(r.description)).map((round, index) => (
                                        <div key={index} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                            <h5 className="font-bold text-white text-lg mb-2">{round.name}</h5>
                                            <p className="text-gray-400 text-base">{round.description}</p>
                                        </div>
                                    )) : <p className="text-gray-300 whitespace-pre-wrap">{event.rounds}</p>}
                                </div>
                            </motion.div>
                        )}

                        {/* Details Grid (Nested) */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full"
                        >
                            {/* Venue */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-green-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <MapPin size={24} /> Venue
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-green-400 transition-colors">{event.venue}</span>
                            </div>

                            {/* Date */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-blue-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Calendar size={24} /> Date
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{new Date(event.date).toLocaleDateString()}</span>
                            </div>

                            {/* Time */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-purple-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Clock size={24} /> Time
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                                    {event.fromTime ? (event.toTime ? `${event.fromTime} - ${event.toTime}` : event.fromTime) : (event.timings || 'TBA')}
                                </span>
                            </div>

                            {/* Dept */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col justify-center hover:bg-white/[0.07] transition-all group">
                                <span className="text-yellow-400 text-lg md:text-xl font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <BookOpen size={24} /> Department
                                </span>
                                <span className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{event.department || 'General'}</span>
                            </div>

                            {event.pptTemplateUrl && (
                                <div className="col-span-1 sm:col-span-2">
                                    <a href={event.pptTemplateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all font-semibold">
                                        <ExternalLink size={18} /> Download PPT Template
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Registration Details (Sports) */}
                    {event.category === 'Sports' && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Registration Fee */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <IndianRupee className="text-orange-400 shadow-inner" size={20} strokeWidth={2.5} />
                                    <p className="text-orange-400 text-xl inter-bold-text uppercase tracking-widest">
                                        Registration Fee
                                    </p>
                                </div>
                                <p className="text-2xl font-black text-white inter-bold-text hover:text-orange-400 transition-colors">
                                    ₹{event.teamPrice}/ Team
                                </p>
                            </div>

                            {/* Gender Category */}
                            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <Users className="text-red-400 shadow-inner" size={20} strokeWidth={2.5} />
                                    <p className="text-xl text-red-400 inter-bold-text uppercase tracking-widest">
                                        Gender Category
                                    </p>
                                </div>
                                <p className="text-2xl font-black text-white">
                                    {event.gender || 'Open'}
                                </p>
                            </div>
                        </motion.div>
                    )}



                    {/* Resource Person Section (Workshop specific) */}
                    {(event.resourcePerson || event.resourcePersonPosition || event.resourcePersonCompany) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-green-500/10 via-white/5 to-blue-500/10 border border-green-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                        >
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg text-green-400 shadow-inner">
                                    <User size={24} />
                                </div>
                                Resource Person
                            </h3>

                            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
                                <div className="text-center md:text-left flex-1">
                                    <h4 className="text-2xl md:text-3xl font-black text-white mb-2">{event.resourcePerson}</h4>
                                    <p className="text-lg md:text-xl text-green-400 font-bold mb-1">{event.resourcePersonPosition}</p>
                                    <p className="text-base md:text-lg text-gray-400">{event.resourcePersonCompany}</p>
                                </div>
                                <div className="hidden md:block w-px h-24 bg-white/10" />
                                <div className="flex-1 text-gray-300 italic text-lg text-center md:text-left">
                                    "Learn directly from industry experts and enhance your practical knowledge through hands-on experience."
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Prize Section (Prominent) */}
                    {(isValidPrize(event.prize) || isValidPrize(event.winnerPrize) || isValidPrize(event.runnerPrize) || hasGeneralPrize) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-yellow-500/10 via-white/5 to-purple-500/10 border border-yellow-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 shadow-inner">
                                    <IndianRupee size={24} />
                                </div>
                                Prizes & Rewards
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {isValidPrize(event.winnerPrize) && (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                                        <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-2">Winner</p>
                                        <p className="text-2xl md:text-3xl font-black text-white">{event.winnerPrize}</p>
                                    </div>
                                )}
                                {isValidPrize(event.runnerPrize) && (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
                                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Runner</p>
                                        <p className="text-2xl md:text-3xl font-black text-white">{event.runnerPrize}</p>
                                    </div>
                                )}
                                {isValidPrize(event.prize) && (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center lg:col-span-1">
                                        <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-2">Prize Pool / Info</p>
                                        <p className="text-xl font-bold text-white">{event.prize}</p>
                                    </div>
                                )}
                                {hasGeneralPrize && (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 md:col-span-2 lg:col-span-3">
                                        <p className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-4">Other General Prizes</p>
                                        <div className="flex flex-wrap gap-3">
                                            {event.generalPrize.filter(p => isNotEmpty(p)).map((p, i) => (
                                                <span key={i} className="px-4 py-2 bg-white/5 text-white rounded-xl border border-white/10 font-bold text-lg shadow-sm">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Theme / Topics */}
                    {event.theme && (Array.isArray(event.theme) ? event.theme.filter(t => isNotEmpty(t)).length > 0 : isNotEmpty(event.theme)) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-3xl p-6 md:p-8"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shadow-inner">
                                    <BookOpen size={24} />
                                </div>
                                Themes / Topics
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {Array.isArray(event.theme) ? (
                                    event.theme.filter(t => isNotEmpty(t)).map((topic, i) => (
                                        <span key={i} className="px-5 py-2.5 bg-blue-500/10 text-white rounded-2xl border border-blue-500/20 text-lg font-bold shadow-lg shadow-blue-500/5">
                                            {topic}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xl font-bold text-white">{event.theme}</span>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Row 3: Faculty Coordinators */}
                    {(event.facultyCoordinators?.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-lg"
                        >
                            <h4 className="text-xl font-bold text-purple-400 mb-8 inline-block border-b-2 border-purple-500/30 pb-2">Faculty Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.facultyCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-white/5 px-4 md:px-8 py-6 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 group min-w-0 w-full sm:w-auto sm:min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg break-words max-w-full">{coordinator.name}</span>
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
                        </motion.div>
                    )}

                    {/* Row 4: Student Coordinators */}
                    {(event.studentCoordinators?.length > 0) && (
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 text-center shadow-lg"
                        >
                            <h4 className="text-xl font-bold text-blue-400 mb-8 inline-block border-b-2 border-blue-500/30 pb-2">Student Coordinators</h4>
                            <div className="flex flex-wrap justify-center gap-6">
                                {event.studentCoordinators.map((coordinator, index) => (
                                    <div key={index} className="bg-white/5 px-4 md:px-8 py-6 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group min-w-0 w-full sm:w-auto sm:min-w-[200px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                                                <User size={20} />
                                            </div>
                                            <span className="font-bold text-white text-lg break-words max-w-full">{coordinator.name}</span>
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
                        </motion.div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterEvent;
