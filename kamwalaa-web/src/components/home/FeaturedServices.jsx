import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiShield } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import './FeaturedServices.css';

const FeaturedServices = ({ title, services = [] }) => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const [selectedService, setSelectedService] = React.useState(null);

    const handleServiceClick = (item) => {
        if (item.type === 'category') {
            navigate('/services', { state: { initialCategory: item.id } });
        } else if (item.type === 'subcategory') {
            navigate('/services', {
                state: {
                    initialCategory: item.categoryId,
                    initialSubcategory: item.id
                }
            });
        } else {
            setSelectedService(item);
        }
    };

    const handleBookService = () => {
        if (selectedService) {
            navigate('/booking', {
                state: {
                    selectedServices: [selectedService],
                    category: { id: selectedService.categoryId }
                }
            });
        }
    };

    if (!services || services.length === 0) return null;

    return (
        <div className="featured-section">
            <div className="container">
                <div className="featured-header">
                    <h3>{title}</h3>
                </div>

                <div className="featured-grid">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="featured-card"
                            onClick={() => handleServiceClick(service)}
                        >
                            <div className="featured-img-wrapper">
                                {idx === 0 && (
                                    <div className="fs-popular-badge">
                                        <FiStar fill="#fff" /> Popular
                                    </div>
                                )}
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={service.images[0]}
                                        alt={service.name[currentLanguage] || service.name.en}
                                        className="featured-img"
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '100%',
                                        background: 'linear-gradient(135deg, #E5E7EB, #F9FAFB)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#9CA3AF'
                                    }}>
                                        Service
                                    </div>
                                )}
                            </div>

                            <div className="featured-info">
                                <div className="featured-name-row">
                                    <div className="featured-name">
                                        {service.name[currentLanguage] || service.name.en}
                                    </div>
                                    <FiShield className="fs-verified-icon" title="Verified" />
                                </div>

                                <div className="featured-rating">
                                    <FiStar className="fs-star filled" />
                                    <span className="fs-rating-val">4.{8 - (idx % 3)}</span>
                                    <span className="fs-rating-count">({120 + idx * 15})</span>
                                </div>

                                <div className="featured-price-row">
                                    {service.price && service.price !== 'View Services' && (
                                        <div className="featured-price">
                                            ₹{service.price}
                                        </div>
                                    )}
                                    <button className="featured-btn">View</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className="fs-modal-overlay" onClick={() => setSelectedService(null)}>
                    <div className="fs-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="fs-modal-close" onClick={() => setSelectedService(null)}>×</button>

                        <div className="fs-modal-body">
                            <div className="fs-modal-image-col">
                                {selectedService.images && selectedService.images.length > 0 ? (
                                    <img
                                        src={selectedService.images[0]}
                                        alt={selectedService.name.en}
                                        className="fs-modal-img"
                                    />
                                ) : (
                                    <div className="fs-modal-img-placeholder"></div>
                                )}
                            </div>

                            <div className="fs-modal-info-col">
                                <h2 className="fs-modal-title">{selectedService.name.en}</h2>
                                <div className="fs-modal-price">
                                    <span className="fs-price-label">Price</span>
                                    <span className="fs-price-value">₹{selectedService.price}</span>
                                </div>

                                <div className="fs-modal-section">
                                    <h3>About this Service</h3>

                                    <div className="fs-lang-desc">
                                        <strong>English:</strong>
                                        <p>{selectedService.description?.en || "Professional service delivery with verified experts."}</p>
                                    </div>

                                    {selectedService.description?.te && (
                                        <div className="fs-lang-desc">
                                            <strong>Telugu:</strong>
                                            <p>{selectedService.description.te}</p>
                                        </div>
                                    )}

                                    {selectedService.description?.hi && (
                                        <div className="fs-lang-desc">
                                            <strong>Hindi:</strong>
                                            <p>{selectedService.description.hi}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="fs-modal-section">
                                    <h3>Service Benefits</h3>
                                    <ul className="fs-benefits-list">
                                        <li>
                                            <span className="fs-check-icon">✓</span>
                                            Verified & Background Checked Professionals
                                        </li>
                                        <li>
                                            <span className="fs-check-icon">✓</span>
                                            Safe, Hygienic & Contactless Service
                                        </li>
                                        <li>
                                            <span className="fs-check-icon">✓</span>
                                            On-time Arrival & Prompt Completion
                                        </li>
                                        <li>
                                            <span className="fs-check-icon">✓</span>
                                            30-Day Service Warranty
                                        </li>
                                    </ul>
                                </div>

                                <button className="fs-book-btn" onClick={handleBookService}>
                                    Book This Service
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeaturedServices;
