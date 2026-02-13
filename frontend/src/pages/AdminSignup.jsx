import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Building, Briefcase, ChevronDown } from 'lucide-react';
import { API_URL } from '../utils/config';

const AdminSignup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
        department: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username.endsWith('@kce.ac.in')) {
            setError('Email must end with @kce.ac.in');
            return;
        }

        if (formData.role === 'hod' && !formData.department) {
            setError('Department is required for HODs');
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/setup`, formData);

            // Auto login or redirect to login
            // For now, redirect to login with a success message (could use state or toast)
            alert('Signup successful! Please login.');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            Create Account
                        </h2>
                        <p className="text-gray-400 mt-2">For Faculty & Administration</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg mb-4 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="relative group">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="email"
                                name="username"
                                placeholder="Email (@kce.ac.in)"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative group">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-gray-500"
                                required
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="relative group">
                            <Briefcase className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors z-10" />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all text-white appearance-none cursor-pointer"
                            >
                                <option value="admin" className="bg-gray-800">Dhruva Team (Admin)</option>
                                <option value="principal" className="bg-gray-800">Principal</option>
                                <option value="dean" className="bg-gray-800">Dean</option>
                                <option value="hod" className="bg-gray-800">HOD</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Department Selection (Conditional) */}
                        {formData.role === 'hod' && (
                            <div className="relative group animate-fade-in-down">
                                <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-yellow-400 transition-colors z-10" />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-white appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="" className="bg-gray-800">Select Department</option>
                                    <option value="CSE" className="bg-gray-800">CSE</option>
                                    <option value="ECE" className="bg-gray-800">ECE</option>
                                    <option value="EEE" className="bg-gray-800">EEE</option>
                                    <option value="MECH" className="bg-gray-800">MECH</option>
                                    <option value="CIVIL" className="bg-gray-800">CIVIL</option>
                                    <option value="IT" className="bg-gray-800">IT</option>
                                    <option value="AIDS" className="bg-gray-800">AIDS</option>
                                    <option value="CSBS" className="bg-gray-800">CSBS</option>
                                    {/* Add other departments as needed */}
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-900/20 transform active:scale-95"
                        >
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSignup;
