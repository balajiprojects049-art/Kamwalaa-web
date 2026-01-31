const pool = require('../config/db');
const axios = require('axios');
const bcrypt = require('bcryptjs');

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

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, phone, password, email, city } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, phone and password'
            });
        }

        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this phone number'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUserResult = await pool.query(
            `INSERT INTO users (name, phone, password, email, city, role, is_verified) 
             VALUES ($1, $2, $3, $4, $5, 'customer', true) RETURNING *`,
            [name, phone, hashedPassword, email || null, city || null]
        );

        const user = newUserResult.rows[0];

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                city: user.city,
                role: user.role,
                hasPin: false
            }
        });
    } catch (err) {
        console.error('Error in registration:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    User login with phone and password
// @route   POST /api/v1/auth/login
// @access  Public
exports.phoneLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone and password'
            });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // For demo purposes, we'll allow a default password if none is set
        // In a real app, we'd force password setup
        if (!user.password) {
            // If no password set, we'll allow login once to set it up, or just error out
            return res.status(401).json({
                success: false,
                message: 'No password set for this account. Please use OTP to login first.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && password !== 'admin123') { // Temporary master password for testing
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
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
                role: user.role,
                hasPin: !!user.login_pin
            }
        });
    } catch (err) {
        console.error('Error in phone login:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Set 4-digit login PIN
// @route   POST /api/v1/auth/set-pin
// @access  Public (Should be private in real app)
exports.setPin = async (req, res) => {
    try {
        const { phone, pin } = req.body;

        if (!phone || !pin || pin.length !== 4) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone and a 4-digit PIN'
            });
        }

        await pool.query(
            'UPDATE users SET login_pin = $1 WHERE phone = $2',
            [pin, phone]
        );

        res.status(200).json({
            success: true,
            message: 'Passkey PIN set successfully'
        });
    } catch (err) {
        console.error('Error setting PIN:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Login with 4-digit PIN
// @route   POST /api/v1/auth/pin-login
// @access  Public
exports.pinLogin = async (req, res) => {
    try {
        const { phone, pin } = req.body;

        if (!phone || !pin) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone and PIN'
            });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        const user = userResult.rows[0];

        if (!user || user.login_pin !== pin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Passkey PIN'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Quick Login successful',
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
        console.error('Error in PIN login:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
