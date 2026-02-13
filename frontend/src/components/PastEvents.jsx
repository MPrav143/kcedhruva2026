import { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/config';
import { motion } from 'framer-motion';
import { useGlobalConfig } from '../context/GlobalConfigContext';

const PastEvents = () => {
    const { config } = useGlobalConfig();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch events
    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const { data } = await axios.get(
                    `${API_URL}/content/pastEvents`
                );
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch past events", error);
            }
        };

        fetchPastEvents();
    }, []);

    // Rotate every 1 second
    useEffect(() => {
        if (!events.length) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % events.length);
        }, 1000); // 1 second

        return () => clearInterval(interval);
    }, [events]);

    if (!events.length) return null;

    const highlights = [
        config?.past_highlight_1 || 'Expert Speakers - Learn from the best in the field',
        config?.past_highlight_2 || 'Interactive Workshops - Hands-on sessions to sharpen skills',
        config?.past_highlight_3 || 'Networking Opportunities - Connect with peers & mentors',
        config?.past_highlight_4 || 'Gear Up for Glory – Show your skills, chase the championship'
    ];

    return (
        <section className="py-24 bg-[#0a0a0a] bg-gradient-to-br from-purple-400 via-black to-blue-600 text-white overflow-hidden relative border-t border-white/5">

            {/* Background glow */}
            <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Heading */}
                <div className="mb-16 text-center ">
                    <h2 className="text-4xl md:text-7xl font-bold tracking-tight uppercase">
                        <span className="bg-gradient-to-r from-green-400 via-blue-400 to-red-500 bg-clip-text text-transparent">
                            KCE Dhruva
                        </span>{' '}
                        <span className="text-blue-500">
                            Events
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light mt-6">
                        {config?.past_event_desc || "Join us as we bring together vivid minds"}
                    </p>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">

                    {/* LEFT - Card Stack */}
                    <div className="relative h-[500px] w-full flex items-center justify-center">
                        {events.map((event, index) => {
                            const isActive = index === currentIndex;

                            return (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: isActive ? 1 : 0,
                                        scale: isActive ? 1 : 0.95,
                                        y: isActive ? 0 : -10,
                                        zIndex: isActive ? 10 : 0
                                    }}
                                    transition={{ duration: 0.35 }}
                                    className="absolute w-[280px] md:w-[500px] h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                                >
                                    <img
                                        src={getImageUrl(event.image)}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* RIGHT - Content */}
                    <div className="space-y-8">
                        <h3 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            {config?.past_event_subheading || "Unleash Your Potential at Dhruva"}
                        </h3>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            Join us for an immersive experience designed to ignite your passion, expand your knowledge, and connect you with industry leaders.
                        </p>
                        <div className="grid grid-cols-1 gap-6">
                            {highlights.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx }}
                                    className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                        ✓
                                    </div>
                                    <span className="text-gray-200 font-medium">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <br />
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fadeInUp">
                <button
                    onClick={() => navigate('/passes')}
                    className="px-10 py-4 bg-white/10 hover:bg-blue-900 font-serif text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                >
                    Register Now
                </button>
            </div>
        </section>
    );
};

export default PastEvents;
