import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    useEffect(() => {
        // Load language from localStorage
        const savedLanguage = localStorage.getItem('kamwalaa_language');
        if (savedLanguage && ['en', 'te', 'hi'].includes(savedLanguage)) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    const changeLanguage = (lang) => {
        if (['en', 'te', 'hi'].includes(lang)) {
            setCurrentLanguage(lang);
            localStorage.setItem('kamwalaa_language', lang);
        }
    };

    const t = translations[currentLanguage];

    const value = {
        currentLanguage,
        changeLanguage,
        t,
        languages: [
            { code: 'en', name: 'English' },
            { code: 'te', name: 'తెలుగు' },
            { code: 'hi', name: 'हिंदी' }
        ]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
