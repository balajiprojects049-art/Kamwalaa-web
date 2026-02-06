const pool = require('./src/config/db');

const updateSchema = async () => {
    try {
        console.log('🔄 Updating Partners Table Schema...');

        await pool.query(`
            ALTER TABLE partners 
            ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20),
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
            ADD COLUMN IF NOT EXISTS aadhar_file_url TEXT,
            ADD COLUMN IF NOT EXISTS pan_file_url TEXT;
        `);

        console.log('✅ Partners table updated successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error updating schema:', err);
        process.exit(1);
    }
};

updateSchema();
