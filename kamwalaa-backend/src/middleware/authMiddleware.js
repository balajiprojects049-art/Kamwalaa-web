const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            const result = await pool.query(
                'SELECT id, name, phone, email FROM users WHERE id = $1',
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            req.user = result.rows[0];
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

/**
 * Admin only middleware
 */
const adminOnly = async (req, res, next) => {
    try {
        // Check if user has admin role
        const result = await pool.query(
            'SELECT role FROM users WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0 || result.rows[0].role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { protect, adminOnly };
