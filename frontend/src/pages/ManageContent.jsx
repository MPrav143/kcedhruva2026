import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Save, Plus, Trash2, Pencil, Link as LinkIcon } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';

const ManageContent = () => {
    const { refreshConfig, config: siteConfig } = useGlobalConfig();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('general');
    const [rules, setRules] = useState(''); // Keeping state to avoid breakage if referenced, but UI removed
    const [aboutContent, setAboutContent] = useState('');
    const [aboutKceContent, setAboutKceContent] = useState('');
    const [aboutKceImage, setAboutKceImage] = useState('');
    const [aboutLogo, setAboutLogo] = useState('');
    const [aboutLogoWidth, setAboutLogoWidth] = useState('');
    const [aboutHeroBg, setAboutHeroBg] = useState('');
    const [aboutVideo, setAboutVideo] = useState('');
    const [aboutKceVideo, setAboutKceVideo] = useState('');

    const [contact, setContact] = useState({ email: '', address: '' });
    const [contactPhones, setContactPhones] = useState(['']);
    const [footerBgVideo, setFooterBgVideo] = useState('');
    const [footerBgVideoMobile, setFooterBgVideoMobile] = useState('');
    const [rulesBg, setRulesBg] = useState('');
    const [generalConfig, setGeneralConfig] = useState({ website_name: 'Dhruva', event_year: '2025', registration_open: 'true' });
    const [sponsors, setSponsors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    // Popup Images
    const [popupImages, setPopupImages] = useState([]);

    // New State for Content Structure
    const [pastEventDesc, setPastEventDesc] = useState('');
    const [pastEventSubheading, setPastEventSubheading] = useState('');
    const [pastEventHighlights, setPastEventHighlights] = useState(['', '', '', '']);

    // Local state for image inputs to avoid auto-save
    const [imageValues, setImageValues] = useState({});

    const [loading, setLoading] = useState(true);

    const getAuthConfig = () => {
        const token = localStorage.getItem('adminToken');
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // Common Fetch
    const fetchData = async () => {
        try {
            const [confRes, sponsorsRes, clubsRes, pastEventsRes] = await Promise.all([
                axios.get(`${API_URL}/upload`),
                axios.get(`${API_URL}/content/sponsors`),
                axios.get(`${API_URL}/content/clubs`),
                axios.get(`${API_URL}/content/pastEvents`)
            ]);

            setRules(confRes.data['rules_content'] || '');
            setRulesBg(confRes.data['rules_bg'] || '');
            setAboutContent(confRes.data['about_content'] || '');
            setAboutKceContent(confRes.data['about_kce_content'] || '');
            setAboutKceImage(confRes.data['about_kce_image'] || '');
            setAboutLogo(confRes.data['about_logo'] || '/dhruvalogo.png');
            setAboutLogoWidth(confRes.data['about_logo_width'] || '150px');
            setAboutHeroBg(confRes.data['about_hero_bg'] || '');
            setAboutVideo(confRes.data['about_video'] || '');
            setAboutKceVideo(confRes.data['about_kce_video'] || '');
            setContact({
                email: confRes.data['contact_email'] || '',
                address: confRes.data['contact_address'] || ''
            });

            const phones = confRes.data['contact_phones'] || confRes.data['contact_phone'] || '';
            setContactPhones(phones ? phones.split(',').map(p => p.trim()) : ['']);

            setFooterBgVideo(confRes.data['footer_bg_video'] || '');
            setFooterBgVideoMobile(confRes.data['footer_bg_video_mobile'] || '');

            const pImages = confRes.data['popup_images'] || '';
            setPopupImages(pImages ? pImages.split(',').map(p => p.trim()).filter(Boolean) : []);

            // Past Events Static Content
            setPastEventDesc(confRes.data['past_event_desc'] || 'Join us as we bring together vivid minds...');
            setPastEventSubheading(confRes.data['past_event_subheading'] || 'Unleash Your Potential at Dhruva');
            setPastEventHighlights([
                confRes.data['past_highlight_1'] || 'Expert Speakers',
                confRes.data['past_highlight_2'] || 'Interactive Workshops',
                confRes.data['past_highlight_3'] || 'Networking Opportunities',
                confRes.data['past_highlight_4'] || 'Gear Up for Glory'
            ]);

            setGeneralConfig({
                website_name: confRes.data['website_name'] || 'Dhruva',
                event_year: confRes.data['event_year'] || '2025',
                registration_open: confRes.data['registration_open'] || 'true'
            });

            setSponsors(sponsorsRes.data);
            setClubs(clubsRes.data);
            setPastEvents(pastEventsRes.data);

            // Initialize imageValues from config
            const initialImageValues = {};
            ['cat_technical_image', 'cat_cultural_image', 'cat_sports_image', 'cat_nontechnical_image', 'cat_workshop_image'].forEach(key => {
                initialImageValues[key] = confRes.data[key] || '';
            });
            ['AIDS', 'CIVIL', 'CSD-CST', 'CSE', 'EEE', 'ECE', 'IT', 'MECH', 'MBA', 'MCA', 'CSECS', 'ETE-VLSI'].forEach(code => {
                initialImageValues[`dept_${code}_image`] = confRes.data[`dept_${code}_image`] || '';
            });
            setImageValues(initialImageValues);

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getEmbedLink = (link) => {
        if (!link) return '';
        if (link.includes('drive.google.com') && link.includes('/view')) {
            return link.replace('/view', '/preview');
        }
        return link;
    };

    // --- RULES & CONTACT HANDLERS ---
    const saveConfig = async (key, value, type = 'text') => {
        try {
            await axios.post(`${API_URL}/content/config`, { key, value, type }, getAuthConfig());
            alert('Saved successfully!');
            refreshConfig();
            setImageValues(prev => ({ ...prev, [key]: value }));
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving');
            }
        }
    };

    // --- GENERIC LIST HANDLER (Sponsors/Clubs) ---
    const [itemForm, setItemForm] = useState({ name: '', logo: '', description: '', tier: 'Silver' });
    const [editingItem, setEditingItem] = useState(null);

    const handleItemSubmit = async (e, type) => {
        e.preventDefault();
        try {
            let logoUrl = getEmbedLink(itemForm.logo);
            const payload = { ...itemForm, logo: logoUrl };
            if (editingItem) {
                await axios.put(`${API_URL}/content/${type}s/${editingItem._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/${type}s`, payload, getAuthConfig());
            }
            setItemForm({ name: '', logo: '', description: '', tier: 'Silver' });
            setEditingItem(null);
            refreshConfig();
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving item');
            }
        }
    };

    // --- PAST EVENTS HANDLER ---
    const [pastEventForm, setPastEventForm] = useState({ title: '', image: '', description: '' }); // Form with description
    const [editingPastEvent, setEditingPastEvent] = useState(null);

    const handlePastEventSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = getEmbedLink(pastEventForm.image);
            const payload = { ...pastEventForm, image: imageUrl };

            if (editingPastEvent) {
                await axios.put(`${API_URL}/content/pastEvents/${editingPastEvent._id}`, payload, getAuthConfig());
            } else {
                await axios.post(`${API_URL}/content/pastEvents`, payload, getAuthConfig());
            }
            setPastEventForm({ title: '', image: '', description: '' });
            setEditingPastEvent(null);
            fetchData();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Error saving past event');
            }
        }
    };

    const handlePastEventDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await axios.delete(`${API_URL}/content/pastEvents/${id}`, getAuthConfig());
                fetchData();
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) navigate('/login');
            }
        }
    };



    const deleteItem = async (id, type) => {
        if (window.confirm('Delete this item?')) {
            try {
                await axios.delete(`${API_URL}/content/${type}s/${id}`, getAuthConfig());
                refreshConfig();
                fetchData();
            } catch (error) {
                if (error.response?.status === 401) navigate('/login');
            }
        }
    }

    const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'home_media', label: 'Home Media' },
        { id: 'popup', label: 'Popup Images' },
        { id: 'contact', label: 'Contact Details' },
        { id: 'footer', label: 'Footer Settings' },
        { id: 'about', label: 'About Page' },
        { id: 'sponsors', label: 'Sponsors' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'pastEvents', label: 'Past Events' }
    ];

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
                    {loading ? (
                        <Loader />
                    ) : (
                        <>
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold">Manage Dynamic Content</h1>
                            </header>

                            {/* Tab Navigation */}
                            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'general' && (
                                <div className="max-w-xl space-y-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Website Name</label>
                                        <input value={generalConfig.website_name} onChange={(e) => setGeneralConfig({ ...generalConfig, website_name: e.target.value })} placeholder="e.g. Dhruva" className="w-full bg-black/20 border border-white/10 rounded-lg p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Event Year</label>
                                        <input value={generalConfig.event_year} onChange={(e) => setGeneralConfig({ ...generalConfig, event_year: e.target.value })} placeholder="e.g. 2025" className="w-full bg-black/20 border border-white/10 rounded-lg p-3" />
                                    </div>
                                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="flex-1">
                                            <label className="block text-sm font-bold text-white">Registration Status</label>
                                            <p className="text-xs text-gray-400">Enable or disable all event registrations and pass purchases.</p>
                                        </div>
                                        <button
                                            onClick={() => setGeneralConfig({ ...generalConfig, registration_open: generalConfig.registration_open === 'true' ? 'false' : 'true' })}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${generalConfig.registration_open === 'true' ? 'bg-blue-600' : 'bg-gray-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalConfig.registration_open === 'true' ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                        <span className="text-sm font-bold">{generalConfig.registration_open === 'true' ? 'Open' : 'Closed'}</span>
                                    </div>

                                    <button onClick={() => {
                                        saveConfig('website_name', generalConfig.website_name);
                                        saveConfig('event_year', generalConfig.event_year);
                                        saveConfig('registration_open', generalConfig.registration_open);
                                    }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <Save size={18} /> Save General Info
                                    </button>
                                </div>
                            )}

                            {activeTab === 'popup' && (
                                <div className="max-w-4xl animate-fadeIn space-y-6">
                                    <h3 className="text-xl font-bold mb-4">Home Screen Popup Images (Max 10)</h3>
                                    <p className="text-sm text-gray-400 mb-6">Add up to 10 images to show as a dynamic grid popup on the home screen. Recommended aspect ratio: 4:5.</p>

                                    <div className="space-y-4">
                                        {popupImages.map((imgUrl, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div className="w-24 h-32 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                                    {imgUrl && <img src={getImageUrl(imgUrl)} alt={`Popup ${index + 1}`} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="flex-1 space-y-2 w-full">
                                                    <label className="block text-sm text-gray-400">Image {index + 1} URL</label>
                                                    <input
                                                        value={imgUrl}
                                                        onChange={(e) => {
                                                            const newImages = [...popupImages];
                                                            newImages[index] = e.target.value;
                                                            setPopupImages(newImages);
                                                        }}
                                                        placeholder="Paste Image URL or Drive Link"
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => setPopupImages(popupImages.filter((_, i) => i !== index))}
                                                    className="mt-2 sm:mt-6 p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors self-end sm:self-auto"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}

                                        {popupImages.length < 10 && (
                                            <button
                                                onClick={() => setPopupImages([...popupImages, ''])}
                                                className="flex items-center justify-center gap-2 text-sm text-blue-400 font-bold mt-4 py-4 w-full border-2 border-dashed border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                                            >
                                                <Plus size={18} /> Add Popup Image
                                            </button>
                                        )}
                                    </div>
                                    <button onClick={() => {
                                        saveConfig('popup_images', popupImages.filter(p => p.trim() !== '').map(getEmbedLink).join(','));
                                    }} className="bg-blue-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full mt-8 hover:bg-blue-500 transition-all text-lg shadow-lg shadow-blue-600/20">
                                        <Save size={20} /> Save Popup Images
                                    </button>
                                </div>
                            )}

                            {activeTab === 'home_media' && (
                                <div className="space-y-12 animate-fadeIn">
                                    {/* Category Images */}
                                    <section>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                                            Category Images
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {[
                                                { label: 'Technical', key: 'cat_technical_image' },
                                                { label: 'Cultural', key: 'cat_cultural_image' },
                                                { label: 'Sports', key: 'cat_sports_image' },
                                                { label: 'Non Technical', key: 'cat_nontechnical_image' },
                                                { label: 'Workshop', key: 'cat_workshop_image' }
                                            ].map(cat => (
                                                <div key={cat.key} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{cat.label}</label>
                                                    <div className="h-40 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[cat.key])} alt={cat.label} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={imageValues[cat.key] || ''}
                                                            onChange={(e) => setImageValues({ ...imageValues, [cat.key]: e.target.value })}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-blue-500 outline-none transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => saveConfig(cat.key, imageValues[cat.key], 'image')}
                                                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                                                            title="Save Image URL"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Department Images */}
                                    <section>
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
                                            Department Images
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {[
                                                'AIDS', 'CIVIL', 'CSD-CST', 'CSE', 'EEE', 'ECE', 'IT', 'MECH', 'MBA', 'MCA', 'CSECS', 'ETE-VLSI'
                                            ].map(code => (
                                                <div key={code} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{code}</label>
                                                    <div className="h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[`dept_${code}_image`])} alt={code} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={imageValues[`dept_${code}_image`] || ''}
                                                            onChange={(e) => setImageValues({ ...imageValues, [`dept_${code}_image`]: e.target.value })}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-purple-500 outline-none transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => saveConfig(`dept_${code}_image`, imageValues[`dept_${code}_image`], 'image')}
                                                            className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg transition-colors"
                                                            title="Save Image URL"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="max-w-4xl animate-fadeIn space-y-8">
                                    {/* About Content */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Dhruva Content</h3>
                                            <textarea
                                                value={aboutContent}
                                                onChange={(e) => setAboutContent(e.target.value)}
                                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                                placeholder="Enter About Page content here..."
                                            />
                                            <button onClick={() => saveConfig('about_content', aboutContent)} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save Dhruva Content
                                            </button>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold mb-4">About KCE Content</h3>
                                            <textarea
                                                value={aboutKceContent}
                                                onChange={(e) => setAboutKceContent(e.target.value)}
                                                className="w-full h-64 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                                placeholder="Enter About KCE content here..."
                                            />
                                            <button onClick={() => saveConfig('about_kce_content', aboutKceContent)} className="mt-4 bg-purple-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save KCE Content
                                            </button>
                                        </div>
                                    </div>

                                    {/* Images Configuration */}
                                    <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Dhruva Logo */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Dhruva Logo</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5">
                                                <img src={getImageUrl(aboutLogo)} alt="Dhruva Logo" style={{ maxWidth: aboutLogoWidth }} className="max-h-full object-contain" />
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Logo URL/Path</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutLogo}
                                                            onChange={(e) => setAboutLogo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Logo Width (e.g., 150px)</label>
                                                    <input
                                                        value={aboutLogoWidth}
                                                        onChange={(e) => setAboutLogoWidth(e.target.value)}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                    />
                                                </div>
                                                <button onClick={() => {
                                                    saveConfig('about_logo', aboutLogo, 'image');
                                                    saveConfig('about_logo_width', aboutLogoWidth, 'text');
                                                }} className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                    Save Logo Settings
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dhruva Video */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">Dhruva Video (Optional)</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5 overflow-hidden">
                                                {aboutVideo ? (
                                                    <video src={getImageUrl(aboutVideo)} className="w-full h-full object-contain" autoPlay muted loop />
                                                ) : (
                                                    <div className="text-gray-500 italic">No video set</div>
                                                )}
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Video URL (mp4, webm)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutVideo}
                                                            onChange={(e) => setAboutVideo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                            placeholder="Paste video URL"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveConfig('about_video', aboutVideo, 'video')} className="flex-1 bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                        Save Video URL
                                                    </button>
                                                    {aboutVideo && (
                                                        <button onClick={() => { setAboutVideo(''); saveConfig('about_video', '', 'video'); }} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/50">
                                                            Remove Video
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 italic">If set, this video will be displayed instead of the logo on the About page.</p>
                                            </div>
                                        </div>

                                        {/* KCE Image */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">KCE Image</h3>
                                            <div className="mb-4 bg-white p-6 rounded-2xl flex items-center justify-center w-full aspect-video shadow-inner">
                                                <img src={getImageUrl(aboutKceImage)} alt="KCE" className="max-h-full max-w-full object-contain" />
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div className="flex gap-2">
                                                    <input
                                                        value={aboutKceImage}
                                                        onChange={(e) => setAboutKceImage(e.target.value)}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                        placeholder="Image URL"
                                                    />
                                                </div>
                                                <button onClick={() => saveConfig('about_kce_image', aboutKceImage, 'image')} className="bg-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                    Save KCE Image
                                                </button>
                                            </div>
                                        </div>

                                        {/* KCE Video */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">KCE Video (Optional)</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-2xl flex items-center justify-center w-full aspect-video border border-white/5 overflow-hidden">
                                                {aboutKceVideo ? (
                                                    <video src={getImageUrl(aboutKceVideo)} className="w-full h-full object-contain" autoPlay muted loop />
                                                ) : (
                                                    <div className="text-gray-500 italic">No video set</div>
                                                )}
                                            </div>
                                            <div className="space-y-4 font-serif">
                                                <div>
                                                    <label className="block text-sm text-gray-400 mb-1">Video URL (mp4, webm)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={aboutKceVideo}
                                                            onChange={(e) => setAboutKceVideo(e.target.value)}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                            placeholder="Paste video URL"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => saveConfig('about_kce_video', aboutKceVideo, 'video')} className="flex-1 bg-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                        Save Video URL
                                                    </button>
                                                    {aboutKceVideo && (
                                                        <button onClick={() => { setAboutKceVideo(''); saveConfig('about_kce_video', '', 'video'); }} className="bg-red-600/20 text-red-500 px-4 py-2 rounded-lg font-bold text-sm border border-red-500/50">
                                                            Remove Video
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 italic">If set, this video will be displayed instead of the KCE image on the About page.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'rules' && (
                                <div className="max-w-4xl animate-fadeIn">
                                    <textarea
                                        value={rules}
                                        onChange={(e) => setRules(e.target.value)}
                                        className="w-full h-96 bg-black/20 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter Rules & Regulations here..."
                                    />
                                    <button onClick={() => saveConfig('rules_content', rules)} className="mt-4 bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <Save size={18} /> Save Rules
                                    </button>

                                    <div className="mt-8 border-t border-white/10 pt-8">
                                        <h4 className="text-xl font-bold mb-4">Rules Background Image</h4>
                                        {rulesBg && (
                                            <div className="mb-4">
                                                <img src={getImageUrl(rulesBg)} alt="Rules Bg" className="w-full h-48 object-cover rounded-xl" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <input
                                                value={rulesBg}
                                                onChange={(e) => setRulesBg(e.target.value)}
                                                onBlur={() => saveConfig('rules_bg', rulesBg, 'image')}
                                                placeholder="Background Image URL"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="max-w-xl space-y-6 animate-fadeIn">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                            <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none" />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Phone Numbers</label>
                                            <div className="space-y-2">
                                                {contactPhones.map((phone, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <input
                                                            value={phone}
                                                            onChange={(e) => {
                                                                const newPhones = [...contactPhones];
                                                                newPhones[index] = e.target.value;
                                                                setContactPhones(newPhones);
                                                            }}
                                                            placeholder={`Phone Number ${index + 1}`}
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                                                        />
                                                        {contactPhones.length > 1 && (
                                                            <button
                                                                onClick={() => setContactPhones(contactPhones.filter((_, i) => i !== index))}
                                                                className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => setContactPhones([...contactPhones, ''])}
                                                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-bold mt-2"
                                                >
                                                    <Plus size={16} /> Add Another Number
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-1">Office Address</label>
                                            <textarea value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Address" rows="3" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none" />
                                        </div>

                                        <button onClick={() => {
                                            saveConfig('contact_email', contact.email);
                                            saveConfig('contact_phones', contactPhones.filter(p => p.trim() !== '').join(', '));
                                            saveConfig('contact_address', contact.address);
                                        }} className="bg-blue-600 px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 w-full mt-4 hover:bg-blue-500 transition-all">
                                            <Save size={18} /> Save Contact Details
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'footer' && (
                                <div className="max-w-4xl animate-fadeIn space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Desktop Video */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                            <h3 className="text-xl font-bold mb-2">Desktop Footer Background</h3>
                                            <div className="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                                                {footerBgVideo ? (
                                                    /\.(mp4|webm|ogg)$/i.test(footerBgVideo) ? (
                                                        <video src={getImageUrl(footerBgVideo)} className="w-full h-full object-cover opacity-50" muted />
                                                    ) : (
                                                        <img src={getImageUrl(footerBgVideo)} className="w-full h-full object-cover opacity-50" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No media set</div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={footerBgVideo}
                                                    onChange={(e) => setFooterBgVideo(e.target.value)}
                                                    placeholder="Enter Video/Image URL"
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                                                />
                                                <button
                                                    onClick={() => saveConfig('footer_bg_video', footerBgVideo, 'video')}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">This background will be used for desktop screens.</p>
                                        </div>

                                        {/* Mobile Video */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                            <h3 className="text-xl font-bold mb-2 text-purple-400">Mobile Footer Background</h3>
                                            <div className="aspect-[9/16] max-h-64 mx-auto bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                                                {footerBgVideoMobile ? (
                                                    /\.(mp4|webm|ogg)$/i.test(footerBgVideoMobile) ? (
                                                        <video src={getImageUrl(footerBgVideoMobile)} className="w-full h-full object-cover opacity-50" muted />
                                                    ) : (
                                                        <img src={getImageUrl(footerBgVideoMobile)} className="w-full h-full object-cover opacity-50" />
                                                    )
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No media set</div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    value={footerBgVideoMobile}
                                                    onChange={(e) => setFooterBgVideoMobile(e.target.value)}
                                                    placeholder="Enter Mobile Video URL"
                                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg p-3 focus:border-purple-500 outline-none"
                                                />
                                                <button
                                                    onClick={() => saveConfig('footer_bg_video_mobile', footerBgVideoMobile, 'video')}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 rounded-lg transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">This background will be used specifically for mobile screens.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {['sponsors', 'clubs'].includes(activeTab) && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                                    {/* List */}
                                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(activeTab === 'sponsors' ? sponsors : clubs).map(item => (
                                            <div key={item._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4 group">
                                                <img
                                                    src={getImageUrl(item.logo)}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-contain rounded-lg bg-black/20 p-1"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=Logo'; }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-bold">{item.name}</h3>
                                                    {activeTab === 'sponsors' && (
                                                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                                                            {item.tier || 'Silver'}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setEditingItem(item); setItemForm(item); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"><Pencil size={14} /></button>
                                                    <button onClick={() => deleteItem(item._id, activeTab === 'sponsors' ? 'sponsor' : 'club')} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Form */}
                                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                        <h3 className="font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New'}</h3>
                                        <form onSubmit={(e) => handleItemSubmit(e, activeTab === 'sponsors' ? 'sponsor' : 'club')} className="space-y-4">
                                            <input
                                                value={itemForm.name}
                                                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                                placeholder="Name"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                required
                                            />

                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <LinkIcon size={16} className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={itemForm.logo || ''}
                                                    onChange={(e) => setItemForm({ ...itemForm, logo: e.target.value })}
                                                    placeholder="Logo URL"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                                                    required
                                                />
                                            </div>

                                            {activeTab === 'sponsors' && (
                                                <div>
                                                    <label className="block text-xs text-gray-400 mb-1">Sponsor Tier</label>
                                                    <select
                                                        value={itemForm.tier || 'Silver'}
                                                        onChange={(e) => setItemForm({ ...itemForm, tier: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:border-blue-500 outline-none"
                                                    >
                                                        <option value="Title">Title Sponsor</option>
                                                        <option value="Platinum">Platinum Sponsor</option>
                                                        <option value="Gold">Gold Sponsor</option>
                                                        <option value="Silver">Silver Sponsor</option>
                                                        <option value="Associate">Associate Sponsor</option>
                                                    </select>
                                                </div>
                                            )}


                                            <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">Save</button>
                                            {editingItem && (
                                                <button type="button" onClick={() => { setEditingItem(null); setItemForm({ name: '', logo: '', description: '', tier: 'Silver' }); }} className="w-full bg-gray-600 py-2 rounded-lg font-bold mt-2">Cancel</button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pastEvents' && (
                                <div className="space-y-12 animate-fadeIn">
                                    {/* Static Content Configuration */}
                                    <div className="max-w-4xl space-y-6">
                                        <h3 className="text-xl font-bold border-b border-white/10 pb-2">Page Content</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">General Description</label>
                                                <textarea
                                                    value={pastEventDesc}
                                                    onChange={(e) => setPastEventDesc(e.target.value)}
                                                    placeholder="Enter general description like 'KCE Dhruva Events Join us...'"
                                                    rows="4"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Subheading</label>
                                                <input
                                                    value={pastEventSubheading}
                                                    onChange={(e) => setPastEventSubheading(e.target.value)}
                                                    placeholder="e.g. Unleash Your Potential at Dhruva"
                                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {pastEventHighlights.map((highlight, idx) => (
                                                    <div key={idx}>
                                                        <label className="block text-sm text-gray-400 mb-1">Highlight {idx + 1}</label>
                                                        <input
                                                            value={highlight}
                                                            onChange={(e) => {
                                                                const newHighlights = [...pastEventHighlights];
                                                                newHighlights[idx] = e.target.value;
                                                                setPastEventHighlights(newHighlights);
                                                            }}
                                                            placeholder={`Highlight ${idx + 1}`}
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <button onClick={() => {
                                                saveConfig('past_event_desc', pastEventDesc);
                                                saveConfig('past_event_subheading', pastEventSubheading);
                                                saveConfig('past_highlight_1', pastEventHighlights[0]);
                                                saveConfig('past_highlight_2', pastEventHighlights[1]);
                                                saveConfig('past_highlight_3', pastEventHighlights[2]);
                                                saveConfig('past_highlight_4', pastEventHighlights[3]);
                                            }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                                <Save size={18} /> Save Page Content
                                            </button>
                                        </div>
                                    </div>

                                    {/* Event Gallery Management */}
                                    <div>
                                        <h3 className="text-xl font-bold border-b border-white/10 pb-4 mb-6">Gallery Images</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* List */}
                                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {pastEvents.map(event => (
                                                    <div key={event._id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-4 group">
                                                        <div className="relative h-64 rounded-lg overflow-hidden">
                                                            <img src={getImageUrl(event.image)} alt={event.title} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <h3 className="font-bold text-white text-xl">{event.title}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button onClick={() => { setEditingPastEvent(event); setPastEventForm({ title: event.title, image: event.image, description: event.description || '' }); }} className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded hover:bg-blue-500/30 transition-colors flex justify-center"><Pencil size={16} /></button>
                                                            <button onClick={() => handlePastEventDelete(event._id)} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded hover:bg-red-500/30 transition-colors flex justify-center"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Form */}
                                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl h-fit sticky top-8">
                                                <h3 className="font-bold mb-4">{editingPastEvent ? 'Edit Event' : 'Add New Event'}</h3>
                                                <form onSubmit={handlePastEventSubmit} className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Event Title</label>
                                                        <input
                                                            value={pastEventForm.title}
                                                            onChange={(e) => setPastEventForm({ ...pastEventForm, title: e.target.value })}
                                                            placeholder="e.g. Hackathon 2024"
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="relative">
                                                        <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                <LinkIcon size={16} className="text-gray-500" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={pastEventForm.image || ''}
                                                                onChange={(e) => setPastEventForm({ ...pastEventForm, image: e.target.value })}
                                                                placeholder="https://..."
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
                                                                required
                                                                autoComplete="off"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs text-gray-400 mb-1">Short Description (Optional)</label>
                                                        <textarea
                                                            value={pastEventForm.description || ''}
                                                            onChange={(e) => setPastEventForm({ ...pastEventForm, description: e.target.value })}
                                                            placeholder="Event description..."
                                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-sm"
                                                            rows="2"
                                                        />
                                                    </div>



                                                    <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">
                                                        {editingPastEvent ? 'Update Event' : 'Add Event'}
                                                    </button>
                                                    {editingPastEvent && (
                                                        <button type="button" onClick={() => { setEditingPastEvent(null); setPastEventForm({ title: '', image: '', description: '' }); }} className="w-full bg-gray-600 py-2 rounded-lg font-bold mt-2">Cancel</button>
                                                    )}
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main >
            </div >
        </div >
    );
};

export default ManageContent;
