const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const applyServiceUpdate = async () => {
    console.log('🔄 Starting service update...');

    let poolConfig;
    if (process.env.DATABASE_URL) {
        console.log('🔗 Using DATABASE_URL connection string');
        poolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        };
    } else {
        console.log('🔗 Using local DB configuration');
        poolConfig = {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: process.env.DB_NAME || 'kamwalaa_db'
        };
    }

    const pool = new Pool(poolConfig);

    try {
        console.log('🔌 Connecting to the database...');
        await pool.connect();

        const sqlPath = path.join(__dirname, '..', 'db', 'add_new_services_feb2026.sql');
        console.log(`📖 Reading SQL file: ${sqlPath}`);

        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing SQL update...');
        await pool.query(sql);

        console.log('✅ Successfully added new Interior Design and Construction services to the database!');

    } catch (err) {
        console.error('❌ Error applying service update:', err);
    } finally {
        await pool.end();
        console.log('👋 Database connection closed.');
    }
};

applyServiceUpdate();
