require('dotenv').config();
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const adminEmail = 'admin@kamwalaa.com';
        const adminPassword = 'Admin@123456'; // Change this after first login!
        const adminName = 'Kamwalaa Admin';

        // Check if admin already exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [adminEmail]);
        if (existing.rows.length > 0) {
            console.log('⚠️  Admin already exists with email:', adminEmail);
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Create admin user
        await pool.query(`
            INSERT INTO users (name, email, phone, password, role, is_verified, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, [adminName, adminEmail, '0000000000', hashedPassword, 'admin', true]);

        console.log('✅ Admin account created successfully!');
        console.log('');
        console.log('📧 Email:', adminEmail);
        console.log('🔒 Password:', adminPassword);
        console.log('');
        console.log('🔗 Login at: http://localhost:5173/admin/login');
        console.log('🔗 Or: https://kamwalaa-web.vercel.app/admin/login');
        console.log('');
        console.log('⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
