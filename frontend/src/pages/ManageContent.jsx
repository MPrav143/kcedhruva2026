import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { getImageUrl } from '../utils/imageUtils';
import { Save, Plus, Trash2, Pencil, Link as LinkIcon } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';

const ManageContent = () => {
    const { refreshConfig, config: siteConfig } = useGlobalConfig();
    const [activeTab, setActiveTab] = useState('general');
    const [rules, setRules] = useState(''); // Keeping state to avoid breakage if referenced, but UI removed
    const [aboutContent, setAboutContent] = useState('');
    const [aboutKceContent, setAboutKceContent] = useState('');
    const [aboutKceImage, setAboutKceImage] = useState('');
    const [aboutLogo, setAboutLogo] = useState('');
    const [aboutLogoWidth, setAboutLogoWidth] = useState('');
    const [aboutHeroBg, setAboutHeroBg] = useState('');

    const [contact, setContact] = useState({ email: '', phone: '', address: '' });
    const [rulesBg, setRulesBg] = useState('');
    const [generalConfig, setGeneralConfig] = useState({ website_name: 'Dhruva', event_year: '2025' });
    const [sponsors, setSponsors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    // New State for Content Structure
    const [pastEventDesc, setPastEventDesc] = useState('');
    const [pastEventSubheading, setPastEventSubheading] = useState('');
    const [pastEventHighlights, setPastEventHighlights] = useState(['', '', '', '']);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

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
            setContact({
                email: confRes.data['contact_email'] || '',
                phone: confRes.data['contact_phone'] || '',
                address: confRes.data['contact_address'] || ''
            });

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
                event_year: confRes.data['event_year'] || '2025'
            });

            setSponsors(sponsorsRes.data);
            setClubs(clubsRes.data);
            setPastEvents(pastEventsRes.data);
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
    const saveConfig = async (key, value) => {
        try {
            await axios.post(`${API_URL}/content/config`, { key, value }, config);
            alert('Saved successfully!');
            refreshConfig(); // Refresh global context
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error saving');
        }
    };

    // --- GENERIC LIST HANDLER (Sponsors/Clubs) ---
    const [itemForm, setItemForm] = useState({ name: '', logo: '', description: '' });
    const [editingItem, setEditingItem] = useState(null);

    const handleItemSubmit = async (e, type) => {
        e.preventDefault();
        try {
            let logoUrl = getEmbedLink(itemForm.logo);
            const payload = { ...itemForm, logo: logoUrl };
            if (editingItem) {
                await axios.put(`${API_URL}/content/${type}s/${editingItem._id}`, payload, config);
            } else {
                await axios.post(`${API_URL}/content/${type}s`, payload, config);
            }
            setItemForm({ name: '', logo: '', description: '' });
            setEditingItem(null);
            refreshConfig();
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error saving item');
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
                await axios.put(`${API_URL}/content/pastEvents/${editingPastEvent._id}`, payload, config);
            } else {
                await axios.post(`${API_URL}/content/pastEvents`, payload, config);
            }
            setPastEventForm({ title: '', image: '', description: '' });
            setEditingPastEvent(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error saving past event');
        }
    };

    const handlePastEventDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await axios.delete(`${API_URL}/content/pastEvents/${id}`, config);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };



    const deleteItem = async (id, type) => {
        if (window.confirm('Delete this item?')) {
            await axios.delete(`${API_URL}/content/${type}s/${id}`, config);
            refreshConfig(); // Refresh global context
            fetchData();
        }
    }

    const tabs = [
        { id: 'general', label: 'General Info' },
        { id: 'home_media', label: 'Home Media' },
        { id: 'contact', label: 'Contact Details' },
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

                                    <button onClick={() => {
                                        saveConfig('website_name', generalConfig.website_name);
                                        saveConfig('event_year', generalConfig.event_year);
                                    }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <Save size={18} /> Save General Info
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
                                                { label: 'Sports', key: 'cat_sports_image' }
                                            ].map(cat => (
                                                <div key={cat.key} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{cat.label}</label>
                                                    <div className="h-40 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[cat.key])} alt={cat.label} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            defaultValue={siteConfig?.[cat.key] || ''}
                                                            onBlur={(e) => saveConfig(cat.key, e.target.value)}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-blue-500 outline-none transition-colors"
                                                        />
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
                                                'AIDS', 'CIVIL', 'CSD', 'CSE', 'EEE', 'ECE', 'IT', 'MECH', 'MBA', 'MCA'
                                            ].map(code => (
                                                <div key={code} className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
                                                    <label className="block text-sm font-bold text-gray-400">{code}</label>
                                                    <div className="h-32 bg-black/40 rounded-xl overflow-hidden border border-white/5">
                                                        <img src={getImageUrl(siteConfig?.[`dept_${code}_image`])} alt={code} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input
                                                            defaultValue={siteConfig?.[`dept_${code}_image`] || ''}
                                                            onBlur={(e) => saveConfig(`dept_${code}_image`, e.target.value)}
                                                            placeholder="Paste Image URL"
                                                            className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-xs text-gray-500 focus:text-white focus:border-purple-500 outline-none transition-colors"
                                                        />
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
                                            <div className="mb-4 bg-white/5 p-4 rounded-xl flex items-center justify-center">
                                                <img src={getImageUrl(aboutLogo)} alt="Dhruva Logo" style={{ width: aboutLogoWidth }} className="object-contain" />
                                            </div>
                                            <div className="space-y-4">
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
                                                    saveConfig('about_logo', aboutLogo);
                                                    saveConfig('about_logo_width', aboutLogoWidth);
                                                }} className="bg-blue-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                    Save Logo Settings
                                                </button>
                                            </div>
                                        </div>

                                        {/* KCE Image */}
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">KCE Image</h3>
                                            <div className="mb-4 bg-white/5 p-4 rounded-xl flex items-center justify-center">
                                                <img src={getImageUrl(aboutKceImage)} alt="KCE" className="max-h-48 object-cover rounded" />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex gap-2">
                                                    <input
                                                        value={aboutKceImage}
                                                        onChange={(e) => setAboutKceImage(e.target.value)}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2"
                                                        placeholder="Image URL"
                                                    />
                                                </div>
                                                <button onClick={() => saveConfig('about_kce_image', aboutKceImage)} className="bg-purple-600 px-4 py-2 rounded-lg font-bold text-sm">
                                                    Save KCE Image
                                                </button>
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
                                                onBlur={() => saveConfig('rules_bg', rulesBg)}
                                                placeholder="Background Image URL"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg p-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'contact' && (
                                <div className="max-w-xl space-y-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                                        <input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded-lg p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                                        <input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="Phone" className="w-full bg-black/20 border border-white/10 rounded-lg p-3" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Address</label>
                                        <textarea value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} placeholder="Address" className="w-full bg-black/20 border border-white/10 rounded-lg p-3" />
                                    </div>

                                    <button onClick={() => {
                                        saveConfig('contact_email', contact.email);
                                        saveConfig('contact_phone', contact.phone);
                                        saveConfig('contact_address', contact.address);
                                    }} className="bg-blue-600 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                        <Save size={18} /> Save Contact Info
                                    </button>
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
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=Logo'; }}
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-bold">{item.name}</h3>
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


                                            <button type="submit" className="w-full bg-blue-600 py-2 rounded-lg font-bold">Save</button>
                                            {editingItem && (
                                                <button type="button" onClick={() => { setEditingItem(null); setItemForm({ name: '', logo: '', description: '' }); }} className="w-full bg-gray-600 py-2 rounded-lg font-bold mt-2">Cancel</button>
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
