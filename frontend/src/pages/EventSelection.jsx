import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { API_URL } from '../utils/config';

const EventSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pass } = location.state || {}; // Expect pass object
    const { config } = useGlobalConfig();

    const [formData, setFormData] = useState({
        studentName: '',
        rollNumber: '',
        email: '',
        phone: '',
        department: '',
        year: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!pass) {
            navigate('/passes');
        }
    }, [pass, navigate]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const { data: regData } = await axios.post(`${API_URL}/registrations`, {
                passId: pass._id,
                eventIds: [], // No specific events selected
                ...formData
            });

            // Razorpay Checkout
            const options = {
                key: window.RAZORPAY_KEY_ID || 'rzp_test_5h5Hk8zY9I1qV3',
                amount: Math.round((parseFloat(regData.amount.toString().split('/')[0]) || 0) * 100),
                currency: 'INR',
                name: `${config.website_name || 'Dhruva'} ${config.event_year || '2026'}`,
                description: `Payment for ${pass.name}`,
                handler: async function (response) {
                    try {
                        await axios.post(`${API_URL}/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            registrationId: regData.registrationId
                        });
                        alert('Payment Successful & Registration Confirmed!');
                        navigate('/');
                    } catch (err) {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.studentName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: '#3b82f6' }
            };

            // Order creation logic (optional/if enabled)
            try {
                const { data: order } = await axios.post(`${API_URL}/payment/order`, {
                    amount: regData.amount,
                    receipt: regData.registrationId
                });
                if (order && order.id) {
                    options.order_id = order.id;
                }
            } catch (err) {
                console.warn("Failed to create official order, proceeding.", err);
            }

            const rzp = new window.Razorpay(options);
            rzp.open();
            setSubmitting(false);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Registration failed');
            setSubmitting(false);
        }
    };

    if (!pass) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-inter flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-3xl mx-auto w-full px-4 pt-24 pb-12">
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-900/40 to-red-900/40 border border-orange-500/30 rounded-2xl text-center">
                    <h1 className="text-3xl font-bold mb-2">{pass.name} Registration</h1>
                    <p className="text-gray-300 mb-4">{pass.description}</p>
                    <div className="text-2xl font-bold text-orange-400">₹{pass.price}</div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-xl font-bold mb-6">Participant Details</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="studentName" value={formData.studentName} onChange={handleFormChange} required placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none" />
                            <input name="rollNumber" value={formData.rollNumber} onChange={handleFormChange} required placeholder="Roll Number" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="department"
                                value={formData.department}
                                onChange={handleFormChange}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none text-gray-400 [&>option]:bg-black"
                            >
                                <option value="">Select Dept</option>

                                {/* Core Engineering */}
                                <option value="AIDS">AIDS</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="CSD">CSD</option>
                                <option value="CSE">CSE</option>
                                <option value="CST">CST</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="EEE-VLSI">EEE-VLSI</option>
                                <option value="MECH">MECH</option>
                                <option value="IT">IT</option>
                                <option value="CHEM">CHEM</option>
                                <option value="BIOTECH">BIOTECH</option>

                                {/* Core Sciences */}
                                <option value="PHYSICS">Physics</option>
                                <option value="CHEMISTRY">Chemistry</option>
                                <option value="MATHEMATICS">Mathematics</option>
                                <option value="BIOLOGY">Biology</option>

                                {/* Commerce & Management */}
                                <option value="BCom">B.Com - Commerce</option>
                                <option value="BBA">BBA - Business Administration</option>
                                <option value="MBA">MBA - Master of Business Administration</option>

                            </select>

                            <select name="year" value={formData.year} onChange={handleFormChange} required className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none text-gray-400 [&>option]:bg-black">
                                <option value="">Select Year</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>

                        <input name="email" type="email" value={formData.email} onChange={handleFormChange} required placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none" />
                        <input name="phone" value={formData.phone} onChange={handleFormChange} required placeholder="Phone Number" className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 focus:border-orange-500 outline-none" />

                        <div className="pt-6 border-t border-white/10 mt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-orange-500/20"
                            >
                                {submitting ? 'Processing Payment...' : `Pay ₹${pass.price} & Register`}
                            </button>
                            <p className="text-gray-500 text-xs text-center mt-4">Safe & Secure Payment via Razorpay</p>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default EventSelection;
