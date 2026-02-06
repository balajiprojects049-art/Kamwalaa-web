// ========================================
// FRONTEND INTEGRATION CODE
// Add this to your payment success handler
// ========================================

import { useState } from 'react';

/**
 * Complete Payment Flow with WhatsApp & Admin Notifications
 * 
 * This example shows how to integrate the payment confirmation
 * that triggers WhatsApp message to 9030545655 and admin panel notification
 */

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// ===========================
// Payment Confirmation Function
// ===========================

export const confirmPaymentAndNotify = async (bookingId, paymentData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/bookings/${bookingId}/confirm-payment`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payment_id: paymentData.payment_id, // e.g., razorpay_payment_id
                    payment_method: paymentData.payment_method // e.g., 'razorpay', 'cod', 'upi'
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Payment confirmation failed');
        }

        return {
            success: true,
            data: result.data,
            message: 'Payment confirmed! Admin notified via WhatsApp & Dashboard.'
        };

    } catch (error) {
        console.error('Payment confirmation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// ===========================
// Example: Razorpay Integration
// ===========================

export const handleRazorpayPayment = (bookingData) => {
    const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: bookingData.total_amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Kamwalaa Services',
        description: `Booking #${bookingData.booking_number}`,
        order_id: bookingData.razorpay_order_id,

        // Success Handler
        handler: async function (response) {
            console.log('Payment successful:', response);

            // Confirm payment and trigger notifications
            const confirmation = await confirmPaymentAndNotify(
                bookingData.id,
                {
                    payment_id: response.razorpay_payment_id,
                    payment_method: 'razorpay'
                }
            );

            if (confirmation.success) {
                // Show success message
                alert('✅ Payment successful! Admin has been notified.');

                // Redirect to booking confirmation page
                window.location.href = `/booking-confirmation?id=${bookingData.id}`;
            } else {
                alert('Payment received but notification failed. Please contact support.');
            }
        },

        // Prefill customer details
        prefill: {
            name: bookingData.customer_name,
            contact: bookingData.customer_phone,
            email: bookingData.customer_email
        },

        theme: {
            color: '#FF6B35' // Your brand color
        }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
};

// ===========================
// Example: React Component
// ===========================

export const BookingPaymentComponent = ({ bookingData }) => {
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // For Razorpay
            handleRazorpayPayment(bookingData);

            // For Cash on Delivery
            // handleCODPayment(bookingData);

        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus({ success: false, message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-section">
            <h2>Complete Payment</h2>

            <div className="booking-summary">
                <h3>Booking Details</h3>
                <p>Service: {bookingData.service_name}</p>
                <p>Date: {bookingData.booking_date}</p>
                <p>Time: {bookingData.booking_time}</p>
                <p className="address">
                    <strong>Service Address:</strong><br />
                    {bookingData.address_line1}<br />
                    {bookingData.address_line2 && <>{bookingData.address_line2}<br /></>}
                    {bookingData.city}, {bookingData.state} - {bookingData.pincode}
                    {bookingData.landmark && <><br />Landmark: {bookingData.landmark}</>}
                </p>
                <p className="amount">Amount: ₹{bookingData.total_amount}</p>
            </div>

            <button
                onClick={handlePayment}
                disabled={loading}
                className="pay-button"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>

            {paymentStatus && (
                <div className={`status ${paymentStatus.success ? 'success' : 'error'}`}>
                    {paymentStatus.message}
                </div>
            )}
        </div>
    );
};

// ===========================
// Example: Cash on Delivery (COD)
// ===========================

export const handleCODPayment = async (bookingData) => {
    try {
        // For COD, we still need to confirm the booking
        const confirmation = await confirmPaymentAndNotify(
            bookingData.id,
            {
                payment_id: `COD_${Date.now()}`,
                payment_method: 'cod'
            }
        );

        if (confirmation.success) {
            alert('✅ Booking confirmed! You will pay on delivery. Admin has been notified.');
            window.location.href = `/booking-confirmation?id=${bookingData.id}`;
        } else {
            alert('Booking confirmation failed. Please try again.');
        }
    } catch (error) {
        console.error('COD confirmation error:', error);
        alert('Something went wrong. Please try again.');
    }
};

// ===========================
// Example: Complete Flow
// ===========================

/**
 * Complete booking and payment flow:
 * 
 * 1. User fills booking form with address details
 * 2. User clicks "Next" - booking is created with status "pending"
 * 3. User completes payment
 * 4. Backend confirms payment and sends:
 *    - WhatsApp message to 9030545655
 *    - Admin panel notification
 * 5. User redirected to confirmation page
 */

export const completeBookingFlow = async (formData) => {
    try {
        // Step 1: Create booking
        const bookingResponse = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!bookingResponse.ok) {
            throw new Error('Booking creation failed');
        }

        const bookingResult = await bookingResponse.json();
        const booking = bookingResult.data;

        console.log('✅ Booking created:', booking.booking_number);

        // Step 2: Process payment
        handleRazorpayPayment(booking);
        // Payment success handler will automatically call confirmPaymentAndNotify()
        // Which triggers WhatsApp + Admin Panel notifications

    } catch (error) {
        console.error('Booking flow error:', error);
        throw error;
    }
};

// ===========================
// API Endpoint Reference
// ===========================

/**
 * Payment Confirmation Endpoint:
 * 
 * PUT /api/v1/bookings/:id/confirm-payment
 * 
 * Request Body:
 * {
 *   "payment_id": "pay_xxx",      // Payment gateway ID or COD_timestamp
 *   "payment_method": "razorpay"  // razorpay, cod, upi, etc.
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Payment confirmed and notifications sent",
 *   "data": { ... booking details ... }
 * }
 * 
 * What happens on backend:
 * 1. Updates booking status to "confirmed"
 * 2. Updates payment_status to "paid"
 * 3. Sends WhatsApp message to 9030545655 with:
 *    - Booking ID
 *    - Customer name & phone
 *    - Service details
 *    - Complete address (all fields)
 *    - Payment amount
 * 4. Sends real-time notification to admin panel via Socket.io
 */

// ===========================
// Testing
// ===========================

/**
 * Test the integration:
 * 
 * 1. Create a test booking
 * 2. Use this test function:
 */

export const testPaymentConfirmation = async () => {
    const testBookingId = 'your-booking-id-here';

    const result = await confirmPaymentAndNotify(testBookingId, {
        payment_id: 'test_payment_123',
        payment_method: 'test'
    });

    console.log('Test result:', result);

    if (result.success) {
        console.log('✅ WhatsApp message sent to 9030545655');
        console.log('✅ Admin panel notified');
    }
};

// ===========================
// Export all functions
// ===========================

export default {
    confirmPaymentAndNotify,
    handleRazorpayPayment,
    handleCODPayment,
    completeBookingFlow,
    testPaymentConfirmation
};
