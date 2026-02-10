import React, { createContext, useState, useContext, useEffect } from 'react';

const CityContext = createContext();

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within CityProvider');
    }
    return context;
};

const cities = [
    'Hyderabad',
    'Warangal',
    'Nalgonda'
];

export const CityProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [showCityModal, setShowCityModal] = useState(false);

    useEffect(() => {
        // Check if city is already selected
        const savedCity = localStorage.getItem('kamwalaa_city');
        if (savedCity && cities.includes(savedCity)) {
            setSelectedCity(savedCity);
        }
        // Always show city modal on website open
        setShowCityModal(true);
    }, []);

    const selectCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem('kamwalaa_city', city);
        setShowCityModal(false);
    };

    const changeCity = () => {
        setShowCityModal(true);
    };

    const value = {
        selectedCity,
        selectCity,
        changeCity,
        showCityModal,
        setShowCityModal,
        cities
    };

    return (
        <CityContext.Provider value={value}>
            {children}
        </CityContext.Provider>
    );
};
