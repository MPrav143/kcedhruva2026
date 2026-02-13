import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { getImageUrl } from '../utils/imageUtils';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const About = ({ embed = false }) => {
    const { config, loading } = useGlobalConfig();
    const navigate = useNavigate();

    if (loading) return <Loader text="Loading..." />;

    const logoUrl = config.about_logo || '/dhruvalogo.png';

    const logoWidth = config.about_logo_width || '150px';

    return (
        <div className="min-h-screen bg-[#050505] text-white font-outfit font-serif overflow-hidden">
            {!embed && <Navbar />}
            {/* KCE Section (Top) */}
            <section className="pt-24 pb-12 relative z-10 bg-[#0a0a0a] font-serif">
                <div className="container mx-auto px-6 md:px-20 lg:px-40 flex flex-col md:flex-row items-center gap-8">
                    {/* KCE Visual (Left) */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <div className="relative w-full max-w-md h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors z-10" />
                            {config.about_kce_image ? (
                                <img src={getImageUrl(config.about_kce_image)} alt="KCE Logo" className="w-full h-full object-contain p-4 bg-white/5 transform group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 flex-col gap-4">
                                    <span className="text-xl">KCE Logo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* KCE Content (Right) */}
                    <div className="flex-1 space-y-6 text-center md:text-left ">
                        <h2 className="inline-block text-3xl md:text-5xl font-bold font-serif mb-6 md:mb-10
               leading-tight
               bg-gradient-to-r from-violet-400 to-blue-500
               bg-clip-text text-transparent">

                            About Karpagam College of Engineering
                        </h2>
                        <div className="prose prose-invert prose-lg text-gray-300">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 text-base md:text-lg text-gray-300 leading-relaxed shadow-xl relative group hover:bg-white/10 transition-colors"
                            >
                                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-purple-500 rounded-bl-xl opacity-50 group-hover:opacity-100 transition-opacity" />

                                <p className="whitespace-pre-wrap">
                                    {config.about_kce_content || 'Karpagam College of Engineering is an autonomous institution approved by AICTE and affiliated to Anna University, Chennai. It offers various undergraduate and postgraduate, and doctoral programmes.'}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dhruva Section (Bottom) */}
            <section className="py-20 relative z-10 flex items-center justify-center">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                </div>

                <div className="container mx-auto px-6 md:px-20 lg:px-40 relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-4">
                    {/* Text Side (Left) */}
                    <div className="flex-1 text-center md:text-left w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="inline-block text-3xl md:text-5xl font-bold font-serif mb-6 md:mb-10
                                leading-tight
                                bg-gradient-to-r from-green-400 via-blue-400 to-red-500
                                bg-clip-text text-transparent">About {config.website_name || 'Dhruva'}</h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 text-base md:text-lg text-gray-300 leading-relaxed shadow-xl relative group hover:bg-white/10 transition-colors"
                        >
                            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-8 h-8 md:w-12 md:h-12 border-t-2 border-r-2 border-blue-500 rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-8 h-8 md:w-12 md:h-12 border-b-2 border-l-2 border-purple-500 rounded-bl-xl opacity-50 group-hover:opacity-100 transition-opacity" />

                            <p className="whitespace-pre-wrap roboto-mono-light mb-8">
                                {config.about_content || 'Dhruva is a celebration of talent, innovation, and creativity. Join us as we bring together the brightest minds and the most spirited individuals for a festival like no other.'}
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <button
                                    onClick={() => navigate('/passes')}
                                    className="px-8 py-3 bg-white/10 hover:bg-blue-900 font-serif text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1"
                                >
                                    Register Now
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Side (Right) - Rectangular Logo */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-md"
                        >
                            <div className="relative w-full aspect-video bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center p-8 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <img
                                    src={getImageUrl(logoUrl)}
                                    alt="Dhruva Logo"
                                    className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transform group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Vision/Mission Section (Optional enhancement) */}
            <section className="py-20 relative z-10">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Imagine', desc: 'A platform to spark creativity.', color: 'from-blue-400 to-cyan-400', font: "playwrite-nz-basic-light" },
                        { title: 'Innovate', desc: 'Pushing boundaries of technology.', color: 'from-purple-400 to-pink-400', font: "playwrite-nz-basic-light" },
                        { title: 'Inspire', desc: 'Creating moments that last forever.', color: 'from-amber-400 to-orange-400', font: "playwrite-nz-basic-light" }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center hover:bg-blue-600/10 transition-colors group"
                        >
                            <h3
                                className={`inline-block text-2xl font-bold mb-4 leading-relaxed
              bg-clip-text text-transparent bg-gradient-to-r
              ${item.color} ${item.font}`}
                            >
                                {item.title}
                            </h3>

                            <p className={`text-gray-400 group-hover:text-gray-200 transition-colors ${item.font} inter-light-text`}>{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {!embed && <Footer />}
        </div>
    );
};

export default About;
