const pool = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function resetAllUserData() {
    try {
        console.log('🚮 Resetting all user-related data...');

        // 1. Truncate user-related tables with CASCADE
        // This will clear users, bookings, reviews, cart, notifications, partners, etc.
        await pool.query('TRUNCATE TABLE users CASCADE');
        await pool.query('TRUNCATE TABLE otps CASCADE');

        console.log('✅ All transaction data cleared.');

        // 2. Re-create default admin and test users with the new password system
        const hashedPassword = await bcrypt.hash('admin123', 10);

        console.log('👤 Re-seeding default users...');

        // Admin
        await pool.query(
            `INSERT INTO users (name, email, phone, city, role, is_verified, password) 
             VALUES ('Admin User', 'admin@kamwalaa.com', '9876543216', 'Mumbai', 'admin', true, $1)`,
            [hashedPassword]
        );

        // Test Customer
        await pool.query(
            `INSERT INTO users (name, email, phone, city, role, is_verified, password) 
             VALUES ('Rahul Customer', 'rahul@kamwalaa.com', '9876543210', 'Ranchi', 'customer', true, $1)`,
            [hashedPassword]
        );

        // User Balaji (as requested in previous context)
        await pool.query(
            `INSERT INTO users (name, phone, role, is_verified, password) 
             VALUES ('Balaji', '9030545655', 'customer', true, $1)`,
            [hashedPassword]
        );

        console.log('✅ Database reset and default users created successfully!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error resetting database:', err);
        process.exit(1);
    }
}

resetAllUserData();
