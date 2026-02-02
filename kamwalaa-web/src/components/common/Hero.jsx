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





                        <div className="hero-cta-group animate-fade-in-up">
                            <Link to="/services" className="btn btn-primary btn-lg">
                                {t.hero.cta}
                                <FiArrowRight />
                            </Link>
                            <Link to="/contact" className="btn btn-outline btn-lg">
                                {t.hero.bookNow}
                            </Link>
                        </div>


                    </div>

                    {/* Right Visual */}
                    <div className="hero-visual">
                        {/* Search Bar */}
                        <div className="hero-search-container animate-fade-in-up" style={{ animationDelay: '0.2s', width: '100%', maxWidth: '600px', marginBottom: '2rem', marginTop: '-40px', zIndex: 10 }}>
                            <HeroSearch />
                        </div>

                        <div className="hero-image-wrapper animate-float">
                            {/* Slideshow Images */}
                            {[
                                '/assets/images/hero-services.png',
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
                                src="/assets/images/hero-services.png"
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
