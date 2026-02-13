require('dotenv').config();
const pool = require('../../src/config/db');

async function fixUserRole() {
    try {
        const phone = '9030545655';
        await pool.query("UPDATE users SET role = 'partner' WHERE phone = $1", [phone]);
        console.log('✅ User role updated to partner for', phone);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixUserRole();
