import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { servicesData } from '../../data/servicesData';
import { useLanguage } from '../../context/LanguageContext';
import './ServiceCategoriesSlider.css';

const ServiceCategoriesSlider = () => {
    const navigate = useNavigate();
    const { currentLanguage } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(4);

    const categories = Object.values(servicesData);
    const totalSlides = categories.length;

    // Responsive cards count
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 480) setCardsToShow(1);
            else if (window.innerWidth < 768) setCardsToShow(2);
            else if (window.innerWidth < 1024) setCardsToShow(3);
            else setCardsToShow(4);
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + 1 > totalSlides - cardsToShow ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev - 1 < 0 ? totalSlides - cardsToShow : prev - 1
        );
    };

    // Auto slide
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [cardsToShow, totalSlides]); // dependency update

    const handleCategoryClick = (categoryId) => {
        navigate('/services', { state: { initialCategory: categoryId } });
    };

    const translateX = -(currentIndex * (100 / cardsToShow)) + '%';

    return (
        <div className="service-categories-slider">
            <div className="slider-container">
                <div className="slider-header">
                    <h2>Our Services</h2>
                    <p>Professional services at your doorstep</p>
                </div>



                <div className="slider-wrapper">

                    <div
                        className="slider-track"
                        style={{
                            transform: `translateX(calc(-${currentIndex} * (100% / ${cardsToShow} + 0.75rem / ${cardsToShow})))`
                        }}
                    >
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="category-slide-card"
                                onClick={() => handleCategoryClick(category.id)}
                            >
                                <div className="slide-icon-wrapper">
                                    {category.iconPath ? (
                                        <img
                                            src={category.iconPath}
                                            alt={category.name.en}
                                            className="category-icon-img"
                                            style={{ width: '75%', height: '75%', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        category.icon
                                    )}
                                </div>
                                <h3>{category.name[currentLanguage] || category.name.en}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="slider-dots">
                    {Array.from({ length: Math.max(0, totalSlides - cardsToShow + 1) }).map((_, idx) => (
                        <span
                            key={idx}
                            className={`slider-dot ${currentIndex === idx ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceCategoriesSlider;
