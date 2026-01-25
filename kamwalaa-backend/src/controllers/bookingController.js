const pool = require('../config/db');

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private (requires user)
exports.createBooking = async (req, res) => {
    try {
        const {
            user_id,
            service_id,
            booking_date,
            booking_time,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            landmark,
            special_instructions,
            payment_method
        } = req.body;

        // Validate required fields
        if (!user_id || !service_id || !booking_date || !booking_time ||
            !address_line1 || !city || !pincode) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Get service details for pricing
        const serviceResult = await pool.query(
            'SELECT * FROM services WHERE id = $1',
            [service_id]
        );

        if (serviceResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        const service = serviceResult.rows[0];
        const totalAmount = service.price;

        // Ensure user exists before inserting (Fail fast)
        const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User account not found. Please re-login.'
            });
        }

        console.log('Inserting booking with data:', {
            user_id, service_id, booking_date, booking_time,
            price: service.price
        });

        // Create booking
        const result = await pool.query(
            `INSERT INTO bookings (
                user_id, service_id, booking_date, booking_time,
                address_line1, address_line2, city, state, pincode, landmark,
                special_instructions, payment_method,
                service_price, total_amount, status, payment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending', 'pending')
            RETURNING *`,
            [
                user_id, service_id, booking_date, booking_time,
                address_line1, address_line2, city, state, pincode, landmark,
                special_instructions, payment_method,
                service.price, totalAmount
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to create booking',
            error: err.toString()
        });
    }
};

// @desc    Get user bookings
// @route   GET /api/v1/bookings/user/:userId
// @access  Private
exports.getUserBookings = async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await pool.query(
            `SELECT 
                b.*,
                s.name as service_name,
                s.image_url as service_image,
                p.business_name as partner_name
            FROM bookings b
            JOIN services s ON b.service_id = s.id
            LEFT JOIN partners p ON b.partner_id = p.id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching user bookings:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/v1/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const { status } = req.query;

        let query = `
            SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                s.name as service_name,
                c.name as service_category,
                p.business_name as partner_name
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN services s ON b.service_id = s.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN partners p ON b.partner_id = p.id
        `;

        const queryParams = [];
        if (status) {
            query += ' WHERE b.status = $1';
            queryParams.push(status);
        }

        query += ' ORDER BY b.created_at DESC';

        const result = await pool.query(query, queryParams);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching bookings:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.toString(),
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const result = await pool.query(
            'UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating booking status:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
