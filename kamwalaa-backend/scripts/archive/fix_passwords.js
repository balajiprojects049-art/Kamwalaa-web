const pool = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        console.log('Hashed Password:', hashedPassword);

        await pool.query('UPDATE users SET password = $1', [hashedPassword]);
        console.log('✅ All users passwords updated to "admin123"');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixPasswords();
