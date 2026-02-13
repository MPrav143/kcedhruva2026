import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, LogOut, Ticket, Image as ImageIcon, Menu, X } from 'lucide-react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { DEPARTMENTS, CULTURAL_SUBCATEGORIES } from '../utils/constants';

const Sidebar = () => {
    const { config } = useGlobalConfig();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [expanded, setExpanded] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('adminUser') || 'null');
        setUser(userData);
    }, []);

    const isActive = (path) => location.pathname === path;

    const toggleSubMenu = (label) => {
        setExpanded(prev => ({ ...prev, [label]: !prev[label] }));
    };

    const getNavItems = () => {
        // HOD: Specific Department Dashboard Only
        if (user?.role === 'hod') {
            return [
                { path: '/admin/department', icon: LayoutDashboard, label: 'Department' },
                // { path: '/admin/events', icon: Calendar, label: 'My Events' } // Removed as per request (editable view hidden)
            ];
        }

        // Principal / Dean: Strategic View (Analytics & Overview)
        // Strictly NOT mingling with "Manage X" admin tasks. Removed detailed trees.
        if (user?.role === 'principal' || user?.role === 'dean') {
            return [
                { path: '/admin/analytics', icon: LayoutDashboard, label: 'Overview' },
                // Removed detailed technical/cultural/sports trees as requested
                // { label: 'Technical', ... },
                // { label: 'Cultural', ... },
                // { label: 'Sports', ... }
            ];
        }

        // Super Admin: Full Control
        return [
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            {
                label: 'Technical Fest',
                icon: Calendar,
                children: [
                    { path: '/admin/events/Technical', label: 'All Technical' },
                    ...DEPARTMENTS.map(dept => ({
                        path: `/admin/events/Technical/${dept.code}`,
                        label: dept.code
                    }))
                ]
            },
            {
                label: 'Cultural Fest',
                icon: Calendar,
                children: [
                    { path: '/admin/events/Cultural', label: 'All Cultural' },
                    ...CULTURAL_SUBCATEGORIES.map(sub => ({
                        path: `/admin/events/Cultural/${sub.code}`,
                        label: sub.name
                    }))
                ]
            },
            { path: '/admin/events/Sports/All', icon: Calendar, label: 'Sports Meet' },
            { path: '/admin/events', icon: Calendar, label: 'All Events' },
            { path: '/admin/passes', icon: Ticket, label: 'Manage Passes' },
            { path: '/admin/content', icon: FileText, label: 'Manage Content' },
            { path: '/admin/images', icon: ImageIcon, label: 'Manage Images' },
        ];
    };

    const navItems = getNavItems();

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-lg text-white border border-white/10"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`h-screen w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-40 overflow-y-auto custom-scrollbar transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="mb-10 flex items-center gap-3 shrink-0 mt-8 lg:mt-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                        D
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        {config.website_name || 'DHRUVA'}
                    </h1>
                </div>

                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => (
                        <div key={item.label}>
                            {item.children ? (
                                <div>
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-white/5 hover:text-white group`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <span className={`transition-transform duration-200 ${expanded[item.label] ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    {expanded[item.label] && (
                                        <div className="pl-12 space-y-1 mt-1">
                                            {item.children.map(child => (
                                                <Link
                                                    key={child.path}
                                                    to={child.path}
                                                    onClick={() => setMobileOpen(false)} // Close on click
                                                    className={`block py-2 text-sm transition-colors ${isActive(child.path) ? 'text-blue-400 font-medium' : 'text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    onClick={() => setMobileOpen(false)} // Close on click
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive(item.path)
                                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-blue-400' : 'text-gray-500 group-hover:text-white'} transition-colors`} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <button
                    onClick={() => {
                        localStorage.removeItem('adminToken');
                        localStorage.removeItem('adminUser');
                        window.location.href = '/login';
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all mt-auto group w-full"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-300" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
