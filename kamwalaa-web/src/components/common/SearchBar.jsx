import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getAllCategories } from '../../data/servicesData';
import './SearchBar.css';

const SearchBar = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();

    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }

        const allCategories = getAllCategories();
        const results = [];
        const queryLower = query.toLowerCase();

        allCategories.forEach(category => {
            const categoryMatchEn = category.name.en.toLowerCase().includes(queryLower);
            const categoryMatchHi = category.name.hi.toLowerCase().includes(queryLower);
            const categoryMatchTe = category.name.te.toLowerCase().includes(queryLower);
            const categoryDescMatch = category.description.en.toLowerCase().includes(queryLower);

            // Add category if it matches
            if (categoryMatchEn || categoryMatchHi || categoryMatchTe || categoryDescMatch) {
                results.push({
                    type: 'category',
                    data: category,
                    relevance: categoryMatchEn || categoryMatchHi || categoryMatchTe ? 2 : 1
                });
            }

            // Search in individual services
            category.services.forEach(service => {
                const serviceMatchEn = service.name.en.toLowerCase().includes(queryLower);
                const serviceMatchHi = service.name.hi.toLowerCase().includes(queryLower);
                const serviceMatchTe = service.name.te.toLowerCase().includes(queryLower);

                if (serviceMatchEn || serviceMatchHi || serviceMatchTe) {
                    results.push({
                        type: 'service',
                        data: service,
                        category: category,
                        relevance: 3 // Services are more relevant than categories
                    });
                }
            });
        });

        // Sort by relevance (higher first) and limit to 10 results
        results.sort((a, b) => b.relevance - a.relevance);
        setSearchResults(results.slice(0, 10));
    };

    const handleResultClick = (result) => {
        if (result.type === 'category') {
            navigate(`/services/${result.data.id}`);
        } else {
            // Navigate to specific service detail page
            navigate(`/services/${result.category.id}/${result.data.id}`);
        }
        onClose && onClose();
    };

    return (
        <div className="search-bar-overlay" onClick={onClose}>
            <div className="search-bar-container" onClick={(e) => e.stopPropagation()}>
                <div className="search-input-wrapper">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        autoFocus
                    />
                    <button className="search-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((result, index) => (
                            <div
                                key={index}
                                className="search-result-item"
                                onClick={() => handleResultClick(result)}
                            >
                                {result.type === 'category' ? (
                                    <>
                                        <span className="result-icon">{result.data.icon}</span>
                                        <div className="result-info">
                                            <h4>{result.data.name[currentLanguage] || result.data.name.en}</h4>
                                            <p>Category • {result.data.services.length} services</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="result-icon">{result.category.icon}</span>
                                        <div className="result-info">
                                            <h4>{result.data.name[currentLanguage] || result.data.name.en}</h4>
                                            <p>{result.category.name[currentLanguage] || result.category.name.en} • {result.data.price}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                    <div className="search-no-results">
                        <p>No services found for "{searchQuery}"</p>
                        <p>Try searching for: electrical, plumbing, painting, cleaning</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
