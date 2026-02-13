import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, X, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import { API_URL } from '../utils/config';

const ManagePasses = () => {
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentPass, setCurrentPass] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: 'Individual',
        perks: [''],
        color: 'Orange',
        isActive: true
    });

    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchPasses();
    }, []);

    const fetchPasses = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/passes`);
            setPasses(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handlePerkChange = (index, value) => {
        const newPerks = [...formData.perks];
        newPerks[index] = value;
        setFormData({ ...formData, perks: newPerks });
    };

    const addPerk = () => {
        setFormData({ ...formData, perks: [...formData.perks, ''] });
    };

    const removePerk = (index) => {
        const newPerks = formData.perks.filter((_, i) => i !== index);
        setFormData({ ...formData, perks: newPerks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentPass) {
                await axios.put(`${API_URL}/passes/${currentPass._id}`, formData, config);
            } else {
                await axios.post(`${API_URL}/passes`, formData, config);
            }
            setShowModal(false);
            fetchPasses();
        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || error.message || 'Error saving pass';
            alert(`Error: ${errMsg}`);
        }
    };

    const handleEdit = (pass) => {
        setCurrentPass(pass);
        setFormData({
            name: pass.name,
            price: pass.price,
            type: pass.type || 'Individual',
            perks: pass.perks || [''],
            color: pass.color || 'orange',
            isActive: pass.isActive ?? true
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this pass?')) {
            try {
                await axios.delete(`${API_URL}/passes/${id}`, config);
                alert('Pass deleted successfully');
                fetchPasses();
            } catch (error) {
                console.error(error);
                const errMsg = error.response?.data?.message || error.message || 'Error deleting pass';
                alert(`Error: ${errMsg}`);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-white font-inter flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 lg:ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Passes</h1>
                    <button onClick={() => { setCurrentPass(null); setFormData({ name: '', price: '', type: 'Individual', perks: [''], color: 'orange', isActive: true }); setShowModal(true); }} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                        <Plus size={20} /> Add Pass
                    </button>
                </div>

                {loading ? <Loader /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {passes.map(pass => (
                            <div key={pass._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold">{pass.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${pass.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {pass.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="text-3xl font-bold mb-4 text-orange-400">₹{pass.price}/-</div>
                                <p className="text-gray-400 text-sm mb-4">{pass.type}</p>
                                <div className="space-y-2 mb-6 h-32 overflow-y-auto">
                                    {pass.perks?.map((perk, i) => (
                                        <div key={i} className="text-sm text-gray-500">• {perk}</div>
                                    ))}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleEdit(pass)} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg border border-white/10 flex justify-center gap-2"><Edit size={16} /> Edit</button>
                                    <button onClick={() => handleDelete(pass._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 border border-red-500/10"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/10 p-6 custom-scrollbar">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{currentPass ? 'Edit Pass' : 'Create Pass'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="Pass Name" className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
                            <input name="price" type="text" value={formData.price} onChange={handleChange} placeholder="Price (e.g. 500 or 500/1000)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3" required />
                            {/* <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 [&>option]:bg-[#1a1a1a]">
                                <option value="Individual">Individual</option>
                                <option value="Group">Group</option>
                                <option value="All-Access">All-Access</option>
                            </select> */}
                            <select name="color" value={formData.color} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 [&>option]:bg-[#1a1a1a]">
                                <option value="orange">Orange</option>
                                <option value="yellow">Yellow</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="purple">Purple</option>
                                <option value="pink">Pink</option>
                            </select>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Perks</label>
                                {formData.perks.map((perk, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input value={perk} onChange={(e) => handlePerkChange(index, e.target.value)} placeholder="Perk" className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm" />
                                        <button type="button" onClick={() => removePerk(index)} className="p-2 text-red-400 hover:bg-red-500/10 rounded"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addPerk} className="text-orange-400 text-sm font-medium hover:underline">+ Add Perk</button>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 rounded border-white/10 bg-white/5 text-orange-600" />
                                <span className="text-sm">Active</span>
                            </label>

                            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-all">
                                {currentPass ? 'Update Pass' : 'Create Pass'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePasses;
