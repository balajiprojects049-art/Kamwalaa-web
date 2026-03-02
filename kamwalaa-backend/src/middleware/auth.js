/**
 * Enterprise JWT Authentication Middleware
 * Features: Access token + Refresh token + Role-based access + Device management
 */
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { verifyRefreshToken, storeRefreshToken, revokeRefreshToken } = require('../config/redis');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'kamwalaa-access-secret-2026';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'kamwalaa-refresh-secret-2026';
const ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

/* ============================================================
   TOKEN GENERATION UTILITIES
   ============================================================ */

/**
 * Generate access token (short-lived)
 */
const generateAccessToken = (payload) =>
    jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_EXPIRY });

/**
 * Generate refresh token (long-lived)
 */
const generateRefreshToken = (payload) =>
    jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_EXPIRY });

/**
 * Issue a full token pair and store refresh in Redis
 */
const issueTokenPair = async (user) => {
    const tokenPayload = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: user.name,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    // Store refresh token in Redis with 30-day TTL
    await storeRefreshToken(user.id, refreshToken, 30 * 24 * 60 * 60);

    return { accessToken, refreshToken, expiresIn: ACCESS_EXPIRY };
};

/* ============================================================
   MIDDLEWARE: Verify Access Token
   ============================================================ */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required. Please login.',
                code: 'NO_TOKEN',
            });
        }

        const token = authHeader.slice(7);

        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

            // Attach user to request
            req.user = {
                id: decoded.id,
                email: decoded.email,
                phone: decoded.phone,
                role: decoded.role,
                name: decoded.name,
            };

            return next();

        } catch (jwtErr) {
            if (jwtErr.name === 'TokenExpiredError') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Access token expired. Please refresh.',
                    code: 'TOKEN_EXPIRED',
                });
            }

            return res.status(401).json({
                status: 'error',
                message: 'Invalid token. Please login again.',
                code: 'INVALID_TOKEN',
            });
        }

    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Authentication service error.',
        });
    }
};

/* ============================================================
   MIDDLEWARE: Optional Authentication
   (Attaches user if token present, but doesn't block if missing)
   ============================================================ */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) return next();

        const token = authHeader.slice(7);
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = { id: decoded.id, email: decoded.email, phone: decoded.phone, role: decoded.role };
    } catch { /* ignore */ }

    return next();
};

/* ============================================================
   MIDDLEWARE: Role-Based Access Control (RBAC)
   Usage: requireRole('admin') or requireRole(['admin','partner'])
   ============================================================ */
const requireRole = (...roles) => {
    const allowedRoles = roles.flat();

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required.',
                code: 'NO_TOKEN',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                status: 'error',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}.`,
                code: 'INSUFFICIENT_PERMISSIONS',
                requiredRoles: allowedRoles,
                yourRole: req.user.role,
            });
        }

        return next();
    };
};

// Shorthand role middlewares
const requireAdmin = requireRole('admin');
const requirePartner = requireRole('partner', 'admin');
const requireCustomer = requireRole('customer', 'admin');

/* ============================================================
   REFRESH TOKEN HANDLER
   Called by the /api/v1/auth/refresh endpoint
   ============================================================ */
const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                status: 'error',
                message: 'Refresh token required.',
                code: 'NO_REFRESH_TOKEN',
            });
        }

        // Verify JWT signature
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({
                status: 'error',
                message: err.name === 'TokenExpiredError'
                    ? 'Session expired. Please login again.'
                    : 'Invalid refresh token.',
                code: err.name === 'TokenExpiredError' ? 'REFRESH_EXPIRED' : 'INVALID_REFRESH',
            });
        }

        // Check if token exists in Redis (not revoked)
        const isValid = await verifyRefreshToken(decoded.id, refreshToken);
        if (!isValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Session has been revoked. Please login again.',
                code: 'TOKEN_REVOKED',
            });
        }

        // Get fresh user data from DB
        const result = await pool.query(
            'SELECT id, name, email, phone, role, is_verified FROM users WHERE id = $1',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found.',
                code: 'USER_NOT_FOUND',
            });
        }

        const user = result.rows[0];

        // Rotate refresh token (revoke old, issue new)
        await revokeRefreshToken(decoded.id, refreshToken);
        const tokens = await issueTokenPair(user);

        return res.json({
            status: 'success',
            message: 'Tokens refreshed.',
            data: tokens,
        });

    } catch (err) {
        console.error('Refresh token error:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Token refresh failed.',
        });
    }
};

module.exports = {
    authenticate,
    optionalAuth,
    requireRole,
    requireAdmin,
    requirePartner,
    requireCustomer,
    generateAccessToken,
    generateRefreshToken,
    issueTokenPair,
    refreshTokens,
};
