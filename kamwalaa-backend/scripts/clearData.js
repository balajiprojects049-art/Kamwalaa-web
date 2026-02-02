const pool = require('../src/config/db');

const clearData = async () => {
    try {
        console.log('🗑️  Clearing all user data...');

        // Truncate users table with CASCADE to clear dependent data (bookings, reviews, addresses, etc.)
        await pool.query('TRUNCATE TABLE users CASCADE');

        console.log('✅ All user data deleted successfully.');
    } catch (err) {
        console.error('❌ Error clearing data:', err.message);
    } finally {
        await pool.end();
        process.exit();
    }
};

clearData();
