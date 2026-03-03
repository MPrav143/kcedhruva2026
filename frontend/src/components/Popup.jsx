import React, { useState, useEffect } from 'react';
import { useGlobalConfig } from '../context/GlobalConfigContext';
import { getImageUrl } from '../utils/imageUtils';
import { X } from 'lucide-react';

const Popup = () => {
    const { config } = useGlobalConfig();
    const [mounted, setMounted] = useState(true);
    const [visible, setVisible] = useState(false);

    // Extract images
    const rawImagesStr = config?.popup_images || '';
    const images = rawImagesStr ? rawImagesStr.split(',').map(s => s.trim()).filter(Boolean) : [];

    useEffect(() => {
        if (images.length === 0) {
            setMounted(false);
            return;
        }

        const mountTimer = setTimeout(() => {
            setVisible(true);
        }, 100);

        return () => clearTimeout(mountTimer);
    }, [images.length]);

    const handleClose = (e) => {
        if (e.target === e.currentTarget || e.target.closest('.close-btn')) {
            setVisible(false);
            setTimeout(() => setMounted(false), 500); // Wait for fade out
        }
    };

    if (!mounted || images.length === 0) return null;

    const displayImages = images.slice(0, 10);
    // const displayImages = images.slice(0, 10);
    const count = displayImages.length;

    // --- MOBILE GRID CLASSES ---
    const getGridClass = () => {
        switch (count) {
            case 1:
                return "grid-cols-1 place-items-center"; // 1 image centered
            case 2:
                return "grid-cols-2"; // 2 columns
            case 3:
                // Grid setup: First row 2 items, second row 1 item centered
                return "grid-cols-2 [&>div:nth-child(3)]:col-span-2 [&>div:nth-child(3)]:justify-self-center";
            case 4:
                return "grid-cols-2"; // 2 rows, 2 columns automatically
            case 5:
                // First row 3 items, second row 2 items centered
                return "grid-cols-6 [&>div:nth-child(-n+3)]:col-span-2 [&>div:nth-child(n+4)]:col-span-3 [&>div:nth-child(n+4)]:w-2/3 [&>div:nth-child(n+4)]:mx-auto";
            case 6:
                return "grid-cols-3"; // 2 rows, 3 columns
            default:
                return "grid-cols-2 sm:grid-cols-3";
        }
    };

    const getCardWidthClass = () => {
        if (count === 1) return "w-full max-w-[240px] sm:max-w-sm";
        if (count === 2 || count === 3 || count === 4) return "w-full max-w-[160px] sm:max-w-[200px]";
        return "w-full max-w-[110px] sm:max-w-[140px]";
    };

    return (
        <div
            className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-[4px] transition-opacity duration-500 overflow-y-auto sm:overflow-hidden ${visible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        >
            <div
                className={`relative w-full md:w-[90vw] max-w-7xl my-auto transition-all duration-500 flex flex-col items-center justify-center min-h-[50vh] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl p-6 sm:p-8 md:p-10 ${visible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl playwrite-nz-basic-bold text-center mb-4">ON BOARD</h2>
                {/* Close Button */}
                <button
                    onClick={() => {
                        setVisible(false);
                        setTimeout(() => setMounted(false), 500);
                    }}
                    className="close-btn absolute top-3 right-3 sm:top-5 sm:right-5 z-50 p-2 hover:rotate-90 bg-white/10 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
                >
                    <X size={20} className="sm:w-5 sm:h-5" />
                </button>

                {/* Mobile Grid Container (hidden on laptop/desktop) */}
                <div
                    className={`grid md:hidden gap-3 sm:gap-4 w-full justify-center place-content-center ${getGridClass()}`}
                >
                    {displayImages.map((imgSrc, index) => (
                        <div
                            key={`mobile-${index}`}
                            className={`relative rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black/50 transition-transform hover:scale-[1.02] mx-auto ${getCardWidthClass()}`}
                            style={{
                                aspectRatio: '4/5'
                            }}
                        >
                            <img src={getImageUrl(imgSrc)} alt={`Popup ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    ))}
                </div>

                {/* Laptop/Desktop Flex Container (hidden on mobile) */}
                <div
                    className="hidden md:flex flex-row justify-center items-center gap-4 w-full"
                >
                    {displayImages.map((imgSrc, index) => (
                        <div
                            key={`desktop-${index}`}
                            className="relative rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black/50 transition-transform hover:scale-[1.02] flex-1"
                            style={{
                                aspectRatio: '4/5',
                                maxWidth: 'calc(80vh * 0.8)', // Restrict derived max-height to roughly 80vh
                            }}
                        >
                            <img src={getImageUrl(imgSrc)} alt={`Popup ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Popup;
