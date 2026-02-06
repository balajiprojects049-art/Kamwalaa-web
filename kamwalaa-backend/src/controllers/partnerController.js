const pool = require('../config/db');
const { sendPartnerApprovalNotification } = require('../utils/whatsappService');

// @desc    Register a new partner
// @route   POST /api/v1/partners/register
// @access  Public
exports.registerPartner = async (req, res) => {
    try {
        const { name, phone, email, city, business_name, aadhar_number, pan_number, address, service_category, whatsapp_number } = req.body;

        // Handle Files
        const aadharFileUrl = req.files && req.files['aadhar_file'] ? `/uploads/${req.files['aadhar_file'][0].filename}` : null;
        const panFileUrl = req.files && req.files['pan_file'] ? `/uploads/${req.files['pan_file'][0].filename}` : null;

        // 1. Check if user exists
        let userId;
        const userCheck = await pool.query('SELECT id, role FROM users WHERE phone = $1', [phone]);

        if (userCheck.rows.length > 0) {
            userId = userCheck.rows[0].id;
            // Optional: Check if already a partner
            const partnerCheck = await pool.query('SELECT id FROM partners WHERE user_id = $1', [userId]);
            if (partnerCheck.rows.length > 0) {
                return res.status(400).json({ success: false, message: 'Partner already registered with this phone number.' });
            }
        } else {
            // Create User (Pending verification)
            const newUser = await pool.query(
                `INSERT INTO users (name, phone, email, city, role, is_verified)
                 VALUES ($1, $2, $3, $4, 'partner', false)
                 RETURNING id`,
                [name, phone, email, city]
            );
            userId = newUser.rows[0].id;
        }

        // 2. Create Partner Request
        const newPartner = await pool.query(
            `INSERT INTO partners (
                user_id, business_name, 
                aadhar_number, pan_number, address, 
                aadhar_file_url, pan_file_url, 
                service_category, whatsapp_number,
                status, is_verified, rating
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', false, 0)
             RETURNING *`,
            [userId, business_name || name, aadhar_number, pan_number, address, aadharFileUrl, panFileUrl, service_category, whatsapp_number]
        );

        res.status(201).json({
            success: true,
            message: 'Partner registration submitted successfully. Please wait for admin approval.',
            data: newPartner.rows[0]
        });

    } catch (err) {
        console.error('Error registering partner:', err);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: err.toString()
        });
    }
};

// @desc    Get pending partner requests
// @route   GET /api/v1/partners/requests
// @access  Private (Admin)
exports.getPartnerRequests = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.*,
                u.name as contact_name,
                u.phone as contact_phone,
                u.email as contact_email,
                u.city as user_city
            FROM partners p
            JOIN users u ON p.user_id = u.id
            WHERE p.status = 'pending'
            ORDER BY p.created_at ASC
        `);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching partner requests:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify/Approve a partner
// @route   PUT /api/v1/partners/:id/verify
// @access  Private (Admin)
exports.verifyPartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        // 1. Update Partner Status
        const updatePartner = await pool.query(
            `UPDATE partners 
             SET status = 'approved', is_verified = true 
             WHERE id = $1 
             RETURNING user_id, business_name`,
            [partnerId]
        );

        if (updatePartner.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        const { user_id, business_name } = updatePartner.rows[0];

        // 2. Update User Verification
        await pool.query('UPDATE users SET is_verified = true WHERE id = $1', [user_id]);

        // 3. Get User Details for WhatsApp
        const userResult = await pool.query('SELECT name, phone FROM users WHERE id = $1', [user_id]);
        const user = userResult.rows[0];

        // 4. Send WhatsApp Notification
        await sendPartnerApprovalNotification(user.phone, user.name);

        res.status(200).json({
            success: true,
            message: 'Partner approved and notified via WhatsApp'
        });

    } catch (err) {
        console.error('Error verifying partner:', err);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
};

// @desc    Reject a partner
// @route   PUT /api/v1/partners/:id/reject
// @access  Private (Admin)
exports.rejectPartner = async (req, res) => {
    try {
        const partnerId = req.params.id;

        const updatePartner = await pool.query(
            `UPDATE partners SET status = 'rejected' WHERE id = $1 RETURNING id`,
            [partnerId]
        );

        if (updatePartner.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Partner request rejected'
        });

    } catch (err) {
        console.error('Error rejecting partner:', err);
        res.status(500).json({ success: false, message: 'Rejection failed' });
    }
};

// @desc    Get all partners (Approved)
// @route   GET /api/v1/partners
// @access  Public/Private
exports.getAllPartners = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.*,
                u.name as contact_name,
                u.phone as contact_phone,
                u.email as contact_email,
                u.city as user_city
            FROM partners p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.status DESC, p.created_at DESC
        `);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching partners:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.toString()
        });
    }
};

// @desc    Get current logged in partner profile
// @route   GET /api/v1/partners/me
// @access  Private
exports.getCurrentPartner = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.*,
                u.name as contact_name,
                u.phone as contact_phone,
                u.email as contact_email
            FROM partners p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1
        `, [req.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Partner profile not found' });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching current partner:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
