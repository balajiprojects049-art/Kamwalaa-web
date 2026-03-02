import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiX, FiSearch, FiChevronRight, FiNavigation, FiZap } from 'react-icons/fi';
import { useCity } from '../../context/CityContext';
import './CitySelector.css';

/* ---- Popular / featured cities (shown at top of grid) ---- */
// Expand this list when more cities are activated in CityContext
const POPULAR = ['Hyderabad', 'Warangal', 'Nalgonda'];
// const POPULAR = ['Ranchi', 'Hyderabad', 'Delhi', 'Mumbai', 'Bangalore', 'Noida'];

const CitySelector = () => {
    const { citiesData = [], cities = [], selectCity, showCityModal, setShowCityModal, selectedCity } = useCity();
    const [query, setQuery] = useState('');
    const [hovered, setHovered] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const inputRef = useRef(null);

    /* Animate-in on mount */
    useEffect(() => {
        if (showCityModal) {
            setIsVisible(false);
            setQuery('');
            const t = setTimeout(() => {
                setIsVisible(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }, 50);
            return () => clearTimeout(t);
        }
    }, [showCityModal]);

    /* ESC to close */
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    if (!showCityModal) return null;

    /* ---- Filter logic ---- */
    const all = citiesData.length > 0 ? citiesData : cities.map(name => ({ name, state: '', emoji: '📍' }));
    const filtered = query.trim()
        ? all.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.state?.toLowerCase().includes(query.toLowerCase()))
        : all;

    const popular = filtered.filter(c => POPULAR.includes(c.name));
    const otherCities = filtered.filter(c => !POPULAR.includes(c.name));

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => setShowCityModal(false), 250);
    };

    const handleSelect = (cityName) => {
        setIsVisible(false);
        setTimeout(() => selectCity(cityName), 200);
    };

    return (
        <div
            className={`city-overlay ${isVisible ? 'city-overlay-in' : ''}`}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Select your city"
        >
            <div
                className={`city-modal ${isVisible ? 'city-modal-in' : ''}`}
                onClick={e => e.stopPropagation()}
            >
                {/* ======================================
                    HEADER — Deep Royal Blue + Gold
                    ====================================== */}
                <div className="city-header">
                    {/* Decorative blobs */}
                    <div className="city-header-blob city-header-blob-1" aria-hidden="true" />
                    <div className="city-header-blob city-header-blob-2" aria-hidden="true" />

                    {/* Icon */}
                    <div className="city-pin-icon" aria-hidden="true">
                        <FiNavigation />
                        <span className="city-pin-pulse" />
                    </div>

                    {/* Text */}
                    <h2 className="city-modal-title">Choose Your City</h2>
                    <p className="city-modal-subtitle">
                        Select your location to see available services and pricing near you
                    </p>

                    {/* Currently selected pill */}
                    {selectedCity && (
                        <div className="city-current-pill">
                            <FiMapPin />
                            Currently: <strong>{selectedCity}</strong>
                        </div>
                    )}

                    {/* Close btn */}
                    <button
                        className="city-close-btn"
                        onClick={handleClose}
                        aria-label="Close city selector"
                    >
                        <FiX />
                    </button>
                </div>

                {/* ======================================
                    BODY
                    ====================================== */}
                <div className="city-body">

                    {/* Search */}
                    <div className="city-search-wrap">
                        <FiSearch className="city-search-ico" aria-hidden="true" />
                        <input
                            ref={inputRef}
                            type="text"
                            className="city-search-field"
                            placeholder="Search city or state..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            autoComplete="off"
                            aria-label="Search cities"
                            id="city-search-input"
                        />
                        {query && (
                            <button
                                className="city-search-clear"
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                            >
                                <FiX />
                            </button>
                        )}
                    </div>

                    {/* No results */}
                    {filtered.length === 0 && (
                        <div className="city-empty">
                            <div className="city-empty-icon">😔</div>
                            <p>No cities found for "<strong>{query}</strong>"</p>
                            <span>We're expanding fast! Check back soon.</span>
                        </div>
                    )}

                    <div className="city-list-container">
                        {/* Popular / Featured */}
                        {popular.length > 0 && !query && (
                            <>
                                <div className="city-section-label">
                                    <FiZap className="city-section-icon" />
                                    Popular Cities
                                </div>
                                <div className="city-popular-grid">
                                    {popular.map(city => (
                                        <button
                                            key={city.name}
                                            className={`city-popular-card ${selectedCity === city.name ? 'active' : ''}`}
                                            onClick={() => handleSelect(city.name)}
                                            onMouseEnter={() => setHovered(city.name)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <span className="city-popular-emoji" aria-hidden="true">{city.emoji}</span>
                                            <span className="city-popular-name">{city.name}</span>
                                            <span className="city-popular-state">{city.state}</span>
                                            {selectedCity === city.name && (
                                                <span className="city-active-dot" aria-label="Currently selected" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* All / Filtered list */}
                        {(query || otherCities.length > 0) && (
                            <>
                                <div className="city-section-label">
                                    <FiMapPin className="city-section-icon" />
                                    {query ? `Results (${filtered.length})` : 'All Cities'}
                                </div>
                                <div className="city-list">
                                    {(query ? filtered : otherCities).map(city => (
                                        <button
                                            key={city.name}
                                            className={`city-list-item ${selectedCity === city.name ? 'active' : ''} ${hovered === city.name ? 'hovered' : ''}`}
                                            onClick={() => handleSelect(city.name)}
                                            onMouseEnter={() => setHovered(city.name)}
                                            onMouseLeave={() => setHovered(null)}
                                        >
                                            <div className="city-list-ico">
                                                {city.emoji || '📍'}
                                            </div>
                                            <div className="city-list-info">
                                                <span className="city-list-name">{city.name}</span>
                                                {city.state && (
                                                    <span className="city-list-state">{city.state}</span>
                                                )}
                                            </div>
                                            {selectedCity === city.name ? (
                                                <span className="city-active-label">Selected</span>
                                            ) : (
                                                <FiChevronRight className="city-list-arrow" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer note */}
                    <div className="city-footer-note">
                        <FiMapPin />
                        <span>More cities coming soon — Expanding across India 🇮🇳</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitySelector;
