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

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Event Info */}
                    <div className="space-y-6">
                        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10 group">
                            <img
                                src={getImageUrl(event.image) || 'https://via.placeholder.com/800x400'}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-6 left-6">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3 inline-block">
                                    {event.category}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <h3 className="text-xl font-bold border-b border-white/10 pb-3">Event Details</h3>
                            <p className="text-gray-300 leading-relaxed">{event.description}</p>

                            {event.rules && (
                                <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mt-4">
                                    <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                                        <BookOpen size={16} /> Rules & Regulations
                                    </h4>
                                    <div className="text-gray-300 text-sm whitespace-pre-wrap pl-4">
                                        {Array.isArray(event.rules) ? (
                                            <ul className="list-disc space-y-1">
                                                {event.rules.map((rule, idx) => (
                                                    <li key={idx}>{rule}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{event.rules}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {event.rounds && event.rounds.length > 0 && (
                                <div className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl mt-4">
                                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                                        <Calendar size={16} /> Rounds & Structure
                                    </h4>
                                    <div className="space-y-3">
                                        {Array.isArray(event.rounds) ? event.rounds.map((round, index) => (
                                            <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                <h5 className="font-bold text-white text-sm mb-1">{round.name}</h5>
                                                <p className="text-gray-400 text-xs whitespace-pre-wrap">{round.description}</p>
                                            </div>
                                        )) : (
                                            <p className="text-gray-300 text-sm whitespace-pre-wrap">{event.rounds}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Calendar className="text-blue-400" size={20} />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="text-green-400" size={20} />
                                    <span>{event.venue}</span>
                                </div>
                                {((event.fromTime && event.toTime) || event.timings) && (
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Clock className="text-purple-400" size={20} />
                                        <span>{(event.fromTime && event.toTime) ? `${event.fromTime} - ${event.toTime}` : event.timings}</span>
                                    </div>
                                )}
                                {event.winnerPrize ? (
                                    <div className="flex items-center gap-3 text-gray-300 col-span-2 sm:col-span-1">
                                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                                            <IndianRupee size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Winner Prize</p>
                                            <span className="font-bold text-yellow-400">{event.winnerPrize}</span>
                                        </div>
                                    </div>
                                ) : null}
                                {event.runnerPrize ? (
                                    <div className="flex items-center gap-3 text-gray-300 col-span-2 sm:col-span-1">
                                        <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400 shrink-0">
                                            <IndianRupee size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase font-bold">Runner Prize</p>
                                            <span className="font-bold text-gray-300">{event.runnerPrize}</span>
                                        </div>
                                    </div>
                                ) : (
                                    !event.winnerPrize && event.prize && (
                                        <div className="flex items-center gap-3 text-gray-300 col-span-2 sm:col-span-1">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                                                <IndianRupee size={16} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase font-bold">Prize Pool</p>
                                                <span className="font-bold text-yellow-400">{event.prize}</span>
                                            </div>
                                        </div>
                                    )
                                )}
                                {event.department && (
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <BookOpen className="text-yellow-400" size={20} />
                                        <span>{event.department}</span>
                                    </div>
                                )}
                                {event.pptTemplateUrl && (
                                    <div className="flex items-center gap-3 text-gray-300 col-span-2">
                                        <ExternalLink className="text-blue-400" size={20} />
                                        <a href={event.pptTemplateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                            Download PPT Template
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Coordinators Section */}
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                {(event.facultyCoordinators?.length > 0) && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Faculty Coordinators</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {event.facultyCoordinators.map((coordinator, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <User size={18} className="text-purple-400" />
                                                        <span className="font-medium text-gray-200">{coordinator.name}</span>
                                                    </div>
                                                    <a href={`tel:${coordinator.phone}`} className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                                                        <Phone size={14} />
                                                        <span>Call</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(event.studentCoordinators?.length > 0) && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-blue-400 mb-2 mt-4">Student Coordinators</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {event.studentCoordinators.map((coordinator, index) => (
                                                <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <User size={18} className="text-blue-400" />
                                                        <span className="font-medium text-gray-200">{coordinator.name}</span>
                                                    </div>
                                                    <a href={`tel:${coordinator.phone}`} className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                                                        <Phone size={14} />
                                                        <span>Call</span>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Registration Info */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-fit">
                        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Registration
                        </h2>
                        <p className="text-gray-300 mb-6">
                            To register for this event, please purchase a Pass first.
                        </p>
                        <button
                            onClick={() => navigate('/passes')}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20"
                        >
                            Get a Pass
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterEvent;
