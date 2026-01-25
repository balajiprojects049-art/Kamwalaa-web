const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function createTestUser() {
    try {
        const phone = '9999999999';

        // 1. Check if exists
        const check = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
        if (check.rows.length > 0) {
            console.log('Test user already exists.');
            console.log(`Phone: ${phone}`);
            console.log('OTP: 123456');
            return;
        }

        // 2. Create if not
        const res = await pool.query(
            `INSERT INTO users (name, email, phone, city, role, is_verified) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING id, name, phone`,
            ['Test User', 'testuser@kamwalaa.com', phone, 'Hyderabad', 'customer', true]
        );

        console.log('✅ Test User Created Successfully!');
        console.log(`Name: ${res.rows[0].name}`);
        console.log(`Phone: ${res.rows[0].phone}`);
        console.log('OTP: 123456');

    } catch (err) {
        console.error('Error creating test user:', err);
    } finally {
        pool.end();
    }
}

createTestUser();
