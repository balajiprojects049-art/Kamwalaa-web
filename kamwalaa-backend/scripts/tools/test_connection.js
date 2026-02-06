const pool = require('./src/config/db');

async function testConnection() {
    try {
        console.log('Testing DB connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connection successful:', res.rows[0]);

        console.log('Testing Categories table...');
        const cats = await pool.query('SELECT name FROM categories LIMIT 3');
        console.log('✅ Categories found:', cats.rows);
    } catch (err) {
        console.error('❌ Connection failed:', err);
    } finally {
        pool.end();
    }
}

testConnection();
