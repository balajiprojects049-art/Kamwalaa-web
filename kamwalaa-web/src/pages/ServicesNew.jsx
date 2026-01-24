import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageHero from '../components/common/PageHero';
import { FiSearch, FiChevronRight, FiClock, FiCheck, FiStar, FiUser, FiCalendar, FiInfo, FiShield, FiHeart, FiShare2, FiChevronDown, FiChevronUp, FiDollarSign, FiAward } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { getServiceCategories } from '../services/apiService';
import { getServiceIcon } from '../utils/serviceIcons';
import EnhancedServiceModal from '../components/EnhancedServiceModal';
import './Services.css';
import './CorporateEnhancements.css';

const Services = () => {
    const { t, currentLanguage } = useLanguage();
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const location = useLocation();

    // State
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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

    // Fetch categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const response = await getServiceCategories();

                if (response.success) {
                    // Transform the API data to match the expected structure
                    const categories = response.data.map(cat => ({
                        id: cat.slug,
                        name: { en: cat.name, hi: cat.name },
                        icon: cat.icon_name || 'wrench',
                        subcategories: cat.subcategories?.map(sub => ({
                            id: sub.slug,
                            name: { en: sub.name, hi: sub.name },
                            services: sub.services?.map(srv => ({
                                id: srv.id,
                                name: { en: srv.name, hi: srv.name },
                                price: `₹${srv.price}`,
                                duration: srv.duration || '1 hour',
                                rating: srv.average_rating || 4.5,
                                reviews: 0,
                                description: srv.description,
                                image: srv.image_url || '/images/default-service.jpg',
                                features: srv.features || []
                            })) || []
                        })) || []
                    }));

                    setAllCategories(categories);

                    if (categories.length > 0) {
                        setSelectedCategory(categories[0]);
                        if (categories[0].subcategories?.length > 0) {
                            setSelectedSubcategory(categories[0].subcategories[0]);
                        }
                    }
                }
            } catch (err) {
                console.error('Error loading categories:', err);
                setError('Failed to load services. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    // Initial Route Handling
    useEffect(() => {
        if (categoryId && allCategories.length > 0) {
            const category = allCategories.find(c => c.id === categoryId);
            if (category) {
                setSelectedCategory(category);

                const selectedServiceId = location.state?.selectedServiceId;
                if (selectedServiceId && category.subcategories) {
                    const subcat = category.subcategories.find(sc =>
                        sc.services.some(s => s.id === selectedServiceId)
                    );

                    if (subcat) {
                        setSelectedSubcategory(subcat);
                        const serviceToOpen = subcat.services.find(s => s.id === selectedServiceId);
                        if (serviceToOpen) {
                            setModalService(serviceToOpen);
                            setIsModalOpen(true);
                        }
                    }
                } else if (!selectedSubcategory || selectedSubcategory.id.indexOf(category.id) === -1) {
                    if (category.subcategories && category.subcategories.length > 0) {
                        setSelectedSubcategory(category.subcategories[0]);
                    }
                }
            }
        }
    }, [categoryId, location.state, allCategories]);

    const handleViewDetails = (service) => {
        setModalService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setModalService(null);
            setActiveImageIndex(0);
            setExpandedFAQ(null);
            setSelectedTimeSlot(null);
            setSelectedAddOns([]);
            setQuantity(1);
        }, 300);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category.subcategories && category.subcategories.length > 0) {
            setSelectedSubcategory(category.subcategories[0]);
        }
    };

    const handleSubcategoryChange = (subcategory) => {
        setSelectedSubcategory(subcategory);
    };

    const handleBookNow = () => {
        if (modalService) {
            handleCloseModal();
            navigate('/booking', {
                state: {
                    selectedServices: [modalService],
                    category: selectedCategory
                }
            });
        }
    };

    // Search Logic
    useEffect(() => {
        if (searchQuery.trim() && allCategories.length > 0) {
            const query = searchQuery.toLowerCase();
            const results = [];

            allCategories.forEach(cat => {
                cat.subcategories?.forEach(sub => {
                    sub.services?.forEach(service => {
                        const nameMatch = service.name[currentLanguage]?.toLowerCase().includes(query) ||
                            service.name.en?.toLowerCase().includes(query);
                        if (nameMatch) {
                            results.push(service);
                        }
                    });
                });
            });

            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, currentLanguage, allCategories]);

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
        { id: 3, name: "Amit Patel", rating: 5, date: "2 weeks ago", comment: "Highly recommended! Will book again." }
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

    if (loading) {
        return (
            <div className="services-page-layout">
                <PageHero
                    title="Our Services"
                    subtitle="Professional home services at your doorstep"
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '1.2rem',
                    color: '#666'
                }}>
                    Loading services...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="services-page-layout">
                <PageHero
                    title="Our Services"
                    subtitle="Professional home services at your doorstep"
                />
                <div style={{
                    maxWidth: '600px',
                    margin: '2rem auto',
                    padding: '1rem',
                    backgroundColor: '#fee',
                    color: '#c00',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            </div>
        );
    }

    if (allCategories.length === 0) {
        return (
            <div className="services-page-layout">
                <PageHero
                    title="Our Services"
                    subtitle="Professional home services at your doorstep"
                />
                <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: '#666'
                }}>
                    No services available at the moment.
                </div>
            </div>
        );
    }

    return (
