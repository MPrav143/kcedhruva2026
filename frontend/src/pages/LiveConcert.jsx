import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Calendar, MapPin, Clock } from 'lucide-react';

const LiveConcert = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/events');
                const concertEvents = data.filter(e => e.category === 'Live-In Concert');
                setEvents(concertEvents);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-inter">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1459749411177-d4a428947d6a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 animate-pulse-slow" />

                <div className="relative z-20 text-center px-4">
                    <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-6 drop-shadow-2xl">
                        LIVE IN CONCERT
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 tracking-widest uppercase">
                        Experience the Magic of Music
                    </p>
                </div>
            </div>

            {/* Events Section */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                {loading ? (
                    <Loader text="Loading concert details..." />
                ) : events.length > 0 ? (
                    <div className="grid grid-cols-1 gap-20">
                        {events.map((event, index) => (
                            <div key={event._id} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center`}>
                                {/* Image Side */}
                                <div className="w-full lg:w-1/2 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                    <img
                                        src={getImageUrl(event.image)}
                                        alt={event.title}
                                        className="relative w-full h-[400px] object-cover rounded-2xl shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]"
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/800x600?text=Live+Concert'; }}
                                    />
                                </div>

                                {/* Content Side */}
                                <div className="w-full lg:w-1/2 space-y-6">


                                    <h2 className="text-4xl md:text-6xl font-playfair-bold leading-tight">
                                        {event.artistName || event.title}
                                    </h2>

                                    <p className="inter-light-text text-gray-400 text-lg leading-relaxed">
                                        {event.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Date</p>
                                                <p className="text-lg font-bold">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-400">
                                                <Clock size={24} />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Time</p>
                                                <p className="text-lg font-bold">{event.timings || new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 md:col-span-2">
                                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Venue</p>
                                                <p className="text-lg font-bold">{event.venue}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-3xl font-bold text-gray-700">Stay Tuned!</h3>
                        <p className="text-gray-500 mt-2">Artist reveal coming soon...</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default LiveConcert;
