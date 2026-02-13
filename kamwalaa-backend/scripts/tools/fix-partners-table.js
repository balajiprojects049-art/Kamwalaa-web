require('dotenv').config();
const pool = require('../../src/config/db');

async function fixPartnersTable() {
    try {
        console.log('🔄 Checking and fixing partners table...');

        // Add missing columns if they don't exist
        await pool.query(`
            ALTER TABLE partners 
            ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS aadhar_file_url VARCHAR(500),
            ADD COLUMN IF NOT EXISTS pan_file_url VARCHAR(500),
            ADD COLUMN IF NOT EXISTS service_category VARCHAR(255),
            ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
        `);

        console.log('✅ Partners table updated successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing partners table:', error.message);
        process.exit(1);
    }
}

fixPartnersTable();
