const pool = require('../config/db');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPToWhatsApp } = require('../utils/whatsappService');

const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) return "Password must be at least 8 characters long";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecialChar) return "Password must contain at least one special character";

    return null;
};

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

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

        // Development mode - log OTP to console
        // Send WhatsApp OTP
        sendOTPToWhatsApp(phone, otp).catch(err => console.log('WhatsApp send failed but continuing'));

        console.log(`🔐 OTP for ${phone}: ${otp}`);

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
                role: user.role,
                token: generateToken(user.id, user.role)
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

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Fetch admin user from database
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1 AND role = 'admin'",
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const adminUser = userResult.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Admin login successful',
            user: {
                id: adminUser.id,
                name: adminUser.name,
                email: adminUser.email,
                role: 'admin',
                token: generateToken(adminUser.id, 'admin')
            }
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

        // Validate password strength
        const passwordError = validatePassword(password);
        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError
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
                role: user.role,
                hasPin: false,
                token: generateToken(user.id, user.role)
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
                role: user.role,
                hasPin: !!user.login_pin,
                token: generateToken(user.id, user.role)
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

        // Check if user exists
        const userCheck = await pool.query('SELECT id, phone FROM users WHERE phone = $1', [phone]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this phone number'
            });
        }

        const hashedPin = await bcrypt.hash(pin, 10);

        const result = await pool.query(
            'UPDATE users SET login_pin = $1 WHERE phone = $2 RETURNING id',
            [hashedPin, phone]
        );

        console.log(`✅ PIN set successfully for user: ${phone}`);

        res.status(200).json({
            success: true,
            message: 'Passkey PIN set successfully'
        });
    } catch (err) {
        console.error('❌ Error setting PIN:', err);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: err.message
        });
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

        if (!user || user.login_pin === null) {
            return res.status(401).json({
                success: false,
                message: 'Passkey not set'
            });
        }

        const isMatch = await bcrypt.compare(pin, user.login_pin);
        if (!isMatch) {
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
                role: user.role,
                token: generateToken(user.id, user.role)
            }
        });
    } catch (err) {
        console.error('Error in PIN login:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
// @desc    Reset Password using Passkey PIN
// @route   POST /api/v1/auth/reset-password-pin
// @access  Public
exports.resetPasswordWithPin = async (req, res) => {
    try {
        const { phone, pin, newPassword } = req.body;

        if (!phone || !pin || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone, pin and new password'
            });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        const user = userResult.rows[0];

        if (!user || user.login_pin === null) {
            return res.status(401).json({
                success: false,
                message: 'Passkey not set'
            });
        }

        const isMatch = await bcrypt.compare(pin, user.login_pin);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Passkey PIN'
            });
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            return res.status(400).json({
                success: false,
                message: passwordError
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            'UPDATE users SET password = $1 WHERE phone = $2',
            [hashedPassword, phone]
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reset Passkey PIN using Password
// @route   POST /api/v1/auth/reset-pin-password
// @access  Public
exports.resetPinWithPassword = async (req, res) => {
    try {
        const { phone, password, newPin } = req.body;

        if (!phone || !password || !newPin || newPin.length !== 4) {
            return res.status(400).json({
                success: false,
                message: 'Please provide phone, password and a new 4-digit PIN'
            });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        const hashedNewPin = await bcrypt.hash(newPin, 10);

        await pool.query(
            'UPDATE users SET login_pin = $1 WHERE phone = $2',
            [hashedNewPin, phone]
        );

        res.status(200).json({
            success: true,
            message: 'Passkey PIN reset successful'
        });
    } catch (err) {
        console.error('Error resetting PIN:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @route   POST /api/v1/auth/admin/login
// @desc    Admin login with email and password
// @access  Public
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Admin login attempt:', email);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Hardcoded admin credentials for now
        const ADMIN_EMAIL = 'admin@kamwalaa.com';
        const ADMIN_PASSWORD = 'Admin@123456';

        if (email !== ADMIN_EMAIL) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: ADMIN_EMAIL, role: 'admin' },
            process.env.JWT_SECRET || 'kamwalaa_secret_key_2024',
            { expiresIn: '7d' }
        );

        console.log('✅ Admin logged in successfully');

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            user: {
                email: ADMIN_EMAIL,
                name: 'Kamwalaa Admin',
                role: 'admin',
                token
            }
        });
    } catch (err) {
        console.error('❌ Admin login error:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

