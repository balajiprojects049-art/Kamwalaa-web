const pool = require('../src/config/db');

async function addFields() {
    try {
        console.log('Adding password and login_pin columns to users table...');

        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS password VARCHAR(255),
            ADD COLUMN IF NOT EXISTS login_pin VARCHAR(4);
        `);

        console.log('✅ Columns added successfully!');

        // Update sample users with a default password for testing
        await pool.query(`
            UPDATE users SET password = '$2b$10$YourHashedPasswordPlaceholder' WHERE password IS NULL;
        `);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error adding columns:', err);
        process.exit(1);
    }
}

addFields();
