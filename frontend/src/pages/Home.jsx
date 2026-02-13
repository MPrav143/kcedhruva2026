import { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import EventDetailsModal from '../components/EventDetailsModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import About from './About';
import PastEvents from '../components/PastEvents';
import DepartmentCard from '../components/DepartmentCard';
import Passes from './Passes';
import { DEPARTMENTS } from '../utils/constants';
import { API_URL } from '../utils/config';
const Home = () => {
    const { config } = useGlobalConfig();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // View State: 'Categories', 'Departments', 'Events'
    const [viewMode, setViewMode] = useState('Categories');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);

    // Derived state for display
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Initial Fetch & Loader Logic
    useEffect(() => {
        // Enforce a minimum 2-second loader for consistency/branding
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        const fetchEvents = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/events`);
                setEvents(data);

                const now = new Date();
                const upcoming = data.filter(e => new Date(e.date) >= now);

                setUpcomingEvents(upcoming);
                // Note: We don't set loading false here immediately to respect the 2s timer if data loads too fast
            } catch (error) {
                console.error(error);
                // If error, we still wait for timer or set false if timer already done? 
                // Simplest is to let timer handle "visual" loading end, or handle error state separately.
            }
        };
        fetchEvents();

        return () => clearTimeout(timer);
    }, []);

    // Effect for URL-based navigation (Deep linking)
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const deptParam = queryParams.get('dept');
        const catParam = queryParams.get('cat');
        const typeParam = queryParams.get('type');

        if (deptParam) {
            setViewMode('Events');
            setSelectedCategory('Technical'); // Assuming depts are mostly technical, but robust logic below handles filter
            setSelectedDept(deptParam);
        } else if (catParam) {
            if (catParam === 'Technical') {
                // If just 'Technical' is clicked from navbar, show Departments
                setViewMode('Departments');
                setSelectedCategory('Technical');
            } else {
                // For Cultural/Sports, show Events directly (or subtypes if implemented later)
                setViewMode('Events');
                setSelectedCategory(catParam);
            }
        } else {
            // Default to Categories view if no params
            setViewMode('Categories');
            setSelectedCategory(null);
            setSelectedDept(null);
        }
    }, [location.search]);

    // Filtering Logic based on View Mode
    useEffect(() => {
        let result = upcomingEvents;

        if (viewMode === 'Events') {
            if (selectedDept) {
                result = result.filter(e => e.department === selectedDept);
            } else if (selectedCategory) {
                result = result.filter(e => e.category === selectedCategory);
            }
            // Additional Type filtering from URL if needed
            const queryParams = new URLSearchParams(location.search);
            const typeParam = queryParams.get('type');
            if (typeParam) {
                result = result.filter(e => {
                    // Robust filter for sub-types
                    const normType = (e.eventType || '').toLowerCase().replace(/\s+/g, '');
                    const normCat = (e.category || '').toLowerCase().replace(/\s+/g, '');
                    const normDept = (e.department || '').toLowerCase().replace(/\s+/g, '');
                    const normParam = typeParam.toLowerCase().replace(/\s+/g, '');
                    return normType === normParam || normCat === normParam || normDept === normParam || e.eventType === typeParam;
                });
            }
        }

        // Alphabetical sort by title
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));

        setFilteredEvents(result);
    }, [upcomingEvents, viewMode, selectedCategory, selectedDept, location.search]);


    // Handlers
    const handleCategoryClick = (category) => {
        if (category === 'Technical') {
            setViewMode('Departments');
            setSelectedCategory('Technical');
            // Update URL without reload? Or just state?
            // User requested "route it to the pages", so maybe URL update is good for history
            // navigate('?cat=Technical', { replace: true }); // Optional: update URL
        } else {
            setViewMode('Events');
            setSelectedCategory(category);
            // navigate(`?cat=${category}`, { replace: true });
        }
    };

    const handleBack = () => {
        if (viewMode === 'Events' && selectedCategory === 'Technical') {
            setViewMode('Departments');
            setSelectedDept(null);
        } else {
            setViewMode('Categories');
            setSelectedCategory(null);
            setSelectedDept(null);
            navigate('/'); // Clear query params
        }
    };

    const handleDeptClick = (dept) => {
        setViewMode('Events');
        setSelectedDept(dept);
        // navigate(`?dept=${dept}`, { replace: true });
    };

    // Departments list from constants
    const departments = DEPARTMENTS;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

            {loading ? (
                <div className="h-screen flex items-center justify-center">
                    <Loader text="Welcome to Dhruva..." />
                </div>
            ) : (
                <>
                    <Navbar />

                    {/* Hero Section - Only show on main view or top level */}
                    {viewMode === 'Categories' && (
                        <section className="text-center pt-32 pb-20 relative z-15 px-4 min-h-[60vh] flex flex-col justify-center items-center">
                            {config.home_hero_bg && (
                                <div className="absolute inset-0 z-[-1] ">
                                    {/\.(mp4|webm|ogg)$/i.test(config.home_hero_bg) ? (
                                        <video
                                            src={getImageUrl(config.home_hero_bg)}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img src={getImageUrl(config.home_hero_bg)} alt="Hero BG" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
                                </div>
                            )}
                            <h2 className="inline-block text-4xl md:text-7xl font-bold font-serif mb-10
                                    leading-tight
                                    bg-gradient-to-r from-violet-400 to-blue-500
                                    bg-clip-text text-transparent">
                                {config.website_name || 'Experience'} the <br /> Extraordinary
                            </h2>



                            <p className="text-base font-mono md:text-[1.5rem] max-w-2xl mx-auto mb-10 px-3 
    text-gray-200">

                                Join us for the biggest technical, cultural, and sports festival of the year.
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 animate-fadeInUp">
                                <button
                                    onClick={() => navigate('/passes')}
                                    className="px-8 py-3 bg-white/10 hover:bg-blue-900 font-serif text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                                >
                                    Register Now
                                </button>
                                <button
                                    onClick={() => document.getElementById('events-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-3 bg-white/10 hover:bg-blue-900 font-serif text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                                >
                                    Explore Events
                                </button>
                            </div>
                        </section>
                    )}

                    {viewMode === 'Categories' && <About embed={true} />}
                    {/* Past Events Section */}
                    {viewMode === 'Categories' && <PastEvents />}

                    {/* Upcoming Events Section (Hierarchical View) */}
                    <section id="events-section" className="max-w-7xl playwrite-nz-basic-light mx-auto px-4 md:px-6 py-20 relative z-10">
                        <div className="flex items-center gap-4 mb-8">

                            {viewMode !== 'Categories' && (
                                <button onClick={handleBack} className="p-2 playwrite-nz-basic-light rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                    Back
                                </button>
                            )}
                            <h3 className="text-3xl font-bold playwrite-nz-basic-light border-l-4 border-blue-500 pl-4">
                                {viewMode === 'Categories' ? 'Explore Events' :
                                    viewMode === 'Departments' ? 'Select Department' :
                                        `${selectedDept || selectedCategory || 'Upcoming'} Events`}
                            </h3>
                        </div>

                        {/* Level 1: Categories */}
                        {viewMode === 'Categories' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 laywrite-nz-basic-light gap-8">
                                {[
                                    { name: 'Technical', key: 'cat_technical_image', default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' },
                                    { name: 'Cultural', key: 'cat_cultural_image', default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' },
                                    { name: 'Sports', key: 'cat_sports_image', default: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' }
                                ].map(cat => (
                                    <div
                                        key={cat.name}
                                        onClick={() => handleCategoryClick(cat.name)}
                                        className="group relative h-80 bg-gradient-to-br laywrite-nz-basic-light from-white/5 to-white/0 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                                    >
                                        <img
                                            src={getImageUrl(config[cat.key] || cat.default)}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                            <h3 className="text-4xl font-bold text-white mb-2 laywrite-nz-basic-light group-hover:translate-z-10 transition-transform">{cat.name}</h3>
                                            {/* <p className="text-white/80 text-sm font-medium">Click to explore {cat.name.toLowerCase()} events</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Level 2: Departments (Only for Technical) */}
                        {viewMode === 'Departments' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {departments.map(dept => {
                                    // Calculate dynamic stats for this department
                                    const deptEvents = upcomingEvents.filter(e => e.department === dept.code);
                                    const stats = {
                                        workshops: deptEvents.filter(e =>
                                            e.eventType === 'Workshop' ||
                                            e.eventType === 'Hands-on' ||
                                            e.category === 'Workshop'
                                        ).length,
                                        technical: deptEvents.filter(e =>
                                            e.category === 'Technical' &&
                                            e.eventType !== 'Workshop' &&
                                            e.eventType !== 'Hands-on'
                                        ).length,
                                        nonTechnical: deptEvents.filter(e =>
                                            e.category === 'Cultural' ||
                                            e.category === 'Sports'
                                        ).length
                                    };

                                    // Use configured image if available, else fallback to default
                                    const displayImage = config[`dept_${dept.code}_image`] || dept.image;

                                    return (
                                        <DepartmentCard
                                            key={dept.code}
                                            dept={{ ...dept, image: displayImage }}
                                            stats={stats}
                                            onClick={() => handleDeptClick(dept.code)}
                                        />
                                    );
                                })}
                            </div>
                        )}

                        {/* Level 3: Events List */}
                        {viewMode === 'Events' && (
                            <div className="grid grid-cols-1 inter-light-text md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <EventCard
                                            key={event._id}
                                            event={event}
                                            onView={(evt) => navigate(`/register/${evt._id}`)}
                                        />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 text-gray-500">
                                        No events found for this selection.
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    {viewMode === 'Categories' && <Passes embed={true} />}


                    <Footer />

                    <EventDetailsModal
                        event={selectedEvent}
                        onClose={() => setSelectedEvent(null)}
                        showRegister={true}
                    />
                </>
            )}
        </div>
    );
};

export default Home;
