
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/config';

const GlobalConfigContext = createContext();

export const useGlobalConfig = () => useContext(GlobalConfigContext);

export const GlobalConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        website_name: 'Dhruva',
        event_year: '2025',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        navbar_logo: null
    });
    const [sponsors, setSponsors] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const [confRes, sponsorsRes, clubsRes] = await Promise.all([
                axios.get(`${API_URL}/upload`),
                axios.get(`${API_URL}/content/sponsors`),
                axios.get(`${API_URL}/content/clubs`)
            ]);

            setConfig(prev => ({
                ...prev,
                ...confRes.data
            }));
            setSponsors(sponsorsRes.data);
            setClubs(clubsRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch global config:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <GlobalConfigContext.Provider value={{ config, sponsors, clubs, loading, refreshConfig: fetchConfig }}>
            {children}
        </GlobalConfigContext.Provider>
    );
};
