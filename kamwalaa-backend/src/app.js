const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const helmet = require('helmet');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(helmet());
app.use(limiter);

// Middleware
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'https://kamwalaa-web.vercel.app',
        'https://kamwalaa-web-*.vercel.app' // Allow preview deployments
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

const path = require('path');

// ... (previous code)

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic Route
// ...
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
app.use('/api/v1/partners', require('./routes/partnerRoutes'));
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
