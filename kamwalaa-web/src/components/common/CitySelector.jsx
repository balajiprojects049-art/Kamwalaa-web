import React, { useState } from 'react';
import { FiMapPin, FiX, FiSearch } from 'react-icons/fi';
import { useCity } from '../../context/CityContext';
import './CitySelector.css';

const CitySelector = () => {
    const { cities, selectCity, showCityModal, setShowCityModal } = useCity();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCities = cities.filter(city =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCitySelect = (city) => {
        selectCity(city);
    };

    if (!showCityModal) return null;

    return (
        <div className="city-selector-overlay" onClick={() => setShowCityModal(false)}>
            <div className="city-selector-modal" onClick={(e) => e.stopPropagation()}>
                <div className="city-selector-header">
                    <div className="city-selector-icon">
                        <FiMapPin />
                    </div>
                    <h2>Select Your City</h2>
                    <p>Choose your city to see available services</p>
                    <button
                        className="city-selector-close"
                        onClick={() => setShowCityModal(false)}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                <div className="city-selector-body">
                    <div className="city-search-wrapper">
                        <FiSearch className="city-search-icon" />
                        <input
                            type="text"
                            className="city-search-input"
                            placeholder="Search city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="city-list">
                        {filteredCities.length > 0 ? (
                            filteredCities.map((city) => (
                                <button
                                    key={city}
                                    className="city-item"
                                    onClick={() => handleCitySelect(city)}
                                >
                                    <FiMapPin className="city-item-icon" />
                                    <span className="city-item-name">{city}</span>
                                    <span className="city-item-arrow">→</span>
                                </button>
                            ))
                        ) : (
                            <div className="city-no-results">
                                <p>No cities found matching "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitySelector;
