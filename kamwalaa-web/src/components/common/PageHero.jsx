import React from 'react';
import './PageHero.css';

const PageHero = ({ title, subtitle, backgroundImage, bgPosition = 'center center', children }) => {
    return (
        <div className="page-hero">
            {backgroundImage && (
                <>
                    <div className="page-hero-bg" style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundPosition: bgPosition
                    }}></div>
                    <div className="page-hero-overlay"></div>
                </>
            )}
            <div className="container">
                <div className="page-hero-content animate-fade-in-up">
                    <h1 className="page-hero-title">{title}</h1>
                    {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageHero;
