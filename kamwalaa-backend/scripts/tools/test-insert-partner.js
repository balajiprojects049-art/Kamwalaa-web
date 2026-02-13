require('dotenv').config();
const pool = require('../../src/config/db');

async function testInsertPartner() {
    try {
        console.log('🧪 Testing partner insertion...');

        const testPhone = '9030545655'; // Use the user's phone from screenshot

        // 1. Find user
        const userRes = await pool.query('SELECT id FROM users WHERE phone = $1', [testPhone]);
        if (userRes.rows.length === 0) {
            console.log('❌ User not found. Use a real user phone.');
            process.exit(1);
        }
        const userId = userRes.rows[0].id;

        // 2. Try insert
        const query = `
            INSERT INTO partners (
                user_id, business_name, 
                aadhar_number, pan_number, address, 
                aadhar_file_url, pan_file_url, 
                service_category, whatsapp_number,
                status, is_verified, rating
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', false, 0)
             RETURNING id;
        `;

        const params = [
            userId, 'Test Business', '123412341234', 'ABCDE1234F',
            '123 Test St', '/uploads/test.png', '/uploads/test.png',
            'Plumbing', testPhone
        ];

        const res = await pool.query(query, params);
        console.log('✅ Test insertion successful! ID:', res.rows[0].id);

        // Clean up
        await pool.query('DELETE FROM partners WHERE id = $1', [res.rows[0].id]);
        console.log('🗑️ Test record cleaned up.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Test insertion failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

testInsertPartner();
