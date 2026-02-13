require('dotenv').config();
const pool = require('../../src/config/db');

async function checkPartnerRecord() {
    try {
        const phone = '9030545655';
        const result = await pool.query(`
            SELECT p.*, u.name as user_name, u.phone as user_phone 
            FROM partners p
            JOIN users u ON p.user_id = u.id
            WHERE u.phone = $1
        `, [phone]);

        if (result.rows.length > 0) {
            console.log('✅ Found partner record:');
            console.log(JSON.stringify(result.rows[0], null, 2));
        } else {
            console.log('❌ No partner record found for this phone.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkPartnerRecord();
