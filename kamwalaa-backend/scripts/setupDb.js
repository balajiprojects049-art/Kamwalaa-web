const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const setupDatabase = async () => {
    const connectionString = process.env.DATABASE_URL;
    let poolConfig;

    if (connectionString) {
        console.log('🔗 Using DATABASE_URL connection string');
        poolConfig = {
            connectionString,
            ssl: { rejectUnauthorized: false }
        };
    } else {
        poolConfig = {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'postgres' // Connect to default postgres first
        };
    }

    const targetDbName = process.env.DB_NAME || 'kamwalaa_db';

    console.log(`🔌 Connecting to Database...`);

    // If using Supabase/Cloud (DATABASE_URL), we skip database creation check
    // because we are connecting directly to the target DB instance.
    if (!process.env.DATABASE_URL) {
        // Local setup: Connect to 'postgres' first to create the DB
        let pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'postgres'
        });

        try {
            await pool.connect();
            const res = await pool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [targetDbName]);
            if (res.rowCount === 0) {
                console.log(`✨ Database '${targetDbName}' does not exist. Creating it...`);
                await pool.query(`CREATE DATABASE "${targetDbName}"`);
                console.log(`✅ Database '${targetDbName}' created successfully.`);
            } else {
                console.log(`ℹ️  Database '${targetDbName}' already exists.`);
            }
        } catch (err) {
            console.error('❌ Error during database creation check:', err.message);
            // Don't exit here, might just be permission issue, try connecting to target DB anyway
        } finally {
            await pool.end();
        }
    }

    // 2. Connect to the target database and run schema
    console.log(`🔄 Connecting to target database to apply schema...`);
    // Re-use the config determined at the start
    const pool = new Pool(poolConfig);

    try {
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('📜 Applying schema...');
        await pool.query(schemaSql);
        console.log('✅ Schema applied successfully!');
        console.log('✅ Tables created and sample data inserted.');

    } catch (err) {
        console.error('❌ Error applying schema:', err.message);
    } finally {
        await pool.end();
    }
};

setupDatabase();
