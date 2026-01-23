import React from 'react';
import { FiCheckCircle, FiUsers, FiTrendingUp, FiStar } from 'react-icons/fi';
import './Statistics.css';

const Statistics = () => {
    const stats = [
        {
            icon: <FiCheckCircle />,
            number: '54+',
            label: 'Services',
            color: 'var(--primary-600)'
        },
        {
            icon: <FiUsers />,
            number: '500+',
            label: 'Service Providers',
            color: 'var(--secondary-600)'
        },
        {
            icon: <FiTrendingUp />,
            number: '10K+',
            label: 'Happy Customers',
            color: 'var(--success-600)'
        },
        {
            icon: <FiStar />,
            number: '4.8',
            label: 'Average Rating',
            color: 'var(--warning-600)'
        }
    ];

    return (
        <section className="statistics-section">
            <div className="container">
                <div className="statistics-grid">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-card"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="stat-icon-wrapper" style={{ color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <div className="stat-number" style={{ color: stat.color }}>
                                    {stat.number}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Statistics;
