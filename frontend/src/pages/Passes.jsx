import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { Ticket, CheckCircle, ArrowRight } from 'lucide-react';
import { API_URL } from '../utils/config';

const Passes = ({ embed = false }) => {
    const navigate = useNavigate();
    const [passes, setPasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState({ show: false, pass: null });

    useEffect(() => {
        const fetchPasses = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/passes`);
                setPasses(data.filter(p => p.isActive));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchPasses();
    }, []);

    // Advanced Color Mapping for Contrast
    // Returns: { bgClass, textPrimary, textSecondary, borderClass, iconClass }
    const getColorStyles = (color) => {
        switch (color) {
            case 'yellow':
                return {
                    bg: 'bg-gradient-to-br from-yellow-400 to-yellow-500',
                    border: 'border-yellow-600',
                    shadow: 'hover:shadow-yellow-500/30',
                    text: 'text-black',
                    subText: 'text-black/70',
                    icon: 'text-black'
                };
            // Default Gradients
            case 'orange':
            case 'blue': return { bg: 'bg-gradient-to-br from-orange-500 to-orange-600', border: 'border-orange-500/50', shadow: 'hover:shadow-orange-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'red': return { bg: 'bg-gradient-to-br from-rose-500 to-red-600', border: 'border-rose-500/50', shadow: 'hover:shadow-rose-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'green': return { bg: 'bg-gradient-to-br from-emerald-500 to-green-600', border: 'border-emerald-500/50', shadow: 'hover:shadow-emerald-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'purple': return { bg: 'bg-gradient-to-br from-violet-500 to-purple-600', border: 'border-violet-500/50', shadow: 'hover:shadow-violet-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };
            case 'pink': return { bg: 'bg-gradient-to-br from-fuchsia-500 to-pink-600', border: 'border-fuchsia-500/50', shadow: 'hover:shadow-fuchsia-500/30', text: 'text-black', subText: 'text-black', icon: 'text-black' };

            default: return { bg: 'bg-gradient-to-br from-cyan-700 to-cyan-800', border: 'border-gray-600', shadow: '', text: 'text-black', subText: 'text-black', icon: 'text-black' };
        }
    };

    return (
        <div className={`${!embed ? 'min-h-screen bg-[#0a0a0a]' : ''} text-white font-inter`}>
            {!embed && <Navbar />}

            <div className={`${!embed ? 'pt-32' : ''} pb-20 px-6 max-w-7xl mx-auto`}>
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-green-400 via-orange-500 to-red-500">
                        Get Your Access
                    </h1>
                    <p className="text-gray-400 text-lg">Choose the perfect pass for the ultimate experience</p>
                </div>

                {loading ? <Loader text="Loading passes..." /> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                        {passes.map((pass) => {
                            const styles = getColorStyles(pass.color || 'orange');

                            return (
                                <div key={pass._id} className={`relative flex flex-col h-full ${styles.bg} text-white hover- bg-opacity-10 border ${styles.border} rounded-3xl p-8 hover:transform hover:-translate-y-2 transition-all duration-300 group hover:shadow-2xl ${styles.shadow}`}>
                                    {/* {pass.color === 'yellow' && (
                                        <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-3xl">
                                            POPULAR
                                        </div>
                                    )} */}

                                    <div className="mb-6 montserrat-light text-white hover:text-gray-200 transition-colors duration-300">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`text-2xl font-bold ${styles.text}`}>{pass.name}</h3>
                                            <span className={`text-[12px] font-bold px-2 py-0.5 rounded uppercase bg-white/20 text-black`}>
                                                {pass.type || 'Individual'}
                                            </span>
                                        </div>
                                        <div className={`text-4xl font-bold ${styles.text}`}>
                                            ₹{pass.price}/-
                                            {/* <span className={`text-sm font-normal ml-1 ${styles.subText}`}>/person</span> */}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {pass.perks.map((perk, i) => (
                                            <div key={i} className={`flex items-start gap-3 text-sm ${styles.subText}`}>
                                                <CheckCircle size={18} className={`${styles.icon} shrink-0 mt-0.5`} />
                                                <span>{perk}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate('/select-events', { state: { pass } })}
                                        className="w-full mt-auto py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-black bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all"
                                    >
                                        Buy Pass <ArrowRight size={18} className="text-black" />
                                    </button>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {!embed && <Footer />}
        </div>
    );
};

export default Passes;
