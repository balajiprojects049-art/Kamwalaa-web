const { Pool } = require('pg');
require('dotenv').config();

// Parse DATABASE_URL manually to handle special characters safely
let poolConfig;

if (process.env.DATABASE_URL) {
    try {
        const connectionString = process.env.DATABASE_URL;
        // Check if it's a Supabase or Neon URL to add SSL
        const requiresSSL = connectionString.includes('supabase.co') || connectionString.includes('neon.tech');

        poolConfig = {
            connectionString,
            ssl: requiresSSL ? { rejectUnauthorized: false } : false
        };
    } catch (err) {
        console.error('Error parsing DATABASE_URL', err);
    }
} else {
    poolConfig = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };
}

const pool = new Pool(poolConfig);

module.exports = pool;
