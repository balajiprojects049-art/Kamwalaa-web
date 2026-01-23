import React from 'react';
import { FiUsers, FiTarget, FiAward } from 'react-icons/fi';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="page-header about-header">
                <div className="container">
                    <h1 className="page-title">About Kamwalaa</h1>
                    <p className="page-subtitle">Revolutionizing Home Services in India</p>
                </div>
            </div>

            <div className="section container">
                <div className="about-content">
                    <div className="about-text">
                        <h2>Our Mission</h2>
                        <p>
                            Kamwalaa is dedicated to organizing fine home services by connecting customers with reliable, verified, and skilled professionals. We aim to bring structure to the unorganized home service sector in India, ensuring quality, transparency, and trust for every household.
                        </p>
                        <p>
                            Founded in Nellore, we understand the local needs and challenges of finding good help. Whether it's a leaking tap, a faulty switch, or a complete house cleaning, Kamwalaa is your one-stop solution.
                        </p>
                    </div>
                    <div className="about-visual">
                        <img src="/logo.png" alt="Kamwalaa Team" className="about-img" style={{ background: '#004976', padding: '2rem', borderRadius: '20px' }} />
                    </div>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <FiUsers className="value-icon" />
                        <h3>Customer First</h3>
                        <p>We prioritize customer satisfaction above all else, ensuring every service meets our high quality standards.</p>
                    </div>
                    <div className="value-card">
                        <FiTarget className="value-icon" />
                        <h3>Transparency</h3>
                        <p>Clear pricing, no hidden costs, and verified professionals. You know exactly what you get.</p>
                    </div>
                    <div className="value-card">
                        <FiAward className="value-icon" />
                        <h3>Excellence</h3>
                        <p>We train our professionals to deliver service excellence in every task they undertake.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
