import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiZap, FiDollarSign, FiTarget, FiStar } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import HeroSearch from './HeroSearch';
import './Hero.css';

const Hero = () => {
    const { t } = useLanguage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        { icon: 'sparkles', text: 'Professional Service Providers', te: 'ప్రొఫెషనల్ సర్వీస్ ప్రొవైడర్లు', hi: 'पेशेवर सेवा प्रदाता' },
        { icon: 'dollar', text: 'Transparent Pricing', te: 'పారదర్శక ధరలు', hi: 'पारदर्शी मूल्य निर्धारण' },
        { icon: 'zap', text: 'Quick & Reliable Service', te: 'త్వరిత & నమ్మకమైన సేవ', hi: 'त्वरित और विश्वसनीय सेवा' },
        { icon: 'target', text: '54+ Services Available', te: '54+ సేవలు అందుబాటులో', hi: '54+ सेवाएं उपलब्ध' }
    ];

    return (
        <section className="hero">
            <div className="hero-bg-pattern"></div>
            <div className="hero-gradient-overlay"></div>

            <div className="container">
                <div className="hero-content">
                    {/* Left Content */}
                    <div className="hero-text">
                        <div className="hero-badge animate-fade-in">
                            <span className="badge-dot"></span>
                            <span>Trusted by 10,000+ Happy Customers</span>
                        </div>

                        <h1 className="hero-title animate-fade-in-up">
                            {t.hero.title}
                        </h1>

                        <p className="hero-subtitle animate-fade-in-up">
                            {t.hero.subtitle}
                        </p>

                        {/* Search Bar */}
                        <div className="hero-search-container animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <HeroSearch />
                        </div>

                        <div className="hero-features">
                            {features.map((feature, index) => {
                                let IconComponent;
                                switch (feature.icon) {
                                    case 'sparkles':
                                        IconComponent = FiStar;
                                        break;
                                    case 'dollar':
                                        IconComponent = FiDollarSign;
                                        break;
                                    case 'zap':
                                        IconComponent = FiZap;
                                        break;
                                    case 'target':
                                        IconComponent = FiTarget;
                                        break;
                                    default:
                                        IconComponent = FiCheckCircle;
                                }
                                return (
                                    <div
                                        key={index}
                                        className="hero-feature animate-fade-in-up"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <IconComponent className="feature-icon" />
                                        <span className="feature-text">{feature.text}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hero-cta-group animate-fade-in-up">
                            <Link to="/services" className="btn btn-primary btn-lg">
                                {t.hero.cta}
                                <FiArrowRight />
                            </Link>
                            <Link to="/contact" className="btn btn-outline btn-lg">
                                {t.hero.bookNow}
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="hero-stats animate-fade-in">
                            <div className="stat-item">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Happy Customers</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">54+</div>
                                <div className="stat-label">Services</div>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-item">
                                <div className="stat-number">500+</div>
                                <div className="stat-label">Service Providers</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual */}
                    <div className="hero-visual">
                        <div className="hero-image-wrapper animate-float">
                            {/* Slideshow Images */}
                            {[
                                '/assets/images/hero-collage-1.png',
                                '/assets/images/hero-collage-2.jpg',
                                '/assets/images/hero-collage-3.jpg'
                            ].map((imgSrc, index) => (
                                <img
                                    key={index}
                                    src={imgSrc}
                                    alt={`Professional Home Services ${index + 1}`}
                                    className={`hero-main-image ${index === currentImageIndex ? 'active' : ''}`}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: index === currentImageIndex ? 1 : 0,
                                        transition: 'opacity 1s ease-in-out',
                                        zIndex: index === currentImageIndex ? 2 : 1,
                                        borderRadius: 'inherit'
                                    }}
                                    onError={(e) => {
                                        console.error(`Failed to load image: ${imgSrc}`);
                                        e.target.src = 'https://via.placeholder.com/600x600?text=Service+Image';
                                    }}
                                />
                            ))}

                            {/* Ensure height is maintained by an invisible duplicate or fixed height container. 
                                Since absolute positioning removes flow, we use the first image as static placeholder if needed, 
                                but better to rely on CSS height or a relative container. 
                                For now, I'll keep the first image as a relative 'spacer' but hidden, or just set container height.
                                Actually better: Make the wrapper have aspect ratio. 
                                However, to keep it simple, I'll use the first image as 'relative' and others 'absolute' 
                                BUT that messes up transitions. 
                                Best approach: Wrapper has fixed aspect ratio or size.
                                Let's assume the wrapper 'hero-image-wrapper' in CSS sets dimensions.
                            */}
                            {/* Spacer Image (Invisible) to keep layout size */}
                            <img
                                src="/assets/images/hero-collage-1.png"
                                alt=""
                                style={{ visibility: 'hidden', pointerEvents: 'none' }}
                                className="hero-main-image"
                            />

                            <div className="floating-badge badge-1">
                                <FiZap className="badge-icon" />
                                <div className="badge-content">
                                    <div className="badge-title">Same Day Service</div>
                                    <div className="badge-subtitle">Available Now</div>
                                </div>
                            </div>

                            <div className="floating-badge badge-2">
                                <FiCheckCircle className="badge-icon" />
                                <div className="badge-content">
                                    <div className="badge-title">100% Satisfaction</div>
                                    <div className="badge-subtitle">Guaranteed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
