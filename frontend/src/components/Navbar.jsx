import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { BASE_URL } from '../utils/config';

const Navbar = () => {
    const { config } = useGlobalConfig();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        {
            name: 'Cultural Fest',
            path: '/?cat=Cultural',
            dropdown: [
                { name: 'On Stage', path: '/?cat=Cultural&type=OnStage' },
                { name: 'Off Stage', path: '/?cat=Cultural&type=OffStage' }
            ]
        },
        { name: 'Sports Meet', path: '/?cat=Sports' },
        {
            name: 'Technical Fest',
            path: '/?cat=Technical',
            columns: [
                {
                    links: [
                        { name: 'Artificial Intelligence & Data Science', path: '/?dept=AIDS' },
                        { name: 'Civil Engineering', path: '/?dept=CIVIL' },
                        { name: 'Computer Science & Design', path: '/?dept=CSD' },
                        { name: 'Computer Science & Engineering', path: '/?dept=CSE' },
                        { name: 'Computer Science & Engineering (Cyber Security)', path: '/?dept=CSE(CS)' },


                    ]
                },
                {
                    links: [
                        { name: 'Computer Science & Technology', path: '/?dept=CST' },
                        { name: 'Electronics & Communication Engineering', path: '/?dept=ECE' },
                        { name: 'Electrical & Electronics Engineering', path: '/?dept=EEE' },
                        { name: 'Electrical & Electronics Engineering (VLSI)', path: '/?dept=EEE-VLSI' },
                        { name: 'Electronics & Telecommunication Engineering', path: '/?dept=ETE' },
                        { name: 'Information Technology', path: '/?dept=IT' },
                    ]
                },
                {
                    links: [

                        { name: 'Mechanical Engineering', path: '/?dept=MECH' },
                        { name: 'Management Studies', path: '/?dept=MBA' },
                        { name: 'Computer Applications', path: '/?dept=MCA' },
                    ]
                }
            ]
        },
        { name: 'Live-in Concert', path: '/live-concert' },
        { name: 'Pass', path: '/passes' }
    ];

    const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);

    const toggleMobileDropdown = (name) => {
        setActiveMobileDropdown(activeMobileDropdown === name ? null : name);
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-black/60 montserrat-light backdrop-blur-xl border-b border-white/10 h-16 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo Area */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                src={config.navbar_logo ? (config.navbar_logo.startsWith('http') ? config.navbar_logo : `${BASE_URL}${config.navbar_logo}`) : "https://upload.wikimedia.org/wikipedia/commons/a/7/React-icon.svg"}
                                alt="Dhruva Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Centered Desktop Menu */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="flex items-center space-x-10">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group flex items-center h-16">
                                    <Link
                                        to={link.path || '#'}
                                        className="text-[14px] font-medium text-white/70 hover:text-white transition-all duration-200 ease-out flex items-center gap-1.5"
                                    >
                                        {link.name}
                                        {(link.columns || link.dropdown) && <ChevronDown size={12} className="opacity-50 group-hover:rotate-180 transition-transform" />}
                                    </Link>

                                    {/* Mega Menu Dropdown (3-column) */}
                                    {link.columns && (
                                        <div className="absolute top-16 left-1/2 -translate-x-1/2 min-w-[600px] md:min-w-[800px] rounded-2xl shadow-2xl bg-black/85 backdrop-blur-3xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                                                {link.columns.map((column, idx) => (
                                                    <div key={idx} className="space-y-5">
                                                        {column.title && (
                                                            <h4 className="text-[13px] uppercase tracking-[0.15em] font-bold text-white/40 border-b border-white/5 pb-2">
                                                                {column.title}
                                                            </h4>
                                                        )}
                                                        <div className="flex flex-col space-y-1">
                                                            {column.links.map((subLink, sIdx) => (
                                                                <Link
                                                                    key={sIdx}
                                                                    to={subLink.path}
                                                                    className="px-3 py-2 text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                                                                >
                                                                    {subLink.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Standard Dropdown (1-column) */}
                                    {link.dropdown && (
                                        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-48 rounded-2xl shadow-2xl bg-black/85 backdrop-blur-3xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0 overflow-hidden">
                                            <div className="p-2 flex flex-col space-y-1">
                                                {link.dropdown.map((subItem, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={subItem.path}
                                                        className="px-4 py-2.5 text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button - Align right */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-white/70 hover:text-white"
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-2xl transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
                <div className="flex flex-col p-6 space-y-4 overflow-y-auto h-full">
                    {navLinks.map((link) => (
                        <div key={link.name} className="border-b border-white/5 last:border-0 pb-2">
                            {(link.columns || link.dropdown) ? (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => toggleMobileDropdown(link.name)}
                                        className="w-full flex items-center justify-between py-2 text-lg font-medium text-white/80"
                                    >
                                        <span>{link.name}</span>
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${activeMobileDropdown === link.name ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`grid transition-all duration-300 ${activeMobileDropdown === link.name ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'} overflow-hidden`}>
                                        <div className="min-h-0 pl-4 flex flex-col space-y-4 pt-2 pb-4">
                                            {link.columns ? (
                                                link.columns.map((col, cIdx) => (
                                                    <div key={cIdx} className="space-y-2">
                                                        {col.title && <div className="text-[12px] uppercase tracking-widest text-white/30 font-bold">{col.title}</div>}
                                                        {col.links.map((subLink, sIdx) => (
                                                            <Link
                                                                key={sIdx}
                                                                to={subLink.path}
                                                                className="block text-[16px] text-white/50 hover:text-white"
                                                                onClick={() => setIsOpen(false)}
                                                            >
                                                                {subLink.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ))
                                            ) : (
                                                link.dropdown.map((subItem, idx) => (
                                                    <Link
                                                        key={idx}
                                                        to={subItem.path}
                                                        className="block text-[16px] text-white/50 hover:text-white"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to={link.path}
                                    className="block py-2 text-lg font-medium text-white/80"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </div>
                    ))}
                    <Link
                        to="/passes"
                        className="mt-4 bg-white text-black py-3 rounded-full font-bold text-center text-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        Register Now
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
