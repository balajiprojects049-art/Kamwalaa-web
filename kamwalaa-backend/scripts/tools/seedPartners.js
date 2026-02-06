const pool = require('./src/config/db');

const seedPartners = async () => {
    try {
        console.log('Seeding partners...');

        // 1. Create User for Partner
        const userRes = await pool.query(
            `INSERT INTO users (name, phone, email, city, role, is_verified)
             VALUES ('Ramesh Partner', '9876543210', 'ramesh@partner.com', 'Hyderabad', 'partner', true)
             ON CONFLICT (phone) DO UPDATE SET role = 'partner'
             RETURNING id`
        );
        const userId = userRes.rows[0].id;
        console.log('Partner User ID:', userId);

        // 2. Create Partner Profile
        const partnerRes = await pool.query(
            `INSERT INTO partners (user_id, business_name, rating, is_verified)
             VALUES ($1, 'Ramesh Services', 4.8, true)
             RETURNING id`,
            [userId]
        );

        console.log('Partner Created:', partnerRes.rows[0].id);
        console.log('✅ Seeding Complete');
        process.exit();

    } catch (err) {
        console.error('Error seeding:', err);
        process.exit(1);
    }
};

seedPartners();
