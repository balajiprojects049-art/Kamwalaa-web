require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');
const http = require('http');
const { Server } = require('socket.io');
const { initializeWhatsApp } = require('./src/utils/whatsappService');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://kamwalaa-web.vercel.app"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Make io accessible globally via app
app.set('io', io);

io.on('connection', (socket) => {
    console.log('🔌 New Client Connected:', socket.id);

    // Admin joins a specific room
    socket.on('join_admin_room', () => {
        socket.join('admin_notifications');
        console.log('🔔 Admin joined notification channel');
    });

    socket.on('disconnect', () => {
        console.log('❌ Client Disconnected:', socket.id);
    });
});

// Test Database Connection
pool.connect()
    .then(() => {
        console.log('✅ Database connected successfully');

        // Initialize WhatsApp
        console.log('📱 Starting WhatsApp service...');
        initializeWhatsApp();

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 API URL: http://localhost:${PORT}/api`);
            console.log(`⚡ Socket.io ready for real-time updates`);
            console.log(`📱 WhatsApp service initializing...`);
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
    console.log(err.name, err.message);
    // process.exit(1); // Don't crash on unhandled rejection (e.g. WhatsApp failure)
});
