const pool = require('../config/db');

// @desc    Send OTP to phone number
// @route   POST /api/v1/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone || phone.length !== 10) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid 10-digit phone number'
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP in database
        await pool.query(
            'INSERT INTO otps (phone, otp, expires_at) VALUES ($1, $2, $3)',
            [phone, otp, expiresAt]
        );

        // TODO: Send OTP via Twilio SMS
        console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // Remove this in production, only for development
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (err) {
        console.error('Error sending OTP:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to send OTP'
        });
    }
};

// @desc    Verify OTP and login/register user
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone and OTP'
            });
        }

        // Check OTP validity
        const otpResult = await pool.query(
            `SELECT * FROM otps 
             WHERE phone = $1 AND otp = $2 AND expires_at > NOW() AND is_used = false 
             ORDER BY created_at DESC LIMIT 1`,
            [phone, otp]
        );

        if (otpResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark OTP as used
        await pool.query(
            'UPDATE otps SET is_used = true WHERE id = $1',
            [otpResult.rows[0].id]
        );

        // Check if user exists
        let userResult = await pool.query(
            'SELECT * FROM users WHERE phone = $1',
            [phone]
        );

        let user;
        if (userResult.rows.length === 0) {
            // Create new user
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required for new users'
                });
            }

            const newUserResult = await pool.query(
                `INSERT INTO users (name, phone, is_verified) 
                 VALUES ($1, $2, true) RETURNING *`,
                [name, phone]
            );
            user = newUserResult.rows[0];
        } else {
            user = userResult.rows[0];
            // Update verification status
            await pool.query(
                'UPDATE users SET is_verified = true WHERE id = $1',
                [user.id]
            );
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                city: user.city,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Error verifying OTP:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to verify OTP'
        });
    }
};

// @desc    Admin login (email + password)
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hardcoded admin credentials for MVP
        if (email === 'admin@kamwalaa.com' && password === 'admin123') {
            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                user: {
                    id: 'admin-1',
                    name: 'Admin User',
                    email: 'admin@kamwalaa.com',
                    role: 'admin'
                }
            });
        }

        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    } catch (err) {
        console.error('Error in admin login:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
