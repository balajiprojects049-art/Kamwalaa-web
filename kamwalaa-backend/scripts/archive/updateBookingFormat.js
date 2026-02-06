const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function updateBookingFormat() {
    const client = await pool.connect();
    try {
        console.log('Updating Booking Number Format...');

        // 1. Drop trigger first (to modify function)
        await client.query('DROP TRIGGER IF EXISTS generate_booking_number_trigger ON bookings');

        // 2. Restart Sequence to 1 (Optional, but user requested 001 example)
        await client.query('ALTER SEQUENCE booking_number_seq RESTART WITH 1');
        console.log(' - Sequence booking_number_seq restarted to 1');

        // 3. Update Function
        // Format: KM-YYYYNNN (e.g. KM-2026001)
        const newFunction = `
        CREATE OR REPLACE FUNCTION generate_booking_number()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.booking_number := 'KM-' || TO_CHAR(CURRENT_DATE, 'YYYY') || 
                                  LPAD(nextval('booking_number_seq')::TEXT, 3, '0');
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        `;
        await client.query(newFunction);
        console.log(' - Function generate_booking_number updated');

        // 4. Re-create Trigger
        const trigger = `
        CREATE TRIGGER generate_booking_number_trigger
        BEFORE INSERT ON bookings
        FOR EACH ROW EXECUTE FUNCTION generate_booking_number();
        `;
        await client.query(trigger);
        console.log(' - Trigger generate_booking_number_trigger re-created');

        console.log('SUCCESS: Booking ID format updated to KM-YYYY001');

    } catch (err) {
        console.error('ERROR updating format:', err);
    } finally {
        client.release();
        pool.end();
    }
}

updateBookingFormat();
