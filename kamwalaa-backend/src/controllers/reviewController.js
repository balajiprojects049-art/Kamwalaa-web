const pool = require('../config/db');

// @desc    Submit a review for a booking
// @route   POST /api/v1/reviews
// @access  Private
exports.submitReview = async (req, res) => {
    try {
        const { booking_id, user_id, partner_id, service_id, rating, comment } = req.body;

        if (!booking_id || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID and rating are required'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        // Check if review already exists for this booking
        const existingReview = await pool.query(
            'SELECT * FROM reviews WHERE booking_id = $1',
            [booking_id]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Review already submitted for this booking'
            });
        }

        // Verify booking is completed
        const bookingResult = await pool.query(
            'SELECT * FROM bookings WHERE id = $1 AND status = $2',
            [booking_id, 'completed']
        );

        if (bookingResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Can only review completed bookings'
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews (
                booking_id, user_id, partner_id, service_id, rating, comment, is_verified
            ) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *`,
            [booking_id, user_id, partner_id, service_id, rating, comment]
        );

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error submitting review:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: err.toString()
        });
    }
};

// @desc    Get reviews for a service
// @route   GET /api/v1/reviews/service/:serviceId
// @access  Public
exports.getServiceReviews = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const result = await pool.query(
            `SELECT 
                r.*,
                u.name as customer_name,
                p.business_name as partner_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN partners p ON r.partner_id = p.id
            WHERE r.service_id = $1 AND r.is_verified = true
            ORDER BY r.created_at DESC`,
            [serviceId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching service reviews:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get reviews for a partner
// @route   GET /api/v1/reviews/partner/:partnerId
// @access  Public
exports.getPartnerReviews = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const result = await pool.query(
            `SELECT 
                r.*,
                u.name as customer_name,
                s.name as service_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN services s ON r.service_id = s.id
            WHERE r.partner_id = $1 AND r.is_verified = true
            ORDER BY r.created_at DESC`,
            [partnerId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching partner reviews:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
