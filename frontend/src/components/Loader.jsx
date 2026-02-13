import React from 'react';
import Logo from '../assets/Logo.png';

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-4">
                {/* Glowing effect behind the logo */}
                <div className="absolute inset-0 bg-blue-500/30 rounded-[full] blur-xl animate-pulse" />

                {/* Rotating Logo */}
                <img
                    src={Logo}
                    alt="Loading"
                    className="w-full h-full object-contain animate-[spin_3s_linear_infinite] relative z-10"
                />
            </div>
            {/* <p className="text-gray-400 font-medium animate-pulse">{text}</p> */}
            <p className="text-gray-400 font-medium animate-pulse">Loading...</p>
        </div>
    );
};

export default Loader;
