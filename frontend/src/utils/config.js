export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get full URL including API prefix
export const getApiUrl = (endpoint) => {
    // Remove leading slash if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${API_URL}/${cleanEndpoint}`;
};

// Helper for static files (uploads)
// Note: Vercel serverless functions don't persist uploads locally. 
// You should use an external storage service (AWS S3, Cloudinary) for production.
// For now, this points to the backend URL's upload folder.
export const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';

export const getUploadUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
};
