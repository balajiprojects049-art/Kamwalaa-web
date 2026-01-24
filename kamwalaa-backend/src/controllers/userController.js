const pool = require('../config/db');

// @desc    Get user profile
// @route   GET /api/v1/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT id, name, email, phone, city, role, is_verified, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, city } = req.body;

        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, city = $3 WHERE id = $4 RETURNING *',
            [name, email, city, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get user addresses
// @route   GET /api/v1/users/:id/addresses
// @access  Private
exports.getUserAddresses = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [id]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        console.error('Error fetching addresses:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Add user address
// @route   POST /api/v1/users/:id/addresses
// @access  Private
exports.addUserAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            address_type,
            address_line1,
            address_line2,
            city,
            state,
            pincode,
            landmark,
            is_default
        } = req.body;

        // If this is set as default, unset other defaults
        if (is_default) {
            await pool.query(
                'UPDATE user_addresses SET is_default = false WHERE user_id = $1',
                [id]
            );
        }

        const result = await pool.query(
            `INSERT INTO user_addresses (
                user_id, address_type, address_line1, address_line2,
                city, state, pincode, landmark, is_default
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [id, address_type, address_line1, address_line2, city, state, pincode, landmark, is_default]
        );

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding address:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
