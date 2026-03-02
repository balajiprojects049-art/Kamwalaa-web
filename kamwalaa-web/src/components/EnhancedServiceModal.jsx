import React from 'react';
import {
    FiStar, FiClock, FiCheck, FiChevronDown, FiChevronUp,
    FiShield, FiHeart, FiShare2, FiX, FiShoppingCart,
    FiMapPin, FiInfo, FiTag
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import '../pages/EnhancedModal.css';

const EnhancedServiceModal = ({
    modalService, currentLanguage,
    handleCloseModal, handleBookService,
    mockFAQs, expandedFAQ, toggleFAQ,
    selectedAddOns, handleAddOnToggle,
    quantity, setQuantity,
    isFavorite, setIsFavorite,
    handleShare, calculateTotal,
    // unused but kept for compat
    mockReviews, mockProvider, mockTimeSlots,
    mockAddOns, mockRelatedServices,
    selectedTimeSlot, setSelectedTimeSlot,
}) => {
    const { addToCart, setIsCartOpen } = useCart();

    const handleAddToCart = () => {
        addToCart({ ...modalService, quantity, selectedTimeSlot, selectedAddOns });
        setIsCartOpen(true);
        handleCloseModal();
    };

    if (!modalService) return null;

    const name = typeof modalService.name === 'object'
        ? (modalService.name[currentLanguage] || modalService.name.en)
        : modalService.name;

    const priceNum = parseInt(String(modalService.price).replace(/[^0-9]/g, '')) || 0;
    const total = priceNum * quantity;

    const includes = [
        { icon: FiCheck, text: 'Verified & background-checked professionals' },
        { icon: FiShield, text: '30-day service warranty' },
        { icon: FiClock, text: 'On-time arrival — 30 to 45 minutes' },
        { icon: FiCheck, text: 'Safe, hygienic & insured service' },
    ];

    return (
        <div className="em-overlay" onClick={handleCloseModal}>
            <div className="em-sheet" onClick={e => e.stopPropagation()}>

                {/* ── STICKY HEADER ── */}
                <div className="em-header">
                    <div className="em-header-actions">
                        <button
                            className="em-icon-btn"
                            onClick={() => setIsFavorite(!isFavorite)}
                            aria-label="Favourite"
                        >
                            <FiHeart className={isFavorite ? 'em-heart-active' : ''} />
                        </button>
                        <button className="em-icon-btn" onClick={handleShare} aria-label="Share">
                            <FiShare2 />
                        </button>
                    </div>
                    <button className="em-close-btn" onClick={handleCloseModal} aria-label="Close">
                        <FiX />
                    </button>
                </div>

                {/* ── SCROLLABLE CONTENT ── */}
                <div className="em-scroll">

                    {/* Image */}
                    {modalService.images?.[0] ? (
                        <div className="em-img-wrap">
                            <img src={modalService.images[0]} alt={name} className="em-img" />
                            <div className="em-img-badge"><FiTag /> Popular Service</div>
                        </div>
                    ) : (
                        <div className="em-img-placeholder">
                            <span>🛠️</span>
                        </div>
                    )}

                    {/* Title row */}
                    <div className="em-title-section">
                        <div className="em-rating-row">
                            <FiStar className="em-star" />
                            <span className="em-rating-val">4.8</span>
                            <span className="em-rating-ct">(245 reviews)</span>
                            <span className="em-dot" />
                            <FiShield className="em-verified-icon" />
                            <span className="em-verified-txt">Verified</span>
                        </div>
                        <h2 className="em-title">{name}</h2>
                        <div className="em-chips">
                            <span className="em-chip em-chip-green"><FiCheck /> Professional</span>
                            <span className="em-chip em-chip-blue"><FiClock /> 30–45 min</span>
                            <span className="em-chip em-chip-gold"><FiShield /> Insured</span>
                            <span className="em-chip em-chip-purple"><FiMapPin /> Hyderabad</span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="em-pricing">
                        <div className="em-pricing-header">
                            <FiTag className="em-pricing-icon" />
                            <span>Pricing Details</span>
                        </div>
                        <div className="em-price-row">
                            <span>Base Service Cost</span>
                            <span className="em-price-val">₹{priceNum}</span>
                        </div>
                        <div className="em-price-row">
                            <span>Quantity</span>
                            <div className="em-qty">
                                <button
                                    className="em-qty-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >−</button>
                                <span className="em-qty-val">{quantity}</span>
                                <button
                                    className="em-qty-btn"
                                    onClick={() => setQuantity(quantity + 1)}
                                >+</button>
                            </div>
                        </div>
                        <div className="em-price-total">
                            <span>Total Amount</span>
                            <span className="em-total-val">₹{total}</span>
                        </div>
                    </div>

                    {/* What's Included */}
                    <div className="em-section">
                        <h3 className="em-section-title">What's Included</h3>
                        <div className="em-includes">
                            {includes.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <div key={i} className="em-include-item">
                                        <Icon className="em-include-icon" />
                                        <span>{item.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    {modalService.description && (
                        <div className="em-section">
                            <h3 className="em-section-title">About this Service</h3>
                            <div className="em-desc-group">
                                <p>{modalService.description.en || modalService.description}</p>
                            </div>
                            {modalService.description.te && (
                                <div className="em-desc-group em-desc-te">
                                    <span className="em-desc-lang">Telugu</span>
                                    <p>{modalService.description.te}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FAQs */}
                    <div className="em-section">
                        <h3 className="em-section-title"><FiInfo /> Quick Answers</h3>
                        {mockFAQs.map(faq => (
                            <div key={faq.id} className={`em-faq ${expandedFAQ === faq.id ? 'open' : ''}`}>
                                <button className="em-faq-q" onClick={() => toggleFAQ(faq.id)}>
                                    <span>{faq.question}</span>
                                    {expandedFAQ === faq.id ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {expandedFAQ === faq.id && (
                                    <div className="em-faq-a"><p>{faq.answer}</p></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Warranty */}
                    <div className="em-section em-section-last">
                        <h3 className="em-section-title"><FiShield /> Our Promise</h3>
                        <div className="em-promise-grid">
                            <div className="em-promise-item">
                                <div className="em-promise-icon"><FiShield /></div>
                                <strong>30-Day Warranty</strong>
                                <p>Full coverage on all services</p>
                            </div>
                            <div className="em-promise-item">
                                <div className="em-promise-icon"><FiClock /></div>
                                <strong>Free Cancellation</strong>
                                <p>Up to 2 hours before service</p>
                            </div>
                            <div className="em-promise-item">
                                <div className="em-promise-icon"><FiCheck /></div>
                                <strong>Satisfaction Guaranteed</strong>
                                <p>We re-do if not satisfied</p>
                            </div>
                        </div>
                    </div>

                    {/* Spacer so content doesn't hide behind sticky CTA */}
                    <div className="em-cta-spacer" />
                </div>

                {/* ── STICKY BOTTOM CTA ── */}
                <div className="em-cta-bar">
                    <div className="em-cta-price">
                        <span className="em-cta-label">Total</span>
                        <span className="em-cta-amount">₹{total}</span>
                    </div>
                    <div className="em-cta-btns">
                        <button className="em-btn-cart" onClick={handleAddToCart}>
                            <FiShoppingCart />
                            <span>Cart</span>
                        </button>
                        <button className="em-btn-book" onClick={handleBookService}>
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedServiceModal;
