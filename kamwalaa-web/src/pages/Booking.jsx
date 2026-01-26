import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiClock, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import PageHero from '../components/common/PageHero';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/apiService';
import './Booking.css';

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentLanguage } = useLanguage();
    const toast = useToast();
    const { success, error: showError } = toast;
    const { user } = useAuth();
    const { selectedServices = [], category } = location.state || {};

    // Redirect if no services selected
    useEffect(() => {
        if (!selectedServices || selectedServices.length === 0) {
            navigate('/services');
        }
    }, [selectedServices, navigate]);

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || prev.fullName,
                phone: user.phone || prev.phone,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        // Address Details
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        pincode: '',
        landmark: '',
        // Booking Details
        date: '',
        timeSlot: '',
        // Payment
        paymentMethod: '',
        specialInstructions: ''
    });

    const timeSlots = [
        '08:00 AM - 10:00 AM',
        '10:00 AM - 12:00 PM',
        '12:00 PM - 02:00 PM',
        '02:00 PM - 04:00 PM',
        '04:00 PM - 06:00 PM',
        '06:00 PM - 08:00 PM'
    ];

    const validateStep = (stepNumber) => {
        const newErrors = {};

        if (stepNumber === 1) {
            if (!formData.fullName.trim()) {
                newErrors.fullName = 'Full name is required';
            } else if (formData.fullName.trim().length < 2) {
                newErrors.fullName = 'Name must be at least 2 characters';
            }

            if (!formData.phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
                newErrors.phone = 'Please enter a valid 10-digit mobile number';
            }

            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }

            if (!formData.address.trim()) {
                newErrors.address = 'Address is required';
            } else if (formData.address.trim().length < 10) {
                newErrors.address = 'Please provide a complete address';
            }

            if (!formData.city.trim()) {
                newErrors.city = 'City is required';
            }

            if (!formData.pincode.trim()) {
                newErrors.pincode = 'Pincode is required';
            } else if (!/^\d{6}$/.test(formData.pincode)) {
                newErrors.pincode = 'Pincode must be 6 digits';
            } else {
                // Check if pincode varies by city prefix
                // Hyderabad: 500xxx, Warangal: 506xxx, Nalgonda: 508xxx, Ranchi: 834xxx
                const allowedPrefixes = ['500', '506', '508', '834'];
                const isServiceable = allowedPrefixes.some(prefix => formData.pincode.startsWith(prefix));

                if (!isServiceable) {
                    newErrors.pincode = 'Service not available in this area yet. We serve Hyderabad, Warangal, and Nalgonda.';
                }
            }
        }

        if (stepNumber === 2) {
            if (!formData.date) {
                newErrors.date = 'Please select a date';
            } else {
                const selectedDate = new Date(formData.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    newErrors.date = 'Please select a future date';
                }
            }

            if (!formData.timeSlot) {
                newErrors.timeSlot = 'Please select a time slot';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleNextStep = () => {
        if (validateStep(step)) {
            if (step < 3) {
                setStep(step + 1);
                // Scroll to top on step change
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            showError('Please fill all required fields correctly');
        }
    };

    const handlePreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();

        if (!validateStep(3)) {
            showError('Please complete all required fields');
            return;
        }

        if (!user) {
            showError('Please login to verify your booking');
            // Save state and redirect to login
            navigate('/login', { state: { from: location.pathname, bookingState: location.state } });
            return;
        }

        setIsSubmitting(true);

        try {
            // Create a booking for each selected service
            // Note: In a real app, you might want a 'cart' concept or single booking with items.
            // For now, we loop.
            const bookingPromises = selectedServices.map(service => {
                console.log('Processing service:', service);

                // Format time slot to valid Time format for DB
                // Input: "08:00 AM - 10:00 AM" => Output: "08:00 AM" (Postgres handles this) or convert to 24h
                const formatTime = (slot) => {
                    if (!slot) return '10:00:00';
                    return slot.split(' - ')[0]; // returns "08:00 AM" etc.
                };

                const bookingPayload = {
                    user_id: user.id,
                    service_id: service.id,
                    booking_date: formData.date,
                    booking_time: formatTime(formData.timeSlot),
                    address_line1: formData.address,
                    address_line2: '', // Optional field
                    city: formData.city,
                    state: 'Telangana', // Default for now
                    pincode: formData.pincode,
                    landmark: formData.landmark,
                    special_instructions: formData.specialInstructions,
                    payment_method: formData.paymentMethod
                };
                return createBooking(bookingPayload);
            });

            const responses = await Promise.all(bookingPromises);
            console.log('Create Booking Response:', responses);

            // Get the real booking number from backend response
            // response.data holds the DB row
            const bookingId = responses[0]?.data?.booking_number || `BK-${Date.now()}`;

            success('Booking confirmed successfully!');

            // Navigate to success page
            setTimeout(() => {
                navigate('/booking-success', {
                    state: {
                        bookingId: bookingId,
                        ...formData,
                        selectedServices
                    }
                });
            }, 500);

        } catch (error) {
            console.error('Booking error:', error);
            if (error.response?.status === 500) {
                showError('Booking failed. Your session appears to be invalid or expired. Please Logout and Login again.');
            } else {
                showError(error.response?.data?.message || 'Failed to create booking. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };


    const isStepValid = () => {
        if (step === 1) {
            return formData.fullName && formData.phone && formData.address && formData.city && formData.pincode;
        }
        if (step === 2) {
            return formData.date && formData.timeSlot;
        }
        if (step === 3) {
            return !!formData.paymentMethod;
        }
        return true;
    };

    if (!selectedServices || selectedServices.length === 0) {
        return (
            <div className="container section center">
                <h2>No services selected</h2>
                <p>Please select services from our services page.</p>
                <button onClick={() => navigate('/services')} className="btn btn-primary">
                    Browse Services
                </button>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <PageHero
                title="Complete Your Booking"
                backgroundImage="/assets/images/hero/booking-hero.jpg"
                bgPosition="center center"
            >
            </PageHero>

            <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <div className="booking-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span>Address</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span>Schedule</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <span>Payment</span>
                    </div>
                </div>
            </div>

            <div className="container section">
                <div className="booking-content">
                    <div className="booking-form-wrapper">
                        <form onSubmit={handleSubmitBooking}>
                            {/* Step 1: Address Details */}
                            {step === 1 && (
                                <div className="booking-step">
                                    <div className="step-header">
                                        <FiMapPin />
                                        <h2>Service Address</h2>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Full Name *</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter your full name"
                                                className={errors.fullName ? 'error' : ''}
                                            />
                                            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="10-digit mobile number"
                                                maxLength="10"
                                                className={errors.phone ? 'error' : ''}
                                            />
                                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Email (Optional)</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="your.email@example.com"
                                                className={errors.email ? 'error' : ''}
                                            />
                                            {errors.email && <span className="error-message">{errors.email}</span>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Address *</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows="3"
                                                placeholder="House No., Building Name, Street"
                                                className={errors.address ? 'error' : ''}
                                            />
                                            {errors.address && <span className="error-message">{errors.address}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="City"
                                                className={errors.city ? 'error' : ''}
                                            />
                                            {errors.city && <span className="error-message">{errors.city}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Pincode *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="6-digit pincode"
                                                maxLength="6"
                                                className={errors.pincode ? 'error' : ''}
                                            />
                                            {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Landmark (Optional)</label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleInputChange}
                                                placeholder="Nearby landmark"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Schedule */}
                            {step === 2 && (
                                <div className="booking-step">
                                    <div className="step-header">
                                        <FiCalendar />
                                        <h2>Select Date & Time</h2>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>Preferred Date *</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                min={new Date().toISOString().split('T')[0]}
                                                className={errors.date ? 'error' : ''}
                                            />
                                            {errors.date && <span className="error-message">{errors.date}</span>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Time Slot *</label>
                                            <div className="time-slots">
                                                {timeSlots.map((slot) => (
                                                    <div
                                                        key={slot}
                                                        className={`time-slot ${formData.timeSlot === slot ? 'selected' : ''} ${errors.timeSlot ? 'error-slot' : ''}`}
                                                        onClick={() => {
                                                            setFormData({ ...formData, timeSlot: slot });
                                                            if (errors.timeSlot) {
                                                                setErrors({ ...errors, timeSlot: '' });
                                                            }
                                                        }}
                                                    >
                                                        <FiClock />
                                                        <span>{slot}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {errors.timeSlot && <span className="error-message">{errors.timeSlot}</span>}
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Special Instructions (Optional)</label>
                                            <textarea
                                                name="specialInstructions"
                                                value={formData.specialInstructions}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Any specific requirements or instructions for the service provider"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Payment */}
                            {step === 3 && (
                                <div className="booking-step">
                                    <div className="step-header">
                                        <FiCreditCard />
                                        <h2>Payment Method</h2>
                                    </div>
                                    <div className="payment-methods">
                                        <div
                                            className={`payment-method ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash"
                                                checked={formData.paymentMethod === 'cash'}
                                                onChange={handleInputChange}
                                            />
                                            <div className="payment-info">
                                                <h4>Cash on Service</h4>
                                                <p>Pay after service completion</p>
                                            </div>
                                        </div>
                                        <div
                                            className={`payment-method ${formData.paymentMethod === 'online' ? 'selected' : ''}`}
                                            onClick={() => setFormData({ ...formData, paymentMethod: 'online' })}
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="online"
                                                checked={formData.paymentMethod === 'online'}
                                                onChange={handleInputChange}
                                            />
                                            <div className="payment-info">
                                                <h4>Online Payment</h4>
                                                <p>UPI, Cards, Wallets (Coming Soon)</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="booking-terms">
                                        <FiCheckCircle />
                                        <p>By proceeding, you agree to our <a href="/terms">Terms & Conditions</a> and <a href="/privacy">Privacy Policy</a></p>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="booking-actions">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={handlePreviousStep}
                                        className="btn btn-outline"
                                    >
                                        Previous
                                    </button>
                                )}
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="btn btn-primary"
                                        disabled={!isStepValid()}
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting || !isStepValid()}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Booking Summary */}
                    <div className="booking-sidebar">
                        <div className="summary-card">
                            <h3>Booking Summary</h3>
                            <div className="summary-services">
                                <h4>{category?.name?.[currentLanguage] || 'Selected Services'}</h4>
                                {selectedServices.map((service, index) => (
                                    <div key={index} className="summary-item">
                                        <span>{service.name?.[currentLanguage] || service.name}</span>
                                        <span>{service.price}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-total">
                                <span>Total Items</span>
                                <span>{selectedServices.length}</span>
                            </div>
                            <div className="summary-note">
                                <p>💡 Final price will be confirmed by service provider based on work scope</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
