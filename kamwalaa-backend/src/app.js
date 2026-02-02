const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Kamwalaa API',
        status: 'active',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Register all API routes
app.use('/api/v1/cities', require('./routes/cityRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/services', require('./routes/serviceRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = app;
