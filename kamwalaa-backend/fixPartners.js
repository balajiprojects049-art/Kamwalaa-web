const pool = require('./src/config/db');

const fixPartners = async () => {
    try {
        console.log('🔄 Updating existing partners service_category...');

        const result = await pool.query(`
            UPDATE partners 
            SET service_category = 'General Service' 
            WHERE service_category IS NULL OR service_category = ''
        `);

        console.log(`✅ Updated ${result.rowCount} partners.`);
        process.exit();
    } catch (err) {
        console.error('❌ Error updating partners:', err);
        process.exit(1);
    }
};

fixPartners();
