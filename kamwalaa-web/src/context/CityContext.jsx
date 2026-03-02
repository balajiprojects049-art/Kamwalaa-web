import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) throw new Error('useCity must be used within CityProvider');
    return context;
};

/* ---- Active cities — Telangana only (expand as we grow) ---- */
const CITIES = [
    { name: 'Hyderabad', state: 'Telangana', emoji: '💎' },
    { name: 'Warangal', state: 'Telangana', emoji: '�️' },
    { name: 'Nalgonda', state: 'Telangana', emoji: '🌆' },

    // ---- Coming Soon — uncomment when we expand ----
    // { name: 'Ranchi',     state: 'Jharkhand',    emoji: '🏙️' },
    // { name: 'Bokaro',     state: 'Jharkhand',    emoji: '�' },
    // { name: 'Dhanbad',    state: 'Jharkhand',    emoji: '⛏️' },
    // { name: 'Jamshedpur', state: 'Jharkhand',    emoji: '🔧' },
    // { name: 'Hazaribagh', state: 'Jharkhand',    emoji: '�' },
    // { name: 'Delhi',      state: 'Delhi',        emoji: '🏛️' },
    // { name: 'Noida',      state: 'Uttar Pradesh',emoji: '🏗️' },
    // { name: 'Mumbai',     state: 'Maharashtra',  emoji: '🌊' },
    // { name: 'Bangalore',  state: 'Karnataka',    emoji: '💻' },
    // { name: 'Pune',       state: 'Maharashtra',  emoji: '🎓' },
    // { name: 'Chennai',    state: 'Tamil Nadu',   emoji: '🌴' },
    // { name: 'Kolkata',    state: 'West Bengal',  emoji: '🎭' },
];

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [showCityModal, setShowCityModal] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('kamwalaa_city');
        if (saved && CITIES.some(c => c.name === saved)) {
            setSelectedCity(saved);
            // Don't auto-show modal if city already chosen
        } else {
            // First visit — show after brief delay
            const t = setTimeout(() => setShowCityModal(true), 600);
            return () => clearTimeout(t);
        }
    }, []);

    const selectCity = (cityName) => {
        setSelectedCity(cityName);
        localStorage.setItem('kamwalaa_city', cityName);
        setShowCityModal(false);
    };

    const changeCity = () => setShowCityModal(true);

    return (
        <CityContext.Provider value={{
            selectedCity,
            selectCity,
            changeCity,
            showCityModal,
            setShowCityModal,
            cities: CITIES.map(c => c.name), // compat: string array
            citiesData: CITIES,               // full objects
        }}>
            {children}
        </CityContext.Provider>
    );
};
