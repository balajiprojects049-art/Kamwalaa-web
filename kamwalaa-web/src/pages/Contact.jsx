import React, { useState } from 'react';
import {
    FiMapPin, FiPhone, FiMail, FiClock, FiSend,
    FiCheckCircle, FiMessageSquare, FiHeadphones,
    FiUser, FiBook, FiChevronRight
} from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [focused, setFocused] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1400));
        setSending(false);
        setSubmitted(true);
    };

    const infoCards = [
        {
            icon: FiMapPin,
            color: '#1a3a6b',
            label: 'Visit Us',
            lines: [
                'Plot No: 18, Hno: 2-1-54/18, Bitla Residency,',
                'Venkateshwara Colony, Near Uppal Metro Station,',
                'Uppal, Hyderabad, Telangana — 500039',
            ],
            action: null,
        },
        {
            icon: FiPhone,
            color: '#d4a843',
            label: 'Call Us',
            lines: ['+91 90305 45655'],
            action: 'tel:+919030545655',
        },
        {
            icon: FiMail,
            color: '#22c55e',
            label: 'Email Us',
            lines: ['support@kamwalaa.com'],
            action: 'mailto:support@kamwalaa.com',
        },
        {
            icon: FiClock,
            color: '#7c3aed',
            label: 'Support Hours',
            lines: ['Mon – Sat: 8:00 AM – 8:00 PM', 'Sunday: 10:00 AM – 6:00 PM'],
            action: null,
        },
    ];

    const faqs = [
        { q: 'How quickly can I get a service?', a: 'Most services are available same day or next day, depending on availability in your area.' },
        { q: 'Are your professionals verified?', a: 'Yes. Every partner goes through background checks, skill tests, and in-person interviews.' },
        { q: 'What if I am not satisfied?', a: 'We offer a 100% satisfaction guarantee. Raise a concern and we will resolve it within 24 hours.' },
    ];

    return (
        <div className="contact-page-v2">

            {/* ── HERO ── */}
            <div className="contact-hero">
                <div className="contact-hero-blob contact-hero-blob-1" />
                <div className="contact-hero-blob contact-hero-blob-2" />
                <div className="container contact-hero-inner">
                    <span className="contact-hero-eyebrow">
                        <FiHeadphones /> Get In Touch
                    </span>
                    <h1 className="contact-hero-title">We're Here<br /><span className="contact-gold-text">For You</span></h1>
                    <p className="contact-hero-sub">
                        Have a question, feedback, or need help booking a service?<br className="hide-mobile" />
                        Our team responds within 2 hours.
                    </p>
                    <div className="contact-hero-chips">
                        <span><FiCheckCircle /> 2-Hr Response</span>
                        <span><FiCheckCircle /> 24/7 WhatsApp</span>
                        <span><FiCheckCircle /> Free Consultation</span>
                    </div>
                </div>
            </div>

            {/* ── INFO CARDS ── */}
            <div className="container">
                <div className="contact-info-grid">
                    {infoCards.map((card, i) => {
                        const Icon = card.icon;
                        const inner = (
                            <>
                                <div className="ci-icon-wrap" style={{ '--ci-color': card.color }}>
                                    <Icon />
                                </div>
                                <div className="ci-body">
                                    <div className="ci-label">{card.label}</div>
                                    {card.lines.map((l, j) => (
                                        <div key={j} className="ci-line">{l}</div>
                                    ))}
                                </div>
                                {card.action && <FiChevronRight className="ci-arrow" />}
                            </>
                        );
                        return card.action ? (
                            <a key={i} href={card.action} className="contact-info-card ci-link">{inner}</a>
                        ) : (
                            <div key={i} className="contact-info-card">{inner}</div>
                        );
                    })}
                </div>
            </div>

            {/* ── MAIN SECTION: Form + Map ── */}
            <div className="container contact-main-section">
                <div className="contact-main-grid">

                    {/* FORM CARD */}
                    <div className="contact-form-card-v2">
                        <div className="cfc-header">
                            <FiMessageSquare className="cfc-header-icon" />
                            <div>
                                <h2 className="cfc-title">Send Us a Message</h2>
                                <p className="cfc-subtitle">We'll reply to your email within 2 hours</p>
                            </div>
                        </div>

                        {submitted ? (
                            <div className="contact-success">
                                <div className="contact-success-icon">✅</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you, <strong>{form.name}</strong>! We've received your message and will get back to you at <strong>{form.email}</strong> within 2 hours.</p>
                                <button
                                    className="contact-success-btn"
                                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="contact-form-v2" onSubmit={handleSubmit} noValidate>
                                <div className="cf-row">
                                    <div className={`cf-group ${focused === 'name' ? 'focused' : ''} ${form.name ? 'has-val' : ''}`}>
                                        <FiUser className="cf-icon" />
                                        <input
                                            type="text" name="name" id="cf-name"
                                            required value={form.name}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('name')}
                                            onBlur={() => setFocused('')}
                                        />
                                        <label htmlFor="cf-name">Your Name *</label>
                                    </div>
                                    <div className={`cf-group ${focused === 'phone' ? 'focused' : ''} ${form.phone ? 'has-val' : ''}`}>
                                        <FiPhone className="cf-icon" />
                                        <input
                                            type="tel" name="phone" id="cf-phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                            onFocus={() => setFocused('phone')}
                                            onBlur={() => setFocused('')}
                                        />
                                        <label htmlFor="cf-phone">Phone Number</label>
                                    </div>
                                </div>

                                <div className={`cf-group ${focused === 'email' ? 'focused' : ''} ${form.email ? 'has-val' : ''}`}>
                                    <FiMail className="cf-icon" />
                                    <input
                                        type="email" name="email" id="cf-email"
                                        required value={form.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                    />
                                    <label htmlFor="cf-email">Email Address *</label>
                                </div>

                                <div className={`cf-group ${focused === 'subject' ? 'focused' : ''} ${form.subject ? 'has-val' : ''}`}>
                                    <FiBook className="cf-icon" />
                                    <input
                                        type="text" name="subject" id="cf-subject"
                                        required value={form.subject}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('subject')}
                                        onBlur={() => setFocused('')}
                                    />
                                    <label htmlFor="cf-subject">Subject *</label>
                                </div>

                                <div className={`cf-group cf-group-textarea ${focused === 'message' ? 'focused' : ''} ${form.message ? 'has-val' : ''}`}>
                                    <textarea
                                        name="message" id="cf-message"
                                        rows="5" required value={form.message}
                                        onChange={handleChange}
                                        onFocus={() => setFocused('message')}
                                        onBlur={() => setFocused('')}
                                    />
                                    <label htmlFor="cf-message">Your Message *</label>
                                </div>

                                <button type="submit" className="contact-submit-btn" disabled={sending}>
                                    {sending ? (
                                        <><span className="contact-spinner" /> Sending…</>
                                    ) : (
                                        <><FiSend /> Send Message</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* MAP + FAQ */}
                    <div className="contact-right-col">
                        {/* Google Map embed */}
                        <div className="contact-map-wrap">
                            <iframe
                                title="Kamwalaa Office Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.573780423746!2d78.55869507516543!3d17.40484970098604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99b3e3d12ef3%3A0xd1e3aa9e95283be8!2sUppal%2C%20Hyderabad%2C%20Telangana%20500039!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                            <div className="map-pin-badge">
                                <FiMapPin /> Uppal, Hyderabad
                            </div>
                        </div>

                        {/* FAQ */}
                        <div className="contact-faq">
                            <h3 className="contact-faq-title">Quick Answers</h3>
                            {faqs.map((faq, i) => (
                                <details key={i} className="contact-faq-item">
                                    <summary className="contact-faq-q">{faq.q}</summary>
                                    <p className="contact-faq-a">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── WHATSAPP FLOATING CTA ── */}
            <a
                href="https://wa.me/919030545655?text=Hi%20Kamwalaa%2C%20I%20need%20help%20with%20a%20service"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-whatsapp-cta"
                aria-label="Chat on WhatsApp"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Chat on WhatsApp</span>
            </a>
        </div>
    );
};

export default Contact;
