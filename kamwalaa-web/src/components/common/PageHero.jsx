import React from 'react';
import './PageHero.css';

const PageHero = ({ title, subtitle, backgroundImage }) => {
    const style = backgroundImage
        ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})` }
        : {};

    return (
        <div className="page-hero" style={style}>
            <div className="container">
                <div className="page-hero-content animate-fade-in-up">
                    <h1 className="page-hero-title">{title}</h1>
                    {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default PageHero;
