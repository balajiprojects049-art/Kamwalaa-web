require('dotenv').config();
const pool = require('../../src/config/db');

async function checkUserRole() {
    try {
        const phone = '9030545655';
        const result = await pool.query('SELECT id, name, role, is_verified FROM users WHERE phone = $1', [phone]);

        if (result.rows.length > 0) {
            console.log('✅ Found user record:');
            console.log(JSON.stringify(result.rows[0], null, 2));
        } else {
            console.log('❌ No user found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkUserRole();
