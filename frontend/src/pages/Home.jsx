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
import dhruvalogo from '../assets/DhruvaLogo.png';
import Doodles from '../components/Doodles';
import Popup from '../components/Popup';

const Home = () => {
    const { config } = useGlobalConfig();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // View State: 'Categories', 'Departments', 'Events'
    const [viewMode, setViewMode] = useState('Categories');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null); // 'Technical', 'Non Technical', 'Workshop'

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
                now.setHours(0, 0, 0, 0); // Reset time to start of day for inclusive comparison

                const upcoming = data.filter(e => {
                    const eventDate = new Date(e.date);
                    eventDate.setHours(0, 0, 0, 0);
                    return eventDate >= now;
                });

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
            setSelectedCategory('Technical'); // Root category for depts
            setSelectedDept(deptParam);
            if (typeParam) {
                setViewMode('Events');
                setSelectedSubCategory(typeParam);
            } else {
                setViewMode('CategoryDashboard');
                setSelectedSubCategory(null);
            }
        } else if (catParam) {
            setSelectedCategory(catParam);
            if (catParam === 'Technical') {
                // If just 'Technical' is clicked from navbar, show Departments
                setViewMode('Departments');
                setSelectedDept(null);
            } else if (catParam === 'Cultural' && !typeParam) {
                // If 'Cultural' is clicked without type, show subcategories (Dashboard)
                setViewMode('CategoryDashboard');
                setSelectedDept(null);
                setSelectedSubCategory(null);
            } else {
                // For Cultural with type, Sports, or others
                setViewMode('Events');
                if (catParam === 'Cultural') {
                    setSelectedSubCategory(typeParam);
                } else {
                    setSelectedSubCategory(null);
                }
            }
        } else {
            // Default to Categories view if no params
            setViewMode('Categories');
            setSelectedCategory(null);
            setSelectedDept(null);
            setSelectedSubCategory(null);
        }
    }, [location.search]);

    // Filtering Logic based on View Mode
    useEffect(() => {
        let result = upcomingEvents;

        if (viewMode === 'Events') {
            if (selectedDept) {
                result = result.filter(e => {
                    if (!selectedDept) return true;
                    const normalized = (s) => {
                        let n = (s || '').replace(/%26|&|-|_/g, '').replace(/\s/g, '').toLowerCase();
                        if (n === 'csd' || n === 'cst' || n === 'csdcst') return 'csdcst';
                        if (n === 'ete' || n === 'vlsi' || n === 'etevlsi') return 'etevlsi';
                        return n;
                    };
                    return normalized(e.department) === normalized(selectedDept);
                });
            } else if (selectedCategory) {
                result = result.filter(e => e.category === selectedCategory);
            }

            if (selectedSubCategory) {
                if (selectedSubCategory === 'Workshop') {
                    result = result.filter(e =>
                        e.category === 'Workshop' ||
                        e.eventType === 'Workshop' ||
                        e.eventType === 'Hands-on'
                    );
                } else if (selectedSubCategory === 'Technical') {
                    result = result.filter(e =>
                        ['Technical', 'Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation'].includes(e.category) &&
                        e.eventType !== 'Workshop' &&
                        e.eventType !== 'Hands-on'
                    );
                } else if (selectedSubCategory === 'Non Technical') {
                    result = result.filter(e =>
                        ['Non Technical', 'Non-Technical'].includes(e.category)
                    );
                } else if (selectedSubCategory === 'OnStage' || selectedSubCategory === 'OffStage') {
                    result = result.filter(e =>
                        e.eventType === selectedSubCategory ||
                        e.department === selectedSubCategory
                    );
                }
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

    // Internal Scroll Management: Scroll to section top on internal navigation
    useEffect(() => {
        if (viewMode !== 'Categories') {
            const timer = setTimeout(() => {
                const element = document.getElementById('events-section');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [viewMode, selectedCategory, selectedDept, selectedSubCategory]);


    // Handlers (Update URL for deep linking and back-button support)
    const handleCategoryClick = (category) => {
        if (category === 'Technical') {
            navigate('/?cat=Technical');
        } else if (category === 'Cultural') {
            navigate('/?cat=Cultural');
        } else {
            navigate(`/?cat=${category}`);
        }
    };

    const handleBack = () => {
        if (viewMode === 'Events' && selectedDept) {
            navigate(`/?dept=${selectedDept}`);
        } else if (viewMode === 'Events' && selectedCategory === 'Cultural') {
            navigate('/?cat=Cultural');
        } else if (viewMode === 'CategoryDashboard' && selectedCategory === 'Cultural') {
            navigate('/');
        } else if (viewMode === 'CategoryDashboard' && selectedDept) {
            navigate('/?cat=Technical');
        } else if (viewMode === 'Departments') {
            navigate('/');
        } else {
            navigate('/');
        }
    };

    const handleDeptClick = (dept) => {
        navigate(`/?dept=${dept}`);
    };

    const handleSubCategoryClick = (subCat) => {
        const params = new URLSearchParams(location.search);
        params.set('type', subCat);
        navigate(`/?${params.toString()}`);
    };

    // Departments list from constants
    const departments = DEPARTMENTS;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
            <Doodles />

            {loading ? (
                <div className="h-screen flex items-center justify-center">
                    <Loader text="Welcome to Dhruva..." />
                </div>
            ) : (
                <>
                    <Popup />
                    <Navbar />

                    {/* Hero Section - Only show on main view or top level */}
                    {viewMode === 'Categories' && (
                        <section className="text-center pt-24 sm:pt-32 pb-16 sm:pb-20 relative z-15 px-4 min-h-[100vh] flex flex-col justify-center items-center">
                            {config.home_hero_bg && (
                                <div className="absolute inset-0 z-[-1] ">
                                    {/\.(mp4|webm|ogg)$/i.test(config.home_hero_bg) ? (
                                        <video
                                            src={getImageUrl(config.home_hero_bg)}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full     object-cover"
                                        />
                                    ) : (
                                        <img src={getImageUrl(config.home_hero_bg)} alt="Hero BG" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
                                </div>
                            )}
                            <div className="mb-6 md:mb-10 w-full flex justify-center">
                                <img src={dhruvalogo} alt="Logo" className='w-[150px] h-[120px] sm:w-[250px] sm:h-[200px] object-contain drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse' />
                            </div>
                            <h2 className="inline-block text-3xl sm:text-5xl md:text-7xl font-bold font-serif mb-6 md:mb-10
                                    leading-tight
                                    bg-gradient-to-r from-violet-400 to-blue-500
                                    bg-clip-text text-transparent">
                                The Extraordinary
                            </h2>



                            <p className="text-base inter-light-text md:text-[1.5rem] max-w-2xl mx-auto mb-10 px-3 
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
                    <div className="bg-gradient-to-tr from-blue-900 to-purple-600">
                        <section id="events-section" className="max-w-7xl inter-light-text mx-auto px-4 md:px-6 py-20 relative z-10">
                            {/* <h2 className="text-3xl font-bold inter-bold-text border-l-4 border-blue-500 pl-4">
                                Upcoming Events
                            </h2> */}
                            <div className="flex items-center gap-4 mb-8">

                                {viewMode !== 'Categories' && (
                                    <button onClick={handleBack} className="p-2 inter-light-text rounded-full bg-white/10 hover:bg-white/20 transition-all">
                                        Back
                                    </button>
                                )}
                                <h3 className="text-3xl font-bold inter-light-text border-l-4 border-blue-500 pl-4">
                                    {viewMode === 'Categories' ? 'Explore Events' :
                                        viewMode === 'Departments' ? 'Select Department' :
                                            viewMode === 'CategoryDashboard' ?
                                                (selectedCategory === 'Cultural' ? 'Cultural Categories' : `${(selectedDept || '').toUpperCase() === 'AIDS' ? 'AI & DS' : selectedDept} Categories`) :
                                                (selectedSubCategory ?
                                                    `${selectedSubCategory === 'OnStage' ? 'On Stage' : selectedSubCategory === 'OffStage' ? 'Off Stage' : selectedSubCategory} Events` :
                                                    `${((selectedDept || '').toUpperCase() === 'AIDS' ? 'AI & DS' : selectedDept) || selectedCategory || 'Upcoming'} Events`)}
                                </h3>
                            </div>

                            {/* Level 1: Categories */}
                            {viewMode === 'Categories' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 inter-light-text gap-8">
                                    {[
                                        { name: 'Technical', key: 'cat_technical_image', default: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' },
                                        { name: 'Cultural', key: 'cat_cultural_image', default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' },
                                        { name: 'Sports', key: 'cat_sports_image', default: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80' }
                                    ].map(cat => (
                                        <div
                                            key={cat.name}
                                            onClick={() => handleCategoryClick(cat.name)}
                                            className="group relative aspect-[4/3] h-auto bg-gradient-to-br inter-light-text from-white/5 to-white/0 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                                        >
                                            <img
                                                src={getImageUrl(config[cat.key] || cat.default)}
                                                alt={cat.name}
                                                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                                <h3 className="text-4xl font-bold text-white mb-2 playwrite-nz-basic-light group-hover:translate-z-10 transition-transform">{cat.name}</h3>
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
                                        const normalizedMatch = (s1, s2) => {
                                            const n = (s) => {
                                                let val = (s || '').replace(/%26|&|-|_/g, '').replace(/\s/g, '').toLowerCase();
                                                if (val === 'csd' || val === 'cst' || val === 'csdcst') return 'csdcst';
                                                if (val === 'ete' || val === 'vlsi' || val === 'etevlsi') return 'etevlsi';
                                                return val;
                                            };
                                            return n(s1) === n(s2);
                                        };
                                        const deptEvents = upcomingEvents.filter(e => normalizedMatch(e.department, dept.code));
                                        const stats = {
                                            workshops: deptEvents.filter(e =>
                                                e.category === 'Workshop' ||
                                                e.eventType === 'Workshop' ||
                                                e.eventType === 'Hands-on'
                                            ).length,
                                            technical: deptEvents.filter(e =>
                                                ['Technical', 'Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation'].includes(e.category) &&
                                                e.eventType !== 'Workshop' &&
                                                e.eventType !== 'Hands-on'
                                            ).length,
                                            nonTechnical: deptEvents.filter(e =>
                                                ['Non Technical', 'Non-Technical'].includes(e.category)
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

                            {/* Level 2.5: Category Dashboard (Summary Cards) */}
                            {viewMode === 'CategoryDashboard' && (
                                <div className="flex flex-wrap justify-center gap-8 inter-light-text">
                                    {selectedCategory === 'Cultural' ? (
                                        // Cultural Dashboard: On Stage / Off Stage
                                        [
                                            { name: 'On Stage', type: 'OnStage', imgKey: 'cat_cultural_image', default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3' },
                                            { name: 'Off Stage', type: 'OffStage', imgKey: 'cat_cultural_image', default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3' }
                                        ].map(sub => {
                                            const count = upcomingEvents.filter(e =>
                                                e.category === 'Cultural' &&
                                                (e.eventType === sub.type || e.department === sub.type)
                                            ).length;

                                            return (
                                                <div
                                                    key={sub.name}
                                                    onClick={() => handleSubCategoryClick(sub.type)}
                                                    className="group relative w-full md:w-[calc(33.333%-2rem)] max-w-sm aspect-video inter-light-text md:aspect-[4/3] h-auto bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                                                >
                                                    <img
                                                        src={getImageUrl(config[sub.imgKey] || sub.default)}
                                                        alt={sub.name}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                                        <h3 className="text-3xl inter-bold-text text-white mb-4 group-hover:scale-110 transition-transform">
                                                            {sub.name}
                                                        </h3>
                                                        <div className="bg-pink-600/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                                                            <span className="text-xl inter-bold-text text-white">{count} Events</span>
                                                        </div>
                                                        <p className="mt-4 text-white/60 text-xs font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to view</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : selectedDept ? (
                                        // Technical Department Dashboard
                                        [
                                            { name: 'Technical', key: 'technical', imgKey: 'cat_technical_image', default: 'https://images.unsplash.com/photo-1518770660439-4636190af475' },
                                            { name: 'Non Technical', key: 'nonTechnical', imgKey: 'cat_nontechnical_image', default: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3' },
                                            { name: 'Workshop', key: 'workshops', imgKey: 'cat_workshop_image', default: 'https://images.unsplash.com/photo-1552664730-d307ca884978' }
                                        ].map(sub => {
                                            const normalizedMatch = (s1, s2) => {
                                                const n = (s) => {
                                                    let val = (s || '').replace(/%26|&|-|_/g, '').replace(/\s/g, '').toLowerCase();
                                                    if (val === 'csd' || val === 'cst' || val === 'csdcst') return 'csdcst';
                                                    if (val === 'ete' || val === 'vlsi' || val === 'etevlsi') return 'etevlsi';
                                                    return val;
                                                };
                                                return n(s1) === n(s2);
                                            };
                                            const deptEvents = upcomingEvents.filter(e => normalizedMatch(e.department, selectedDept));
                                            const count = deptEvents.filter(e => {
                                                if (sub.key === 'workshops') return (e.category === 'Workshop' || e.eventType === 'Workshop' || e.eventType === 'Hands-on');
                                                if (sub.key === 'technical') return (['Technical', 'Hackathon', 'Ideathon', 'Paper Presentation', 'Project Presentation'].includes(e.category) && e.eventType !== 'Workshop' && e.eventType !== 'Hands-on');
                                                if (sub.key === 'nonTechnical') return (['Non Technical', 'Non-Technical'].includes(e.category));
                                                return false;
                                            }).length;

                                            return (
                                                <div
                                                    key={sub.name}
                                                    onClick={() => handleSubCategoryClick(sub.name === 'Workshop' ? 'Workshop' : sub.name)}
                                                    className="group relative w-full md:w-[calc(33.333%-2rem)] max-w-sm aspect-video inter-light-text md:aspect-[4/3] h-auto bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300"
                                                >
                                                    <img
                                                        src={getImageUrl(config[sub.imgKey] || sub.default)}
                                                        alt={sub.name}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                                        <h3 className="text-3xl inter-bold-text text-white mb-4 group-hover:scale-110 transition-transform">
                                                            {sub.name === 'Workshop' ? 'Workshops' : sub.name}
                                                        </h3>
                                                        <div className="bg-blue-600/30 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                                                            <span className="text-xl inter-bold-text text-white">{count} Events</span>
                                                        </div>
                                                        <p className="mt-4 text-white/60 text-xs font-medium uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to view</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : null}
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
                    </div>

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
