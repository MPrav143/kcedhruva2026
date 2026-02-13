export const getImageUrl = (url) => {
    if (!url) return '';
    url = url.trim();

    // Handle Data URLs (base64)
    if (url.startsWith('data:')) {
        return url;
    }

    // Handle Google Drive and other absolute URLs
    if (url.startsWith('http') || url.startsWith('https')) {
        // Convert Google Drive view links to direct image links if possible
        if (url.includes('drive.google.com')) {
            if (url.includes('/view') || url.includes('/edit')) {
                const match = url.match(/\/d\/(.+?)\/(view|edit)/);
                if (match && match[1]) {
                    return `https://docs.google.com/uc?export=view&id=${match[1]}`;
                }
            }
            if (url.includes('uc?id=') || url.includes('uc?export=view&id=')) {
                return url;
            }
        }
        return url;
    }

    // Handle local paths from backend
    let cleanUrl = url.replace(/\\/g, '/');
    if (cleanUrl.startsWith('/')) {
        cleanUrl = cleanUrl.substring(1);
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    return `${baseUrl}/${cleanUrl}`;
};
