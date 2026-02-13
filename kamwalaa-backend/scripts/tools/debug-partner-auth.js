require('dotenv').config();
const pool = require('../../src/config/db');

async function debugPartnerAuth() {
    try {
        const phone = '9030545655';
        const userRes = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

        if (userRes.rows.length === 0) {
            console.log('❌ User not found');
            process.exit(0);
        }

        const user = userRes.rows[0];
        console.log('👤 User info:', { id: user.id, role: user.role });

        const partnerRes = await pool.query('SELECT * FROM partners WHERE user_id = $1', [user.id]);
        if (partnerRes.rows.length > 0) {
            console.log('✅ Partner info:', { id: partnerRes.rows[0].id, user_id: partnerRes.rows[0].user_id, status: partnerRes.rows[0].status });
        } else {
            console.log('❌ No partner link found for this user ID');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

debugPartnerAuth();
