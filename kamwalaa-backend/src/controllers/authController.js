const pool = require('../config/db');
const axios = require('axios');

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

        // Send OTP via Twilio SMS (if configured)
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
            try {
                const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

                await client.messages.create({
                    body: `Your Kamwalaa verification code is: ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phone}` // Indian number format
                });
                console.log(`✅ SMS sent to +91${phone} via Twilio`);
            } catch (twilioError) {
                console.error('Twilio SMS Error:', twilioError.message);
            }
        } else {
            // Development mode - just log the OTP
            console.log(`🔐 OTP for ${phone}: ${otp} (Twilio not configured)`);
        }

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            // Remove this in production, only for development
            otp: process.env.NODE_ENV === 'development' && !process.env.MSG91_AUTH_KEY ? otp : undefined
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

        // Master OTP for development/testing
        if (otp !== '123456') {
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
        }

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
            // Fetch real admin user from DB to get valid UUID
            let userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            let adminUser = userResult.rows[0];

            if (!adminUser) {
                // Auto-create admin if missing (Development convenience)
                const newAdmin = await pool.query(
                    `INSERT INTO users (name, email, phone, role, is_verified, city) 
                     VALUES ('Admin User', $1, '9000000000', 'admin', true, 'Hyderabad') 
                     RETURNING *`,
                    [email]
                );
                adminUser = newAdmin.rows[0];
            }

            // Ensure role is admin
            if (adminUser.role !== 'admin') {
                await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [adminUser.id]);
                adminUser.role = 'admin';
            }

            return res.status(200).json({
                success: true,
                message: 'Admin login successful',
                user: {
                    id: adminUser.id, // Real UUID
                    name: adminUser.name,
                    email: adminUser.email,
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
