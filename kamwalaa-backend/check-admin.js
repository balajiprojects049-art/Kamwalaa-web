require('dotenv').config();
const pool = require('./src/config/db');

async function checkAdmin() {
    try {
        const result = await pool.query("SELECT email, role FROM users WHERE role = 'admin' LIMIT 1");
        if (result.rows.length > 0) {
            console.log('✅ Admin account found:');
            console.log('   Email:', result.rows[0].email);
        } else {
            console.log('❌ No admin account found in database');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkAdmin();
