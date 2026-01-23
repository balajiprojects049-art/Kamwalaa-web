import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './FeaturedServices.css';

const FeaturedServices = ({ title, services = [] }) => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();

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
            // Default service behavior
            navigate('/booking', {
                state: {
                    selectedServices: [item],
                    category: { id: item.categoryId }
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
                                {service.images && service.images.length > 0 ? (
                                    <img
                                        src={service.images[0]}
                                        alt={service.name[currentLanguage] || service.name.en}
                                        className="featured-img"
                                    />
                                ) : (
                                    // Fallback if no image, maybe use icon? 
                                    // But design requires image. We'll use a placeholder color or gradient
                                    <div style={{
                                        width: '100%', height: '100%',
                                        background: 'linear-gradient(135deg, #E5E7EB, #F9FAFB)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: '#9CA3AF'
                                    }}>
                                        Start
                                    </div>
                                )}
                            </div>

                            <div className="featured-info">
                                <div className="featured-name">
                                    {service.name[currentLanguage] || service.name.en}
                                </div>
                                <div className="featured-price">
                                    {service.price}
                                </div>
                                <button className="featured-btn">View Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedServices;
