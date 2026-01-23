import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FiSearch, FiChevronRight, FiClock, FiCheck, FiStar, FiUser, FiCalendar, FiInfo, FiShield, FiHeart, FiShare2, FiChevronDown, FiChevronUp, FiDollarSign, FiAward } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getAllCategories, getAllServicesFlat } from '../data/servicesData';
import { getServiceIcon } from '../utils/serviceIcons';
import EnhancedServiceModal from '../components/EnhancedServiceModal';
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

    // Enhanced Modal State
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);

    // Initial Route Handling
    useEffect(() => {
        if (categoryId) {
            const category = allCategories.find(c => c.id === categoryId);
            if (category) {
                // If the selected category is different, update it
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
                category: selectedCategory
            }
        });
    };

    // Mock Data for Corporate Features
    const mockReviews = [
        { id: 1, name: "Rajesh Kumar", rating: 5, date: "2 days ago", comment: "Excellent service! Very professional and timely." },
        { id: 2, name: "Priya Sharma", rating: 4, date: "1 week ago", comment: "Good work, but took slightly longer than expected." },
        { id: 3, name: "Anil Reddy", rating: 5, date: "2 weeks ago", comment: "Highly recommended! Will use again." }
    ];

    const mockProvider = {
        name: "Ravi Kumar",
        experience: "8 years",
        rating: 4.8,
        completedJobs: 1250,
        certifications: ["Certified Electrician", "Safety Trained"],
        verified: true
    };

    const mockTimeSlots = [
        { id: 1, date: "2026-01-24", time: "09:00 AM - 11:00 AM", available: true, isPeak: false },
        { id: 2, date: "2026-01-24", time: "02:00 PM - 04:00 PM", available: true, isPeak: true },
        { id: 3, date: "2026-01-25", time: "10:00 AM - 12:00 PM", available: true, isPeak: false },
        { id: 4, date: "2026-01-25", time: "03:00 PM - 05:00 PM", available: false, isPeak: true }
    ];

    const mockFAQs = [
        { id: 1, question: "How long does the service take?", answer: "Typically 30-45 minutes for standard installations." },
        { id: 2, question: "Do I need to provide any materials?", answer: "No, all necessary materials are included in the service." },
        { id: 3, question: "What is your cancellation policy?", answer: "Free cancellation up to 2 hours before the scheduled time." },
        { id: 4, question: "Is there a warranty?", answer: "Yes, all our services come with a 30-day warranty." }
    ];

    const mockAddOns = [
        { id: 1, name: "Extended Warranty (1 Year)", price: "₹199", checked: false },
        { id: 2, name: "Priority Service (Next Day)", price: "₹99", checked: false },
        { id: 3, name: "Deep Cleaning After Service", price: "₹149", checked: false }
    ];

    const mockRelatedServices = [
        { id: 1, name: "AC Servicing", price: "₹499", image: "/api/placeholder/100/75" },
        { id: 2, name: "Ceiling Fan Repair", price: "₹199", image: "/api/placeholder/100/75" },
        { id: 3, name: "Light Fixture Install", price: "₹299", image: "/api/placeholder/100/75" }
    ];

    // Handler Functions
    const toggleFAQ = (id) => {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const handleAddOnToggle = (id) => {
        if (selectedAddOns.includes(id)) {
            setSelectedAddOns(selectedAddOns.filter(item => item !== id));
        } else {
            setSelectedAddOns([...selectedAddOns, id]);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: modalService?.name?.en || 'Service',
                text: 'Check out this service from Kamwalaa!',
                url: window.location.href
            });
        }
    };

    const calculateTotal = () => {
        if (!modalService) return 0;
        const basePrice = parseInt(modalService.price.replace('₹', ''));
        const addOnsTotal = selectedAddOns.reduce((total, id) => {
            const addOn = mockAddOns.find(a => a.id === id);
            return total + (addOn ? parseInt(addOn.price.replace('₹', '')) : 0);
        }, 0);
        return (basePrice * quantity) + addOnsTotal;
    };


    return (
        <div className="services-page-layout">
            <PageHero
                title={t.nav.services}
                subtitle="Explore our professional home services"
            />

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

            {/* Enhanced Service Details Modal */}
            {isModalOpen && modalService && (
                <EnhancedServiceModal
                    modalService={modalService}
                    currentLanguage={currentLanguage}
                    handleCloseModal={handleCloseModal}
                    handleBookService={handleBookService}
                    mockReviews={mockReviews}
                    mockProvider={mockProvider}
                    mockTimeSlots={mockTimeSlots}
                    mockFAQs={mockFAQs}
                    mockAddOns={mockAddOns}
                    mockRelatedServices={mockRelatedServices}
                    expandedFAQ={expandedFAQ}
                    toggleFAQ={toggleFAQ}
                    selectedTimeSlot={selectedTimeSlot}
                    setSelectedTimeSlot={setSelectedTimeSlot}
                    selectedAddOns={selectedAddOns}
                    handleAddOnToggle={handleAddOnToggle}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    isFavorite={isFavorite}
                    setIsFavorite={setIsFavorite}
                    handleShare={handleShare}
                    calculateTotal={calculateTotal}
                />
            )}
        </div>
    );
};

export default Services;
