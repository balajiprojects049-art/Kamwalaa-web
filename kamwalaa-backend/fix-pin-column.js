require('dotenv').config();
const pool = require('./src/config/db');

async function fixLoginPinColumn() {
    try {
        console.log('🔧 Fixing login_pin column size...');

        // Alter the column to allow 255 characters (more than enough for bcrypt hash)
        await pool.query(`
            ALTER TABLE users 
            ALTER COLUMN login_pin TYPE VARCHAR(255)
        `);

        console.log('✅ Column login_pin updated to VARCHAR(255)');
        console.log('✅ Ready to store bcrypt hashes!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixLoginPinColumn();
