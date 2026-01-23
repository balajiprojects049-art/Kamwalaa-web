import React from 'react';
import { FiStar, FiUser, FiCalendar, FiClock, FiCheck, FiChevronDown, FiChevronUp, FiDollarSign, FiShield, FiHeart, FiShare2, FiAward, FiInfo } from 'react-icons/fi';
import '../pages/EnhancedModal.css';

const EnhancedServiceModal = ({
    modalService,
    currentLanguage,
    handleCloseModal,
    handleBookService,
    mockReviews,
    mockProvider,
    mockTimeSlots,
    mockFAQs,
    mockAddOns,
    mockRelatedServices,
    expandedFAQ,
    toggleFAQ,
    selectedTimeSlot,
    setSelectedTimeSlot,
    selectedAddOns,
    handleAddOnToggle,
    quantity,
    setQuantity,
    isFavorite,
    setIsFavorite,
    handleShare,
    calculateTotal
}) => {
    if (!modalService) return null;

    return (
        <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content enhanced" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={handleCloseModal}>&times;</button>

                {/* Action Icons */}
                <div className="modal-action-icons">
                    <button onClick={() => setIsFavorite(!isFavorite)} className="icon-btn">
                        <FiHeart className={isFavorite ? 'active' : ''} />
                    </button>
                    <button onClick={handleShare} className="icon-btn">
                        <FiShare2 />
                    </button>
                </div>

                <div className="modal-body vertical-stack">
                    {/* 1. Image Gallery */}
                    <div className="modal-images-full">
                        {modalService.images && modalService.images.length > 0 ? (
                            <img
                                src={modalService.images[0]}
                                alt={modalService.name[currentLanguage] || modalService.name.en}
                                className="modal-main-image-full"
                            />
                        ) : (
                            <div className="modal-placeholder-image">
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>

                    {/* 2. Rating & Reviews Summary */}
                    <div className="modal-rating-section">
                        <div className="rating-display">
                            <FiStar className="star filled" />
                            <span className="rating-value">4.8</span>
                            <span className="rating-count">(245 reviews)</span>
                        </div>
                    </div>

                    {/* 3. Service Title */}
                    <div className="modal-header-section">
                        <h2>{modalService.name[currentLanguage] || modalService.name.en}</h2>
                    </div>

                    {/* 4. Service Provider Info */}
                    <div className="modal-provider-section">
                        <div className="provider-card">
                            <div className="provider-avatar">
                                <FiUser />
                            </div>
                            <div className="provider-info">
                                <h4>{mockProvider.name} {mockProvider.verified && <FiAward className="verified-badge" />}</h4>
                                <p>{mockProvider.experience} experience • {mockProvider.completedJobs}+ jobs</p>
                                <div className="provider-certs">
                                    {mockProvider.certifications.map((cert, idx) => (
                                        <span key={idx} className="cert-badge">{cert}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Pricing Breakdown */}
                    <div className="modal-pricing-breakdown">
                        <h3><FiDollarSign /> Pricing Details</h3>
                        <div className="price-row">
                            <span>Base Service Cost</span>
                            <span>{modalService.price}</span>
                        </div>
                        <div className="price-row">
                            <span>Quantity</span>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>
                        <div className="price-row total">
                            <span>Total Amount</span>
                            <span className="total-price">₹{calculateTotal()}</span>
                        </div>
                    </div>

                    {/* 6. Time Slot Selection */}
                    <div className="modal-timeslot-section">
                        <h3><FiCalendar /> Select Time Slot</h3>
                        <div className="timeslot-grid">
                            {mockTimeSlots.map(slot => (
                                <div
                                    key={slot.id}
                                    className={`timeslot-card ${selectedTimeSlot === slot.id ? 'selected' : ''} ${!slot.available ? 'disabled' : ''}`}
                                    onClick={() => slot.available && setSelectedTimeSlot(slot.id)}
                                >
                                    <div className="slot-date">{slot.date}</div>
                                    <div className="slot-time">{slot.time}</div>
                                    {slot.isPeak && <span className="peak-badge">Peak</span>}
                                    {!slot.available && <span className="unavailable-badge">Booked</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 7. Add-ons */}
                    <div className="modal-addons-section">
                        <h3>Add-on Services</h3>
                        {mockAddOns.map(addon => (
                            <div key={addon.id} className="addon-item">
                                <input
                                    type="checkbox"
                                    id={`addon-${addon.id}`}
                                    checked={selectedAddOns.includes(addon.id)}
                                    onChange={() => handleAddOnToggle(addon.id)}
                                />
                                <label htmlFor={`addon-${addon.id}`}>
                                    <span className="addon-name">{addon.name}</span>
                                    <span className="addon-price">{addon.price}</span>
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* 8. Description */}
                    <div className="modal-description-section">
                        <h3>About this Service</h3>
                        {modalService.description && (
                            <div className="multi-lang-desc">
                                <div className="desc-group en">
                                    <strong>English:</strong>
                                    <p>{modalService.description.en}</p>
                                </div>
                                {modalService.description.te && (
                                    <div className="desc-group te">
                                        <strong>Telugu:</strong>
                                        <p>{modalService.description.te}</p>
                                    </div>
                                )}
                                {modalService.description.hi && (
                                    <div className="desc-group hi">
                                        <strong>Hindi:</strong>
                                        <p>{modalService.description.hi}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 9. Service Benefits */}
                    <div className="modal-benefits-section">
                        <h3>What's Included</h3>
                        <div className="modal-features-grid">
                            <div className="modal-feature-item">
                                <FiCheck className="feature-icon" />
                                <span>Verified & Background Checked Professionals</span>
                            </div>
                            <div className="modal-feature-item">
                                <FiCheck className="feature-icon" />
                                <span>Safe, Hygienic & Contactless Service</span>
                            </div>
                            <div className="modal-feature-item">
                                <FiClock className="feature-icon" />
                                <span>On-time Arrival & Prompt Completion</span>
                            </div>
                            <div className="modal-feature-item">
                                <FiShield className="feature-icon" />
                                <span>30-Day Service Warranty</span>
                            </div>
                        </div>
                    </div>

                    {/* 10. Customer Reviews */}
                    <div className="modal-reviews-section">
                        <h3>Customer Reviews</h3>
                        {mockReviews.map(review => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-info">
                                        <strong>{review.name}</strong>
                                        <span className="review-date">{review.date}</span>
                                    </div>
                                    <div className="review-rating">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={i < review.rating ? 'star filled' : 'star'} />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                    {/* 11. FAQs */}
                    <div className="modal-faq-section">
                        <h3><FiInfo /> Frequently Asked Questions</h3>
                        {mockFAQs.map(faq => (
                            <div key={faq.id} className="faq-item">
                                <div className="faq-question" onClick={() => toggleFAQ(faq.id)}>
                                    <span>{faq.question}</span>
                                    {expandedFAQ === faq.id ? <FiChevronUp /> : <FiChevronDown />}
                                </div>
                                {expandedFAQ === faq.id && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 12. Warranty & Policies */}
                    <div className="modal-warranty-section">
                        <h3><FiShield /> Warranty & Policies</h3>
                        <div className="policy-grid">
                            <div className="policy-item">
                                <FiShield />
                                <div>
                                    <strong>30-Day Warranty</strong>
                                    <p>Full coverage on all services</p>
                                </div>
                            </div>
                            <div className="policy-item">
                                <FiClock />
                                <div>
                                    <strong>Free Cancellation</strong>
                                    <p>Up to 2 hours before service</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 13. Related Services */}
                    <div className="modal-related-section">
                        <h3>Related Services</h3>
                        <div className="related-services-grid">
                            {mockRelatedServices.map(service => (
                                <div key={service.id} className="related-service-card">
                                    <img src={service.image} alt={service.name} />
                                    <h4>{service.name}</h4>
                                    <p className="related-price">{service.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 14. Action Button */}
                    <div className="modal-action-section">
                        <button className="modal-book-btn-full" onClick={handleBookService}>
                            Book This Service - ₹{calculateTotal()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnhancedServiceModal;
