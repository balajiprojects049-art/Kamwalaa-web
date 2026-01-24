import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { getAllCategories } from '../../data/servicesData';
import { getServiceIcon } from '../../utils/serviceIcons';
import './ServicesSection.css';

const ServicesSection = () => {
    const { t, currentLanguage } = useLanguage();
    const categories = getAllCategories();

    return (
        <section className="services-section section">
            <div className="container">
                {/* Section Header */}
                <div className="section-header">
                    <div className="section-badge">
                        <span className="badge-icon">🔧</span>
                        <span>Our Services</span>
                    </div>
                    <h2 className="section-title">{t.services.title}</h2>
                    <p className="section-subtitle">{t.services.subtitle}</p>
                </div>

                {/* Services Grid */}
                <div className="services-grid">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="service-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="service-card-inner">
                                {/* Icon */}
                                {(() => {
                                    const IconComponent = getServiceIcon(category.id);
                                    if (category.image) {
                                        return (
                                            <div className="service-image-full">
                                                <img
                                                    src={category.image}
                                                    alt={category.name.en}
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            className="service-icon-wrapper"
                                            style={{
                                                background: category.bgColor,
                                                '--icon-gradient': category.gradient
                                            }}
                                        >
                                            <div className="service-icon-bg" style={{ background: category.gradient }}></div>
                                            <IconComponent className="service-icon" style={{ fontSize: '2.5rem', color: category.color }} />
                                        </div>
                                    );
                                })()}

                                {/* Content */}
                                <div className="service-content">
                                    <h3 className="service-title">{category.name[currentLanguage]}</h3>

                                    {/* Service List */}
                                    <ul className="service-list">
                                        {category.subcategories
                                            ?.flatMap(sub => sub.services)
                                            .slice(0, 3)
                                            .map((service) => (
                                                <li key={service.id} className="service-list-item">
                                                    <span className="list-icon">✓</span>
                                                    <span>{service.name[currentLanguage] || service.name.en}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <Link
                                    to={`/services/${category.id}`}
                                    className="service-cta"
                                    style={{ background: category.gradient }}
                                >
                                    <span>{t.services.bookService}</span>
                                    <FiArrowRight className="cta-arrow" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="services-footer">
                    <Link to="/services" className="btn btn-primary btn-lg">
                        {t.services.viewAll}
                        <FiZap />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
