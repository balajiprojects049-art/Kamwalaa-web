const pool = require('./src/config/db');

const addServiceCategory = async () => {
    try {
        console.log('🔄 Adding service_category to Partners Table...');

        await pool.query(`
            ALTER TABLE partners 
            ADD COLUMN IF NOT EXISTS service_category VARCHAR(100);
        `);

        console.log('✅ service_category column added successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error adding column:', err);
        process.exit(1);
    }
};

addServiceCategory();
