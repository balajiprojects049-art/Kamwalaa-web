const pool = require('./src/config/db');

const addWhatsappField = async () => {
    try {
        console.log('🔄 Adding whatsapp_number column to partners table...');

        await pool.query(`
            ALTER TABLE partners 
            ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(15);
        `);

        console.log('✅ whatsapp_number column added successfully.');
        process.exit();
    } catch (err) {
        console.error('❌ Error updating database:', err);
        process.exit(1);
    }
};

addWhatsappField();
