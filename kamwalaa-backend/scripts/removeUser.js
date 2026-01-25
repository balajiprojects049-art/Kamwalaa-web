const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function removeUser() {
    try {
        console.log('Removing user "balaji"...');
        const res = await pool.query("DELETE FROM users WHERE name ILIKE '%balaji%' RETURNING id, name");
        if (res.rowCount > 0) {
            console.log(`Deleted ${res.rowCount} user(s):`);
            res.rows.forEach(row => console.log(`- ${row.name} (${row.id})`));
        } else {
            console.log('No user found with name "balaji"');
        }
    } catch (err) {
        console.error('Error removing user:', err);
    } finally {
        pool.end();
    }
}

removeUser();
