const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();

/* ============================================================
   SECURITY HEADERS (Helmet)
   ============================================================ */
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com', 'https://js.stripe.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            connectSrc: ["'self'", 'https://api.razorpay.com', 'https://api.stripe.com'],
            frameSrc: ["'self'", 'https://checkout.razorpay.com', 'https://js.stripe.com'],
            upgradeInsecureRequests: [],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    crossOriginEmbedderPolicy: false,
}));

/* ============================================================
   RATE LIMITING
   ============================================================ */
// General API limiter
app.use('/api/', rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 min
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'error', message: 'Too many requests. Please try again later.' },
    skip: (req) => req.method === 'OPTIONS',
}));

// Strict limiter for auth endpoints
app.use('/api/v1/auth/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,    // 20 auth attempts per 15 min
    message: { status: 'error', message: 'Too many auth attempts. Please try again later.' },
}));

// OTP limiter
app.use('/api/v1/auth/login/otp', rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,     // 5 OTPs per 5 min
    message: { status: 'error', message: 'Too many OTP requests. Please wait 5 minutes.' },
}));

/* ============================================================
   CORS
   ============================================================ */
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'https://kamwalaa.com',
    'https://www.kamwalaa.com',
    'https://kamwalaa-web.vercel.app',
    'https://kamwalaa-web-*.vercel.app',
];

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // Allow server-to-server calls
        const allowed = allowedOrigins.some(o => {
            if (o.includes('*')) {
                const pattern = new RegExp('^' + o.replace('*', '.*') + '$');
                return pattern.test(origin);
            }
            return o === origin;
        });
        cb(allowed ? null : new Error('Not allowed by CORS'), allowed);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

/* ============================================================
   BODY PARSERS
   ============================================================ */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ============================================================
   STATIC FILES
   ============================================================ */
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    maxAge: '7d',
    etag: true,
}));

/* ============================================================
   REQUEST LOGGING (dev)
   ============================================================ */
if (process.env.NODE_ENV === 'development') {
    app.use((req, _res, next) => {
        console.log(`📥 ${req.method} ${req.path} — ${new Date().toISOString()}`);
        next();
    });
}

/* ============================================================
   HEALTH CHECK
   ============================================================ */
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'Kamwalaa API',
        version: '2.0.0',
        uptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV,
    });
});

app.get('/', (req, res) => {
    res.json({
        message: '🚀 Kamwalaa Enterprise API v2.0',
        status: 'active',
        docs: '/api/v1/health',
        timestamp: new Date().toISOString(),
    });
});

/* ============================================================
   API ROUTES — v1
   ============================================================ */
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/cities', require('./routes/cityRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/partners', require('./routes/partnerRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));

// NEW Enterprise Routes
app.use('/api/v1/wallet', require('./routes/walletRoutes'));

// Conditionally load routes that may not exist yet
const safeRoute = (routePath) => {
    try {
        return require(routePath);
    } catch {
        const router = require('express').Router();
        router.all('*', (_req, res) => res.status(501).json({
            status: 'error',
            message: 'Route under development',
        }));
        return router;
    }
};

app.use('/api/v1/payments', safeRoute('./routes/paymentRoutes'));
app.use('/api/v1/subscriptions', safeRoute('./routes/subscriptionRoutes'));
app.use('/api/v1/support', safeRoute('./routes/supportRoutes'));
app.use('/api/v1/admin', safeRoute('./routes/adminRoutes'));
app.use('/api/v1/ai', safeRoute('./routes/aiRoutes'));

/* ============================================================
   TOKEN REFRESH ENDPOINT
   ============================================================ */
app.post('/api/v1/auth/refresh', require('./middleware/auth').refreshTokens);

/* ============================================================
   404 HANDLER
   ============================================================ */
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found.`,
        code: 'NOT_FOUND',
    });
});

/* ============================================================
   GLOBAL ERROR HANDLER
   ============================================================ */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    const isDev = process.env.NODE_ENV === 'development';

    // CORS error
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({
            status: 'error',
            message: 'CORS policy violation.',
            code: 'CORS_ERROR',
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(422).json({
            status: 'error',
            message: 'Validation failed.',
            errors: err.details || err.message,
        });
    }

    console.error('💥 Unhandled error:', err.stack || err.message);

    return res.status(err.status || 500).json({
        status: 'error',
        message: isDev ? err.message : 'Internal server error. Please try again.',
        ...(isDev && { stack: err.stack }),
    });
});

module.exports = app;
