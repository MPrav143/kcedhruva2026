import { useState, useEffect } from 'react';
import axios from 'axios';
import { Image as ImageIcon, Save, Loader as LoaderIcon, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getImageUrl } from '../utils/imageUtils';
import { API_URL } from '../utils/config';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';


const ManageImages = () => {
    const [configs, setConfigs] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});
    const [message, setMessage] = useState(null);
    const [inputs, setInputs] = useState({}); // Local state for inputs

    // Dynamic keys we want to manage
    const sections = [
        { key: 'navbar_logo', label: 'Navbar Logo', description: 'Small logo in the top navigation bar' },
        { key: 'home_hero_bg', label: 'Home Hero Background', description: 'Large background for the main hero section' },
        { key: 'footer_bg_video', label: 'Footer Background Video', description: 'Video background for the site footer (mp4/webm)' },
        // { key: 'home_about_img', label: 'Home About Image', description: 'Image for the "Experience the Extraordinary" section' },
        // { key: 'admin_dashboard_bg', label: 'Admin Dashboard Background', description: 'Background image for the admin dashboard' },
    ];

    useEffect(() => {
        fetchConfigs();
    }, []);

    const fetchConfigs = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/upload`);
            setConfigs(data);
            // Initialize inputs with fetched values
            const initialInputs = {};
            sections.forEach(s => {
                initialInputs[s.key] = data[s.key] || '';
            });
            setInputs(initialInputs);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };


    const handleInputChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key) => {
        setUpdating(prev => ({ ...prev, [key]: true }));
        setMessage(null);

        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const urlToSave = inputs[key];
            const isImageSection = sections.some(s => s.key === key); // Helper to determine type
            const type = isImageSection ? 'image' : 'text';

            await axios.post(`${API_URL}/content/config`, { key, value: urlToSave, type }, config);
            setConfigs(prev => ({ ...prev, [key]: urlToSave }));
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({ type: 'success', text: `Successfully updated ${key}` });
        } catch (error) {
            console.error(error);
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({ type: 'error', text: 'Update failed.' });
        }
    };

    const handleFileUpload = async (key, file) => {
        if (!file) return;
        setUpdating(prev => ({ ...prev, [key]: true }));
        setMessage(null);

        try {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('image', file);

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const { data } = await axios.post(`${API_URL}/upload/${key}`, formData, config);
            const imageUrl = data.data.value;

            setConfigs(prev => ({ ...prev, [key]: imageUrl }));
            setInputs(prev => ({ ...prev, [key]: imageUrl }));
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({ type: 'success', text: `Successfully uploaded and updated ${key}` });
        } catch (error) {
            console.error(error);
            setUpdating(prev => ({ ...prev, [key]: false }));
            setMessage({ type: 'error', text: 'Upload failed.' });
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
                    <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Manage Dynamic Images
                    </h2>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                            {message.text}
                        </div>
                    )}

                    {loading ? (
                        <Loader text="Loading configurations..." />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sections.map(section => (
                                <div key={section.key} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-white">{section.label}</h3>
                                            <p className="text-sm text-gray-400">{section.description}</p>
                                        </div>
                                        <ImageIcon className="text-blue-400 w-6 h-6" />
                                    </div>

                                    <div className="mb-4 bg-black/40 rounded-lg h-48 flex items-center justify-center overflow-hidden border border-white/5 relative group">
                                        {configs[section.key] ? (
                                            /\.(mp4|webm|ogg)$/i.test(configs[section.key]) ? (
                                                <video
                                                    src={getImageUrl(configs[section.key])}
                                                    className="w-full h-full object-cover"
                                                    controls
                                                />
                                            ) : (
                                                <img
                                                    src={getImageUrl(configs[section.key])}
                                                    alt={section.label}
                                                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'; }}
                                                />
                                            )
                                        ) : (
                                            <span className="text-gray-500 text-sm">No image set</span>
                                        )}
                                        {configs[section.key] && (
                                            <a
                                                href={configs[section.key]}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                    <LinkIcon size={16} className="text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={inputs[section.key] || ''}
                                                    onChange={(e) => handleInputChange(section.key, e.target.value)}
                                                    placeholder="Paste Image URL (Drive links supported)"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSave(section.key)}
                                                disabled={updating[section.key]}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Save URL"
                                            >
                                                {updating[section.key] ? <LoaderIcon size={18} className="animate-spin" /> : <Save size={18} />}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="flex-1 bg-white/5 border border-white/10 border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="text-xs text-gray-400">Or Click to Upload File</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*,video/*"
                                                    onChange={(e) => handleFileUpload(section.key, e.target.files[0])}
                                                    disabled={updating[section.key]}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ManageImages;
