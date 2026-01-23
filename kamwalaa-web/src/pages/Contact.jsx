import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="page-header contact-header">
                <div className="container">
                    <h1 className="page-title">Contact Us</h1>
                    <p className="page-subtitle">We are here to help you</p>
                </div>
            </div>

            <div className="section container">
                <div className="contact-wrapper">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p className="contact-intro">Have questions about our services or need support? Reach out to us through any of the following channels.</p>

                        <div className="info-item">
                            <div className="info-icon"><FiMapPin /></div>
                            <div>
                                <h3>Visit Us</h3>
                                <p>Beside Vijaya Bank, Ramji Nagar,<br />Nellore, Andhra Pradesh - 524002</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><FiPhone /></div>
                            <div>
                                <h3>Call Us</h3>
                                <p>+91 98765 43210</p>
                                <p>+91 98765 43211</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"><FiMail /></div>
                            <div>
                                <h3>Email Us</h3>
                                <p>support@kamwalaa.com</p>
                                <p>info@kamwalaa.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h2>Send Message</h2>
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-input" placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-input" placeholder="Your Email" />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input type="text" className="form-input" placeholder="Subject" />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea className="form-input" rows="5" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
