const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function checkUsers() {
    try {
        console.log('Checking users table...');
        const res = await pool.query('SELECT id, name, email, phone FROM users');
        console.log('Users in DB:', res.rows.length);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error('Error checking users:', err);
    } finally {
        pool.end();
    }
}

checkUsers();
