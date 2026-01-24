require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Test Database Connection
pool.connect()
    .then(() => {
        console.log('✅ Database connected successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API URL: http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
        console.log('⚠️  Server started without database (for development setup)');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} (Offline Mode)`);
        });
    });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
