import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useCity } from '../../context/CityContext';
import { getAllCategories, getAllServicesFlat } from '../../data/servicesData';
import './HeroSearch.css';

const HeroSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [defaultResults, setDefaultResults] = useState([]);

    // Use global city context
    const { selectedCity, selectCity, cities } = useCity();
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const cityDropdownRef = useRef(null);
    const wrapperRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setShowCityDropdown(false);
            }
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Load default categories/services with grouped structure
    useEffect(() => {
        const allCategories = getAllCategories();
        const simplifiedDefaults = [];

        allCategories.forEach(cat => {
            // Add Header
            simplifiedDefaults.push({
                type: 'group_header',
                label: cat.name.en
            });

            // Add Items (Subcategories)
            const items = cat.subcategories || [];
            items.forEach(item => {
                simplifiedDefaults.push({
                    type: 'service_item',
                    data: item,
                    category: cat,
                    label: item.name.en || item.name
                });
            });
        });

        setDefaultResults(simplifiedDefaults);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setShowResults(true);

        if (query.trim() === '') {
            setSearchResults(defaultResults);
            return;
        }

        const allCategories = getAllCategories();
        const allServices = getAllServicesFlat();
        const results = [];
        const queryLower = query.toLowerCase();

        // 1. Search Categories
        allCategories.forEach(category => {
            const categoryMatch = category.name.en.toLowerCase().includes(queryLower);
            if (categoryMatch) {
                results.push({
                    type: 'category',
                    data: category,
                    relevance: 2
                });
            }
        });

        // 2. Search Services
        allServices.forEach(service => {
            const serviceMatch = service.name.en.toLowerCase().includes(queryLower);
            if (serviceMatch) {
                const parentCategory = allCategories.find(c => c.id === service.categoryId);
                results.push({
                    type: 'service',
                    data: service,
                    category: parentCategory,
                    relevance: 3
                });
            }
        });

        results.sort((a, b) => b.relevance - a.relevance);
        setSearchResults(results.slice(0, 8));
    };

    const handleInputFocus = () => {
        if (!searchQuery) {
            setSearchResults(defaultResults);
        }
        setShowResults(true);
    };

    const toggleResults = (e) => {
        e.stopPropagation();
        if (!showResults) {
            handleInputFocus();
        } else {
            setShowResults(false);
        }
    };

    const handleResultClick = (result) => {
        if (result.type === 'category') {
            navigate(`/services/${result.data.id}`);
        } else if (result.type === 'service_item') {
            // Grouped Item (Subcategory) -> Go to Category page with subcategory context? 
            // Currently generic behavior: go to category
            navigate(`/services/${result.category.id}`);
        } else {
            // Specific Service Result -> Go to Service Booking/Details
            navigate(`/services/${result.category.id}`, { state: { selectedServiceId: result.data.id } });
        }
        setSearchQuery('');
        setShowResults(false);
    };

    return (
        <div className="hero-search-wrapper" ref={wrapperRef}>
            <div className="hero-search-bar">
                {/* City Section */}
                <div className="search-segment city-segment" ref={cityDropdownRef}>
                    <div
                        className="city-selector"
                        onClick={() => setShowCityDropdown(!showCityDropdown)}
                    >
                        <FiMapPin className="segment-icon" />
                        <span className="selected-value">{selectedCity || 'Select City'}</span>
                        <FiChevronDown className={`chevron-icon ${showCityDropdown ? 'rotate' : ''}`} />
                    </div>

                    {showCityDropdown && (
                        <div className="city-dropdown-list">
                            {cities.map(city => (
                                <div
                                    key={city}
                                    className="city-option"
                                    onClick={() => {
                                        selectCity(city);
                                        setShowCityDropdown(false);
                                    }}
                                >
                                    {city}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="search-divider"></div>

                {/* Service Section */}
                <div className="search-segment service-segment">
                    <FiSearch className="segment-icon" />
                    <input
                        type="text"
                        className="service-search-input"
                        placeholder="Select Service..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={handleInputFocus}
                    />
                    <div onClick={toggleResults} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0.5rem' }}>
                        <FiChevronDown
                            className={`chevron-icon ${showResults ? 'rotate' : ''}`}
                            style={{ fontSize: '1rem' }}
                        />
                    </div>
                </div>

            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <div className="hero-search-results">
                    {/* Blue Title Header */}
                    {!searchQuery && (
                        <div className="search-dropdown-header">
                            Select Services
                        </div>
                    )}

                    {searchResults.map((result, index) => {
                        if (result.type === 'group_header') {
                            return (
                                <div key={index} className="search-group-header">
                                    {result.label}
                                </div>
                            );
                        }

                        return (
                            <div
                                key={index}
                                className={`hero-search-result-item ${result.type === 'service_item' ? 'indented-item' : ''}`}
                                onClick={() => handleResultClick(result)}
                            >
                                {(result.type !== 'service_item') && (
                                    <span className="hero-result-icon">
                                        {result.type === 'category' ? result.data.icon : result.category?.icon}
                                    </span>
                                )}

                                <div className="hero-result-info">
                                    <h4>
                                        {result.type === 'service_item' ? result.label :
                                            (result.type === 'category' ? result.data.name.en : result.data.name.en)}
                                    </h4>
                                    {result.type !== 'service_item' && (
                                        <p>{result.type === 'category' ? 'Category' : 'Service'}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HeroSearch;
