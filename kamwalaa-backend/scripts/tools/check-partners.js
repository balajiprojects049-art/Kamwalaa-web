require('dotenv').config();
const pool = require('../../src/config/db');

async function checkPartnerColumns() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'partners'
            ORDER BY ordinal_position
        `);

        console.log('PARTNERS_TABLE_START');
        result.rows.forEach(row => {
            console.log(`COL:${row.column_name}:${row.data_type}`);
        });
        console.log('PARTNERS_TABLE_END');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkPartnerColumns();
