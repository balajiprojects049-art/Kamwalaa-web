import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { FiSearch, FiChevronRight, FiClock, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getAllCategories, getAllServicesFlat } from '../data/servicesData';
import { getServiceIcon } from '../utils/serviceIcons';
import './Services.css';

const Services = () => {
    const { t, currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const location = useLocation();

    // Data
    const allCategories = getAllCategories();

    // State
    const [selectedCategory, setSelectedCategory] = useState(allCategories[0]);
    const [selectedSubcategory, setSelectedSubcategory] = useState(allCategories[0]?.subcategories[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalService, setModalService] = useState(null);

    // Initial Route Handling
    useEffect(() => {
        if (categoryId) {
            const category = allCategories.find(c => c.id === categoryId);
            if (category) {
                // If the selected category is different, update it
                // Logic: Only force update if we are not already on it, OR if we need to set a specific subcat/service
                setSelectedCategory(category);

                // Handle specific service selection from state
                const selectedServiceId = location.state?.selectedServiceId;
                if (selectedServiceId && category.subcategories) {
                    // Find which subcategory contains this service
                    const subcat = category.subcategories.find(sc =>
                        sc.services.some(s => s.id === selectedServiceId)
                    );

                    if (subcat) {
                        setSelectedSubcategory(subcat);
                        // Auto-open the modal for that service
                        const serviceToOpen = subcat.services.find(s => s.id === selectedServiceId);
                        if (serviceToOpen) {
                            setModalService(serviceToOpen);
                            setIsModalOpen(true);
                        }
                    }
                } else if (!selectedSubcategory || selectedSubcategory.id.indexOf(category.id) === -1) {
                    // If no specific service, and current subcat doesn't match new category, select first
                    if (category.subcategories && category.subcategories.length > 0) {
                        setSelectedSubcategory(category.subcategories[0]);
                    }
                }
            }
        }
    }, [categoryId, location.state]);
    // Note: dependency on allCategories is stable. 

    const handleViewDetails = (service) => {
        setModalService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalService(null);
    };

    const handleBookService = () => {
        if (modalService) {
            navigate('/booking', {
                state: {
                    selectedServices: [modalService],
                    category: selectedCategory
                }
            });
        }
    };

    // Manual Category Click Handler
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        if (category.subcategories && category.subcategories.length > 0) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    };

    // Search Logic
    useEffect(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const allServices = getAllServicesFlat();
            const results = allServices.filter(service =>
                service.name[currentLanguage]?.toLowerCase().includes(query) ||
                service.name.en?.toLowerCase().includes(query)
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, currentLanguage]);

    const handleServiceClick = (service) => {
        navigate('/booking', {
            state: {
                selectedServices: [service],
                category: selectedCategory // This might be stale if search result is from different cat, but for booking it works. 
                // ideally find category from service.categoryId
            }
        });
    };

    return (
        <div className="services-page-layout">
            {/* Search Header - Fixed at Top */}
            <div className="services-search-header">
                <div className="container">
                    <div className="search-bar-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder={t.services?.searchPlaceholder || "Search for services..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="container main-content-area">
                {searchQuery ? (
                    // Search Results View
                    <div className="search-results-view">
                        <h3>Search Results ({searchResults.length})</h3>
                        <div className="services-grid">
                            {searchResults.map((service, idx) => (
                                <div key={idx} className="service-card" onClick={() => handleServiceClick(service)}>
                                    <div className="service-info">
                                        <h4>{service.name[currentLanguage] || service.name.en}</h4>
                                        <span className="price">{service.price}</span>
                                    </div>
                                    <button className="view-details-btn" onClick={(e) => { e.stopPropagation(); handleViewDetails(service); }}>
                                        View Details
                                    </button>
                                </div>
                            ))}
                            {searchResults.length === 0 && (
                                <div className="no-results">
                                    <p>No services found matching "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    // 3-Column Layout
                    <div className="three-column-layout">
                        {/* Column 1: Categories */}
                        <div className="column categories-column">
                            {allCategories.map(category => {
                                const Icon = getServiceIcon(category.id);
                                return (
                                    <div
                                        key={category.id}
                                        className={`category-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(category)}
                                    >
                                        <div className="cat-icon-wrapper">
                                            <Icon />
                                        </div>
                                        <span>{category.name[currentLanguage] || category.name.en}</span>
                                        <FiChevronRight className="arrow-icon" />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Column 2: Subcategories */}
                        <div className="column subcategories-column">
                            <div className="column-header">
                                <h3>{selectedCategory?.name[currentLanguage] || selectedCategory?.name.en}</h3>
                            </div>
                            <div className="subcategories-list">
                                {selectedCategory?.subcategories?.map(subcat => (
                                    <div
                                        key={subcat.id}
                                        className={`subcategory-item ${selectedSubcategory?.id === subcat.id ? 'active' : ''}`}
                                        onClick={() => setSelectedSubcategory(subcat)}
                                    >
                                        <div className="subcat-content">
                                            <h4>{subcat.name[currentLanguage] || subcat.name.en}</h4>
                                            <span className="service-count">{subcat.services?.length} Services</span>
                                        </div>
                                        <FiChevronRight className="arrow-icon" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Column 3: Services */}
                        <div className="column services-column">
                            <div className="column-header">
                                <h3>{selectedSubcategory?.name[currentLanguage] || selectedSubcategory?.name.en}</h3>
                            </div>

                            {/* Service Details Modal */}
                            {isModalOpen && modalService && (
                                <div className="modal-overlay" onClick={handleCloseModal}>
                                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                                        <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>

                                        <div className="modal-body">
                                            {/* Modal Images */}
                                            <div className="modal-images">
                                                {modalService.images && modalService.images.length > 0 ? (
                                                    <img
                                                        src={modalService.images[0]}
                                                        alt={modalService.name[currentLanguage] || modalService.name.en}
                                                        className="modal-main-image"
                                                    />
                                                ) : (
                                                    <div className="modal-placeholder-image">
                                                        <span>No Image Available</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Modal Info */}
                                            <div className="modal-info">
                                                <h2>{modalService.name[currentLanguage] || modalService.name.en}</h2>
                                                <div className="modal-price">
                                                    <span className="price-label">Price</span>
                                                    <span className="price-amount">{modalService.price}</span>
                                                </div>

                                                <div className="modal-description">
                                                    <h3>About this Service</h3>

                                                    {modalService.description && (
                                                        <div className="multi-lang-desc">
                                                            <div className="desc-group en">
                                                                <strong>English:</strong>
                                                                <p>{modalService.description.en}</p>
                                                            </div>
                                                            {modalService.description.te && (
                                                                <div className="desc-group te">
                                                                    <strong>Telugu:</strong>
                                                                    <p>{modalService.description.te}</p>
                                                                </div>
                                                            )}
                                                            {modalService.description.hi && (
                                                                <div className="desc-group hi">
                                                                    <strong>Hindi:</strong>
                                                                    <p>{modalService.description.hi}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="modal-extra-info">
                                                    <h3>Service Benefits</h3>
                                                    <div className="modal-features">
                                                        <div className="modal-feature-item">
                                                            <FiCheck className="feature-icon" />
                                                            <span>Verified & Background Checked Professionals</span>
                                                        </div>
                                                        <div className="modal-feature-item">
                                                            <FiCheck className="feature-icon" />
                                                            <span>Safe, Hygienic & Contactless Service</span>
                                                        </div>
                                                        <div className="modal-feature-item">
                                                            <FiClock className="feature-icon" />
                                                            <span>On-time Arrival & Prompt Completion</span>
                                                        </div>
                                                        <div className="modal-feature-item">
                                                            <FiCheck className="feature-icon" />
                                                            <span>30-Day Service Warranty</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button className="modal-book-btn" onClick={handleBookService}>
                                                    Book This Service
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="services-list-grid">
                                {selectedSubcategory?.services?.map((service, idx) => (
                                    <div key={idx} className="service-card-item">
                                        {/* Service Image */}
                                        {service.images && service.images.length > 0 && (
                                            <div className="service-img-wrapper">
                                                <img
                                                    src={service.images[0]}
                                                    alt={service.name[currentLanguage] || service.name.en}
                                                    className="service-img"
                                                />
                                            </div>
                                        )}

                                        <div className="service-card-content">
                                            <div className="service-main-info">
                                                <h4>{service.name[currentLanguage] || service.name.en}</h4>
                                                <div className="price-tag">{service.price}</div>

                                                {/* Service Description */}
                                                {service.description && (
                                                    <p className="service-description">
                                                        {service.description[currentLanguage] || service.description.en}
                                                    </p>
                                                )}
                                            </div>
                                            <ul className="service-features">
                                                <li><FiCheck /> Professional Service</li>
                                                <li><FiClock /> 30-45 mins</li>
                                            </ul>
                                        </div>
                                        <div className="service-card-action">
                                            <button
                                                className="view-details-btn"
                                                onClick={() => handleViewDetails(service)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;
