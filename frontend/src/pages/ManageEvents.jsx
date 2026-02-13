import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, X, Save, Edit, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import EventDetailsModal from '../components/EventDetailsModal';

import { useParams, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { DEPARTMENTS, CULTURAL_SUBCATEGORIES } from '../utils/constants';

const ManageEvents = () => {
    const { category, subcategory } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedDetailsEvent, setSelectedDetailsEvent] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        venue: '',
        eventType: 'Normal', // Added eventType for specific classification
        category: 'Technical',
        department: '',
        club: '',
        image: '',
        pptTemplateUrl: '',
        rounds: '',
        rules: '',
        fromTime: '', // Added fromTime
        toTime: '',   // Added toTime
        winnerPrize: '', // Added winner prize
        runnerPrize: '', // Added runner prize
        artistName: '', // Added artistName
        facultyCoordinators: [{ name: '', phone: '' }],
        studentCoordinators: [{ name: '', phone: '' }]
    });

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchEvents();
    }, [category, subcategory]); // Re-fetch or re-filter when params change

    const fetchEvents = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/events');
            setEvents(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Filter events based on URL params and search
    const filteredEvents = events.filter(e => {
        // Category Filter
        if (category && e.category !== category) return false;

        // Subcategory Filter (Department or Club depending on context)
        // For Technical, subcategory is usually department
        // For Cultural, it could be 'OnStage' / 'OffStage' which might be stored in department or category?
        // Let's assume subcategory maps to 'department' field for now as per Sidebar links
        if (subcategory && subcategory !== 'All' && e.department !== subcategory && e.eventType !== subcategory) return false;

        // Search Filter
        return e.title.toLowerCase().includes(searchTerm.toLowerCase());
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);
            const { data } = await axios.post('http://localhost:5000/api/upload/generic/file', formDataUpload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, image: data.url }));
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error(error);
            alert('Error uploading image');
        }
    };

    const handleCoordinatorChange = (index, field, value, type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        const newCoordinators = [...formData[listName]];
        newCoordinators[index][field] = value;
        setFormData({ ...formData, [listName]: newCoordinators });
    };

    const addCoordinator = (type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        setFormData({ ...formData, [listName]: [...formData[listName], { name: '', phone: '' }] });
    };

    const removeCoordinator = (index, type) => {
        const listName = type === 'faculty' ? 'facultyCoordinators' : 'studentCoordinators';
        const newCoordinators = formData[listName].filter((_, i) => i !== index);
        setFormData({ ...formData, [listName]: newCoordinators });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Construct a fallback timings string if needed, or backend can handle it.
            // But let's keep data consistent if we want to support both.
            const payload = {
                ...formData,
                timings: `${formData.fromTime} - ${formData.toTime}`
            };

            if (currentEvent) {
                await axios.put(`http://localhost:5000/api/events/${currentEvent._id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/events', payload, config);
            }
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error(error);
            alert('Error saving event');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`http://localhost:5000/api/events/${id}`, config);
                fetchEvents();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);

        // Attempt to split legacy timings if fromTime/toTime are missing
        let fromTime = event.fromTime || '';
        let toTime = event.toTime || '';

        if (!fromTime && !toTime && event.timings && event.timings.includes('-')) {
            const parts = event.timings.split('-').map(p => p.trim());
            if (parts.length === 2) {
                fromTime = parts[0];
                toTime = parts[1];
            }
        }

        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split('T')[0],
            venue: event.venue,
            category: event.category,
            eventType: event.eventType || 'Normal',
            department: event.department || '',
            club: event.club || '',
            image: event.image,
            pptTemplateUrl: event.pptTemplateUrl || '',
            rounds: event.rounds || '',
            rules: event.rules || '',
            fromTime: fromTime,
            toTime: toTime,
            winnerPrize: event.winnerPrize || '',
            runnerPrize: event.runnerPrize || '',
            artistName: event.artistName || '',
            facultyCoordinators: event.facultyCoordinators && event.facultyCoordinators.length > 0
                ? event.facultyCoordinators
                : [{ name: '', phone: '' }],
            studentCoordinators: event.studentCoordinators && event.studentCoordinators.length > 0
                ? event.studentCoordinators
                : event.coordinators && event.coordinators.length > 0 // Fallback for legacy data
                    ? event.coordinators
                    : [{ name: '', phone: '' }]
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            venue: '',
            category: category || 'Technical',
            eventType: category === 'Technical' ? 'Normal' : (category === 'Cultural' ? 'Cultural' : 'Sports'),
            department: subcategory && subcategory !== 'All' ? subcategory : '',
            club: '',
            image: '',
            pptTemplateUrl: '',
            rounds: '',
            rules: '',
            fromTime: '',
            toTime: '',
            winnerPrize: '',
            runnerPrize: '',
            artistName: '',
            facultyCoordinators: [{ name: '', phone: '' }],
            studentCoordinators: [{ name: '', phone: '' }]
        });
    };

    const openModal = () => {
        resetForm();
        setShowModal(true);
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                {subcategory ? `${subcategory} Events` : category ? `${category} Events` : 'Manage Events'}
                            </h1>
                            <div className="text-gray-400 mt-1 flex items-center gap-2 text-sm">
                                {category && <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">{category}</span>}
                                {subcategory && <span>/</span>}
                                {subcategory && <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">{subcategory}</span>}
                            </div>
                        </div>
                        <button onClick={openModal} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-blue-900/20 transition-all">
                            <Plus size={20} /> Add {subcategory && subcategory !== 'All' ? subcategory : category || ''} Event
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <Loader text="Loading events..." />
                    ) : filteredEvents.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            No events found in {subcategory || category}.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map(event => (
                                <div key={event._id} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={getImageUrl(event.image) || 'https://via.placeholder.com/400x200?text=No+Image'}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20">
                                            {event.department || event.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex gap-3 mt-auto lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex-wrap">
                                            <button onClick={() => setSelectedDetailsEvent(event)} className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2 rounded-lg transition-colors border border-blue-500/20 text-sm font-medium mb-1">
                                                <ExternalLink size={16} /> View Participants
                                            </button>
                                            <button onClick={() => handleEdit(event)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors border border-white/10 text-sm font-medium">
                                                <Edit size={16} /> Edit
                                            </button>
                                            <button onClick={() => handleDelete(event._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors border border-red-500/20 text-sm font-medium">
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl custom-scrollbar">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#1a1a1a] z-10">
                            <h2 className="text-2xl font-bold text-white">{currentEvent ? 'Edit Event' : 'Create New Event'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white">
                                        <option value="Technical">Technical</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Hackathon">Hackathon</option>
                                        <option value="Ideathon">Ideathon</option>
                                        <option value="Paper Presentation">Paper Presentation</option>
                                        <option value="Project Presentation">Project Presentation</option>
                                        <option value="Live-In Concert">Live-In Concert</option>
                                    </select>



                                    {/* Department Field - Always show if Technical or if subcategory maps to it */}
                                    {/* Department Field - Conditional Rendering based on Category */}
                                    {formData.category === 'Technical' ? (
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                            required
                                        >
                                            <option value="">Select Department</option>
                                            {DEPARTMENTS.map(dept => (
                                                <option key={dept.code} value={dept.code}>
                                                    {dept.code} - {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : formData.category === 'Cultural' ? (
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors [&>option]:bg-[#1a1a1a] [&>option]:text-white"
                                            required
                                        >
                                            <option value="">Select Stage Type</option>
                                            {CULTURAL_SUBCATEGORIES.map(sub => (
                                                <option key={sub.code} value={sub.code}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            placeholder="Department / Sub-type"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    )}

                                    {/* Club Field - Hide if Technical */}
                                    {formData.category !== 'Technical' && (
                                        <input name="club" value={formData.club} onChange={handleChange} placeholder="Club Name (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    )}

                                    {/* Artist Name - Show for Live-In Concert */}
                                    {formData.category === 'Live-In Concert' && (
                                        <input name="artistName" value={formData.artistName} onChange={handleChange} placeholder="Artist / Band Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    )}

                                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors text-white" required />
                                    <input name="venue" value={formData.venue} onChange={handleChange} placeholder="Venue" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="fromTime" value={formData.fromTime} onChange={handleChange} placeholder="From Time (e.g. 10:00 AM)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                        <input name="toTime" value={formData.toTime} onChange={handleChange} placeholder="To Time (e.g. 04:00 PM)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="winnerPrize" value={formData.winnerPrize} onChange={handleChange} placeholder="Winner Prize (₹)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                        <input name="runnerPrize" value={formData.runnerPrize} onChange={handleChange} placeholder="Runner Prize (₹)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                <LinkIcon size={16} className="text-gray-500" />
                                            </div>
                                            <input
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                placeholder="Image URL (Drive link supported)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 focus:border-blue-500 outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className="flex-1 bg-white/5 border border-white/10 border-dashed rounded-xl p-2 text-center cursor-pointer hover:bg-white/10 transition-colors">
                                                <span className="text-xs text-gray-400">Or Upload Poster</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <LinkIcon size={16} className="text-gray-500" />
                                        </div>
                                        <input
                                            name="pptTemplateUrl"
                                            value={formData.pptTemplateUrl}
                                            onChange={handleChange}
                                            placeholder="PPT Template URL (Optional)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-3 focus:border-blue-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <textarea name="rounds" value={formData.rounds} onChange={handleChange} placeholder="Event Rounds (e.g. Round 1: MCQ, Round 2: Coding...)" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" required />
                                    <textarea name="rules" value={formData.rules} onChange={handleChange} placeholder="Rules" rows="3" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-blue-500 outline-none transition-colors" />
                                </div>
                            </div>

                            {/* Coordinators */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Faculty Coordinators */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-purple-400">Faculty Coordinators</h3>
                                    {formData.facultyCoordinators.map((coordinator, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <input value={coordinator.name} onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value, 'faculty')} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <input value={coordinator.phone} onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value, 'faculty')} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <button type="button" onClick={() => removeCoordinator(index, 'faculty')} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center justify-center"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addCoordinator('faculty')} className="w-full md:w-auto px-4 py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 font-medium text-sm transition-colors border border-purple-500/20">+ Add Faculty</button>
                                </div>

                                {/* Student Coordinators */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-blue-400">Student Coordinators</h3>
                                    {formData.studentCoordinators.map((coordinator, index) => (
                                        <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3 mb-4 p-3 bg-white/5 rounded-xl border border-white/5">
                                            <input value={coordinator.name} onChange={(e) => handleCoordinatorChange(index, 'name', e.target.value, 'student')} placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <input value={coordinator.phone} onChange={(e) => handleCoordinatorChange(index, 'phone', e.target.value, 'student')} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm" />
                                            <button type="button" onClick={() => removeCoordinator(index, 'student')} className="p-2.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 flex items-center justify-center"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addCoordinator('student')} className="w-full md:w-auto px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 font-medium text-sm transition-colors border border-blue-500/20">+ Add Student</button>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                                {currentEvent ? 'Update Event' : 'Create Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <EventDetailsModal event={selectedDetailsEvent} onClose={() => setSelectedDetailsEvent(null)} isAdminView={true} />
        </div>
    );
};

export default ManageEvents;
