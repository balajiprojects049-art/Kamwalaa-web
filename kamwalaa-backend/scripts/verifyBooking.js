const { Pool } = require('pg');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function verifyBooking() {
    const client = await pool.connect();
    try {
        console.log('--- Starting System Verification ---');

        // 1. Fetch a valid Service
        const serviceRes = await client.query('SELECT * FROM services WHERE is_active = true LIMIT 1');
        if (serviceRes.rows.length === 0) {
            throw new Error('No active services found!');
        }
        const service = serviceRes.rows[0];
        console.log(`[PASS] Found Service: ${service.name} (${service.id})`);

        // 2. Create a Test User
        const testUserEmail = `test_${Date.now()}@example.com`;
        const testPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`; // Random 10 digit, starts with 9
        const userRes = await client.query(
            'INSERT INTO users (name, email, phone, city, role, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            ['System Test User', testUserEmail, testPhone, 'Hyderabad', 'customer', true]
        );
        const user = userRes.rows[0];
        console.log(`[PASS] Created Test User: ${user.name} (${user.id})`);

        // 3. Attempt Booking
        const bookingRes = await client.query(
            `INSERT INTO bookings (
                user_id, service_id, booking_date, booking_time,
                address_line1, address_line2, city, state, pincode, landmark,
                special_instructions, payment_method,
                service_price, total_amount, status, payment_status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING *`,
            [
                user.id,
                service.id,
                '2026-02-01',
                '10:00:00',
                'Test Address Line 1',
                'Line 2',
                'Hyderabad',
                'Telangana',
                '500001',
                'Near Park',
                'Test Booking',
                'cash',
                service.price,
                service.price,
                'pending',
                'pending'
            ]
        );

        const booking = bookingRes.rows[0];
        console.log(`[PASS] Booking Created Successfully!`);
        console.log(`       Booking ID: ${booking.id}`);
        console.log(`       Booking No: ${booking.booking_number}`);
        console.log('--- Verification Complete: System is Healthy ---');

        // Cleanup
        await client.query('DELETE FROM users WHERE id = $1', [user.id]);
        // Cascade should delete booking

    } catch (err) {
        console.error('[FAIL] Verification Failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

verifyBooking();
