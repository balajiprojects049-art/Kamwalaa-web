import React, { useState } from 'react';
import PageHero from '../components/common/PageHero';
import { FiTrendingUp, FiClock, FiDollarSign } from 'react-icons/fi';
import { getAllCategories } from '../data/servicesData';
import './BecomePartner.css';

const BecomePartner = () => {
    const categories = getAllCategories();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        serviceCategory: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Partner Registration:', formData);
        alert('Thank you for registering! Our team will verify your details and contact you shortly.');
        setFormData({ name: '', phone: '', city: '', serviceCategory: '' });
    };

    return (
        <div className="partner-page">
            <PageHero
                title="Become a Partner"
                subtitle="Join India's fastest growing home services platform"
            />

            <div className="container partner-layout">
                {/* Left Side: Benefits */}
                <div className="partner-benefits">
                    <h2>Why Join Kamwalaa?</h2>
                    <p className="partner-intro">
                        Are you a skilled professional looking to grow your business?
                        Join Kamwalaa today and get access to thousands of customers looking for your services.
                    </p>

                    <div className="benefit-card">
                        <div className="benefit-icon"><FiTrendingUp /></div>
                        <div>
                            <h3>Grow Your Business</h3>
                            <p>Get verified leads and expand your customer base instantly.</p>
                        </div>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon"><FiClock /></div>
                        <div>
                            <h3>Work on Your Terms</h3>
                            <p>Choose your own timings and location. You are your own boss.</p>
                        </div>
                    </div>

                    <div className="benefit-card">
                        <div className="benefit-icon"><FiDollarSign /></div>
                        <div>
                            <h3>Earn More</h3>
                            <p>Transparent pricing and regular payments directly to your account.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Registration Form */}
                <div className="partner-form-wrapper">
                    <div className="partner-form-card">
                        <h3>Register as a Professional</h3>
                        <p>Fill in your details to get started</p>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <div className="input-group">
                                    <span className="input-prefix">+91</span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="1234567890"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Select Your Service</label>
                                <select
                                    name="serviceCategory"
                                    value={formData.serviceCategory}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                >
                                    <option value="">Choose a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name.en}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Enter your city"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-primary btn-block btn-lg">
                                Join Now
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* How it works Section */}
            <div className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title">How it Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h4>Register Online</h4>
                            <p>Fill out the form and submit your basic details.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h4>Get Verified</h4>
                            <p>Our team will verify your skills and background.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h4>Start Working</h4>
                            <p>Get access to the partner app and start accepting jobs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BecomePartner;
