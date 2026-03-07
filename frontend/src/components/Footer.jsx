import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Facebook, Youtube as YoutubeIcon, Instagram, Linkedin } from 'lucide-react';
import MarqueePkg from 'react-fast-marquee';
import { useLocation } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import { useGlobalConfig } from '../context/GlobalConfigContext';

const Marquee = MarqueePkg.default || MarqueePkg;

const Footer = () => {
    const { config, sponsors, clubs } = useGlobalConfig();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const footerBg = (isMobile && config.footer_bg_video_mobile) ? config.footer_bg_video_mobile : config.footer_bg_video;
    const phoneNumbers = config.contact_phones
        ? config.contact_phones.split(',').map(p => p.trim())
        : [config.contact_phone || '+91 12345 67890'];

    return (
        <footer className="bg-black/50 text-white">
            {/* Sponsors Section */}
            {sponsors.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
                    <h3 className="text-3xl font-bold text-center mb-16 shadow-lg">Our Sponsors</h3>
                    <div className="space-y-16">
                        {["Title", "Platinum", "Gold", "Silver", "Associate"].map(tier => {
                            const tieredSponsors = sponsors.filter(s => (s.tier === tier) || (tier === 'Silver' && !s.tier));
                            if (tieredSponsors.length === 0) return null;

                            return (
                                <div key={tier} className="flex flex-col items-center">
                                    {/* <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-[0.3em] mb-8">
                                        {tier} {tier === 'Title' ? 'Sponsor' : 'Sponsors'}
                                    </h4> */}
                                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                                        {tieredSponsors.map(s => (
                                            <div key={s._id} className="group flex flex-col items-center">
                                                <div className="relative w-8 h-8 md:w-36 md:h-36 flex items-center justify-center bg-white/5 rounded-2xl p-3 md:p-4 border border-white/10 shadow-lg group-hover:border-white/30 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 backdrop-blur-sm">
                                                    {s.logo && /\.(mp4|webm|ogg)$/i.test(s.logo) ? (
                                                        <video
                                                            src={getImageUrl(s.logo)}
                                                            autoPlay
                                                            loop
                                                            muted
                                                            playsInline
                                                            className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={getImageUrl(s.logo)}
                                                            alt={s.name}
                                                            className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-center mt-4 transition-opacity duration-300">
                                                    <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{s.name}</p>
                                                    {/* <p className="text-[8px] md:text-[10px] text-blue-400 font-medium">{tier} Partner</p> */}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Club Logos Marquee */}
            {clubs.length > 0 && (
                <section className="py-10 bg-black border-y border-white/10">
                    <h3 className="text-3xl font-bold text-center mb-16 shadow-lg">Our Clubs</h3>
                    <Marquee gradient={false} speed={40}>
                        {clubs.map(club => (
                            <div key={club._id} className="mx-2 md:mx-4 w-28 md:w-40 flex items-center justify-center hover:grayscale-0 transition-all opacity-100 hover:opacity-100">
                                <img
                                    src={getImageUrl(club.logo)}
                                    alt={club.name}
                                    className="h-16 md:h-20 w-full object-contain"
                                />
                            </div>
                        ))}
                    </Marquee>
                </section>
            )}

            {/* Main Footer Links & Info Section (with Background Media) */}
            <div className="relative border-t border-white/10 pt-16 pb-8 overflow-hidden">
                {/* Background Media */}
                {footerBg ? (
                    <div className="absolute inset-0 z-0">
                        {/\.(mp4|webm|ogg)$/i.test(footerBg) ? (
                            <video
                                key={footerBg} // Force rerender on source change
                                src={getImageUrl(footerBg)}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover opacity-30"
                            />
                        ) : (
                            <img
                                src={getImageUrl(footerBg)}
                                alt="Footer Background"
                                className="w-full h-full object-cover opacity-30"
                            />
                        )}
                        <div className="absolute inset-0 bg-black/10" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-black/10 z-0" />
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                            {config.website_name || 'DHRUVA'} {config.event_year || '2026'}
                        </h2>
                        <p className="text-gray-400 leading-relaxed">
                            The ultimate technical, cultural, and sports festival celebrating talent, innovation, and spirit.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li><a href="/events" className="hover:text-blue-400 transition-colors">Events</a></li>
                            <li><a href="/passes" className="hover:text-blue-400 transition-colors">Get Passes</a></li>
                            <li><a href="/register" className="hover:text-blue-400 transition-colors">Register</a></li>
                            {/* <li><a href="/login" className="hover:text-blue-400 transition-colors">Admin Login</a></li> */}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                                <span>{config.contact_address || 'College Campus, India'}</span>
                            </li>
                            {phoneNumbers.map((phone, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                    <Phone size={18} className="text-blue-500 shrink-0" />
                                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-blue-400 transition-colors">{phone}</a>
                                </li>
                            ))}
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <a href={`mailto:${config.contact_email || 'contact@dhruva.com'}`} className="hover:text-blue-400 transition-colors">{config.contact_email || 'contact@dhruva.com'}</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Follow Us</h3>
                        <div className="flex flex-col gap-4">
                            {[
                                { Icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/share/1ERFLsRYj7/' },
                                { Icon: YoutubeIcon, label: 'Youtube', href: 'https://www.youtube.com/@wekceians?si=2UClrWxuRShi8Xoy' },
                                { Icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/kce_dhruva?igsh=cDM5b2w2cjFpM3do' },
                                { Icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/school/wekceians/' }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-400 hover:text-blue-400 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110">
                                        <social.Icon size={18} />
                                    </div>
                                    <span className="group-hover:text-white transition-colors">{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-white mb-6">Location</h3>
                        <div className="w-full h-48 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                            <iframe
                                src="https://maps.google.com/maps?q=Karpagam%20College%20of%20Engineering&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                className="w-full h-full"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                title="Karpagam College of Engineering Location"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 border-t border-white/5 pt-8 text-center text-xs text-gray-500">
                    <p>&copy; {config.event_year || '2026'} {config.website_name || 'Dhruva'} Team. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
