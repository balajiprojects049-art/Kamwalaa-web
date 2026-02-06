const pool = require('../config/db');
const {
    sendBookingToWhatsApp,
    sendBookingConfirmationToCustomer,
    sendPartnerAssignmentToCustomer,
    sendServiceCompletionToCustomer
} = require('../utils/whatsappService');

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Public (allows guest bookings)
exports.createBooking = async (req, res) => {
    try {
        const {
            user_id,
            guest_name,
            guest_phone,
            guest_email,
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

        let actualUserId = user_id;

        // If no user_id provided, create a guest user account
        if (!user_id && guest_phone) {
            console.log('Creating guest user account...');

            // Check if user already exists with this phone
            const existingUser = await pool.query(
                'SELECT id FROM users WHERE phone = $1',
                [guest_phone]
            );

            if (existingUser.rows.length > 0) {
                // User exists, use their ID
                actualUserId = existingUser.rows[0].id;
                console.log('Found existing user:', actualUserId);
            } else {
                // Create new user
                const newUserResult = await pool.query(
                    `INSERT INTO users (name, phone, email, city, role, is_verified)
                     VALUES ($1, $2, $3, $4, 'customer', true)
                     RETURNING id`,
                    [guest_name || 'Guest User', guest_phone, guest_email || null, city]
                );
                actualUserId = newUserResult.rows[0].id;
                console.log('Created new guest user:', actualUserId);
            }
        }

        // Validate required fields
        if (!actualUserId || !service_id || !booking_date || !booking_time ||
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

        console.log('Inserting booking with data:', {
            user_id: actualUserId, service_id, booking_date, booking_time,
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
                actualUserId, service_id, booking_date, booking_time,
                address_line1, address_line2, city, state, pincode, landmark,
                special_instructions, payment_method,
                service.price, totalAmount
            ]
        );

        const savedBooking = result.rows[0];

        // Get full booking details with customer and service info for WhatsApp
        const fullBookingResult = await pool.query(
            `SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                s.name as service_name
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN services s ON b.service_id = s.id
            WHERE b.id = $1`,
            [savedBooking.id]
        );

        const fullBooking = fullBookingResult.rows[0];

        // Notify Admin via Real-Time Socket
        const io = req.app.get('io');
        if (io) {
            io.to('admin_notifications').emit('new_booking', {
                title: 'New Service Request',
                message: `New Booking #${savedBooking.booking_number} for ${service.name}`,
                bookingId: savedBooking.id, // UUID for link
                displayId: savedBooking.booking_number,
                serviceName: service.name,
                amount: totalAmount
            });
            console.log(`🔔 Notification sent for ${savedBooking.booking_number}`);
        }

        // ** SCENARIO 1: Send WhatsApp to Admin **
        sendBookingToWhatsApp(fullBooking)
            .then((whatsappResult) => {
                if (whatsappResult.success) {
                    console.log(`📱 WhatsApp sent to admin for booking ${fullBooking.booking_number}`);
                } else {
                    console.log(`⚠️ WhatsApp to admin failed: ${whatsappResult.message}`);
                }
            })
            .catch((err) => {
                console.error('❌ WhatsApp error:', err);
            });

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: savedBooking
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

        const booking = result.rows[0];

        // Get full booking details for WhatsApp notifications
        const fullBookingResult = await pool.query(
            `SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                s.name as service_name,
                p.business_name as partner_name,
                p.id as partner_id,
                pu.phone as partner_phone,
                p.rating as partner_rating
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN services s ON b.service_id = s.id
            LEFT JOIN partners p ON b.partner_id = p.id
            LEFT JOIN users pu ON p.user_id = pu.id
            WHERE b.id = $1`,
            [id]
        );

        const fullBooking = fullBookingResult.rows[0];

        // ** SCENARIO 2: When admin confirms booking **
        if (status === 'confirmed') {
            console.log('🔔 Status changed to CONFIRMED. Sending WhatsApp to customer...');
            console.log('📱 Customer phone:', fullBooking.customer_phone);
            console.log('📋 Booking data:', {
                booking_number: fullBooking.booking_number,
                customer_name: fullBooking.customer_name,
                service_name: fullBooking.service_name
            });

            sendBookingConfirmationToCustomer(fullBooking.customer_phone, fullBooking)
                .then(result => {
                    if (result.success) {
                        console.log(`✅ Confirmation WhatsApp sent to customer for ${fullBooking.booking_number}`);
                    } else {
                        console.log(`⚠️ WhatsApp failed for ${fullBooking.booking_number}:`, result.message);
                    }
                })
                .catch(err => console.error('❌ WhatsApp confirmation error:', err));
        }

        // ** SCENARIO 3: When partner is assigned **
        if (status === 'assigned' && fullBooking.partner_id) {
            const partnerData = {
                partner_name: fullBooking.partner_name,
                partner_phone: fullBooking.partner_phone,
                rating: fullBooking.partner_rating
            };

            sendPartnerAssignmentToCustomer(fullBooking.customer_phone, fullBooking, partnerData)
                .then(result => {
                    if (result.success) {
                        console.log(`📱 Partner assignment WhatsApp sent to customer for ${fullBooking.booking_number}`);
                    }
                })
                .catch(err => console.error('❌ WhatsApp partner assignment error:', err));
        }

        // ** SCENARIO 4: When service is completed **
        if (status === 'completed') {
            sendServiceCompletionToCustomer(fullBooking.customer_phone, fullBooking)
                .then(result => {
                    if (result.success) {
                        console.log(`📱 Completion WhatsApp sent to customer for ${fullBooking.booking_number}`);
                    }
                })
                .catch(err => console.error('❌ WhatsApp completion error:', err));
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

// @desc    Confirm payment and send notifications
// @route   PUT /api/v1/bookings/:id/confirm-payment
// @access  Private
exports.confirmPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { payment_id, payment_method } = req.body;

        // Update payment status
        const result = await pool.query(
            `UPDATE bookings 
             SET payment_status = 'paid', 
                 payment_id = $1,
                 status = 'confirmed',
                 updated_at = NOW() 
             WHERE id = $2 
             RETURNING *`,
            [payment_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        const booking = result.rows[0];

        // Get full booking details with user and service info
        const fullBookingResult = await pool.query(
            `SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                s.name as service_name
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN services s ON b.service_id = s.id
            WHERE b.id = $1`,
            [id]
        );

        const fullBooking = fullBookingResult.rows[0];

        console.log('💳 Payment confirmed for booking:', fullBooking.booking_number);

        // Send to Admin Panel via Socket.io
        const io = req.app.get('io');
        if (io) {
            io.to('admin_notifications').emit('payment_confirmed', {
                title: '✅ Payment Confirmed',
                message: `Payment received for Booking #${fullBooking.booking_number}`,
                bookingId: fullBooking.id,
                displayId: fullBooking.booking_number,
                serviceName: fullBooking.service_name,
                amount: fullBooking.total_amount,
                customer: fullBooking.customer_name,
                phone: fullBooking.customer_phone,
                address: {
                    line1: fullBooking.address_line1,
                    line2: fullBooking.address_line2,
                    city: fullBooking.city,
                    state: fullBooking.state,
                    pincode: fullBooking.pincode,
                    landmark: fullBooking.landmark
                }
            });
            console.log(`🔔 Admin panel notification sent for ${fullBooking.booking_number}`);
        }

        // Send to WhatsApp
        sendBookingToWhatsApp(fullBooking)
            .then((whatsappResult) => {
                if (whatsappResult.success) {
                    console.log(`📱 WhatsApp message sent for booking ${fullBooking.booking_number}`);
                } else {
                    console.log(`⚠️ WhatsApp message failed: ${whatsappResult.message}`);
                }
            })
            .catch((err) => {
                console.error('❌ WhatsApp error:', err);
            });

        res.status(200).json({
            success: true,
            message: 'Payment confirmed and notifications sent',
            data: booking
        });

    } catch (err) {
        console.error('Error confirming payment:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm payment',
            error: err.toString()
        });
    }
};


// @desc    Assign partner to booking
// @route   PUT /api/v1/bookings/:id/assign
// @access  Private (Admin)
exports.assignPartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { partner_id } = req.body;

        if (!partner_id) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a partner_id'
            });
        }

        // Check if booking exists
        const bookingCheck = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        if (bookingCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update booking with partner_id and status='assigned'
        const result = await pool.query(
            `UPDATE bookings 
             SET partner_id = $1, 
                 status = 'assigned', 
                 updated_at = NOW() 
             WHERE id = $2 
             RETURNING *`,
            [partner_id, id]
        );

        const booking = result.rows[0];

        // Fetch full details for WhatsApp
        const fullBookingResult = await pool.query(
            `SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                s.name as service_name,
                p.business_name as partner_name,
                p.id as partner_id,
                pu.phone as partner_phone,
                p.rating as partner_rating
            FROM bookings b
            LEFT JOIN users u ON b.user_id = u.id
            LEFT JOIN services s ON b.service_id = s.id
            LEFT JOIN partners p ON b.partner_id = p.id
            LEFT JOIN users pu ON p.user_id = pu.id
            WHERE b.id = $1`,
            [id]
        );

        const fullBooking = fullBookingResult.rows[0];

        // ** SCENARIO 3: Send WhatsApp Notification **
        const partnerData = {
            partner_name: fullBooking.partner_name,
            partner_phone: fullBooking.partner_phone,
            rating: fullBooking.partner_rating
        };

        sendPartnerAssignmentToCustomer(fullBooking.customer_phone, fullBooking, partnerData)
            .then(result => {
                if (result.success) {
                    console.log(`📱 Partner assignment WhatsApp sent for ${fullBooking.booking_number}`);
                }
            })
            .catch(err => console.error('❌ WhatsApp partner assignment error:', err));

        res.status(200).json({
            success: true,
            message: 'Partner assigned successfully',
            data: booking
        });

    } catch (err) {
        console.error('Error assigning partner:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.toString()
        });
    }
};

// @desc    Get bookings assigned to a partner
// @route   GET /api/v1/bookings/partner/:partnerId
// @access  Private
exports.getPartnerBookings = async (req, res) => {
    try {
        const { partnerId } = req.params;

        const result = await pool.query(
            `SELECT 
                b.*,
                u.name as customer_name,
                u.phone as customer_phone,
                u.city as customer_city,
                s.name as service_name,
                s.image_url as service_image
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN services s ON b.service_id = s.id
            WHERE b.partner_id = $1
            ORDER BY 
                CASE WHEN b.status = 'assigned' THEN 1
                     WHEN b.status = 'in_progress' THEN 2
                     ELSE 3 
                END,
                b.booking_date ASC, 
                b.booking_time ASC`,
            [partnerId]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching partner bookings:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
