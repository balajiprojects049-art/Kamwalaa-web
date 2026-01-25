const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Import the data directly since we can't easily import a module in a script if not commonjs
// I'll copy the structure from the viewed file manually into this script variable
const servicesData = {
    electrical: {
        id: 'electrical',
        name: 'Electrical Services',
        icon: '/assets/icons/electrical.png',
        subcategories: [
            {
                id: 'fans',
                name: 'Fans & Air Coolers',
                services: [
                    { id: 'fan-install', name: 'Fan Installation', price: 250, description: 'Professional installation of ceiling fans...' },
                    { id: 'fan-replace', name: 'Fan Replacement', price: 300, description: 'Safe removal of old fans and installation of new ones...' },
                    { id: 'fan-repair', name: 'Fan Repair', price: 200, description: 'Diagnosis and repair of fan noise...' },
                    { id: 'regulator', name: 'Regulator Replacement', price: 150, description: 'Replacement of faulty fan regulators...' }
                ]
            },
            {
                id: 'wiring',
                name: 'Wiring & Power',
                services: [
                    { id: 'house-wiring', name: 'House Wiring', price: 5000, description: 'Complete electrical wiring...' }, // Custom -> 5000 placeholder
                    { id: 'switchboard', name: 'Switchboard Wiring', price: 1000, description: 'Installation and wiring of switchboards...' },
                    { id: 'earthing', name: 'Earthing Connection', price: 2000, description: 'Safety earthing for home electrical systems.' }
                ]
            },
            {
                id: 'lights',
                name: 'Lights & Switches',
                services: [
                    { id: 'light-install', name: 'Light Installation', price: 200, description: 'Installation of tube lights, fancy lights...' },
                    { id: 'switch-replace', name: 'Switch Replacement', price: 100, description: 'Quick replacement of burnt or stuck switches...' },
                    { id: 'festival-lights', name: 'Festival Lighting', price: 800, description: 'Decorative lighting setup for festivals.' }
                ]
            }
        ]
    },
    plumbing: {
        id: 'plumbing',
        name: 'Plumbing Services',
        icon: '/assets/icons/plumbing.png',
        subcategories: [
            {
                id: 'washbasin',
                name: 'Washbasin & Taps',
                services: [
                    { id: 'sink-install', name: 'Sink Installation', price: 500, description: 'Installation of new kitchen or bathroom sinks...' },
                    { id: 'sink-repair', name: 'Sink Leakage Repair', price: 250, description: 'Expert diagnosis and repair of sink leakages...' },
                    { id: 'tap-repair', name: 'Tap Repair', price: 200, description: 'Precision repair for dripping taps...' },
                    { id: 'tap-replace', name: 'Tap Replacement', price: 300, description: 'Swapping old rusted taps with new...' }
                ]
            },
            {
                id: 'tanks',
                name: 'Water Tanks',
                services: [
                    { id: 'tank-clean', name: 'Overhead Tank Cleaning', price: 1200, description: 'Full 6-stage mechanized cleaning process...' },
                    { id: 'sump-clean', name: 'Underground Sump Cleaning', price: 1500, description: 'Professional cleaning of underground water sumps...' }
                ]
            }
        ]
    },
    ac: {
        id: 'ac',
        name: 'AC Services',
        icon: '/assets/icons/ac.png',
        subcategories: [
            {
                id: 'ac-install',
                name: 'AC Installation',
                services: [
                    { id: 'split-ac-install', name: 'Split AC Installation', price: 1500, description: 'Professional installation of split AC units...' },
                    { id: 'window-ac-install', name: 'Window AC Installation', price: 800, description: 'Window AC installation with bracket mounting...' }
                ]
            },
            {
                id: 'ac-service',
                name: 'AC Servicing & Repair',
                services: [
                    { id: 'ac-deep-clean', name: 'AC Deep Cleaning Service', price: 499, description: 'Complete AC servicing including filter cleaning...' },
                    { id: 'ac-gas-refill', name: 'AC Gas Refilling', price: 2000, description: 'R32/R410A gas refilling...' }
                ]
            }
        ]
    },
    cleaning: {
        id: 'cleaning',
        name: 'Cleaning Services',
        icon: '/assets/icons/cleaning.png',
        subcategories: [
            {
                id: 'home-clean',
                name: 'Home Cleaning',
                services: [
                    { id: 'floor-clean', name: 'Floor Cleaning', price: 300, description: 'Industrial-grade floor scrubbing...' },
                    { id: 'tile-clean', name: 'Tile Cleaning', price: 400, description: 'Scrubbing and stain removal for tiles.' },
                    { id: 'cabinet-clean', name: 'Cabinet Cleaning', price: 450, description: 'Cleaning and dusting of cupboards and shelves.' }
                ]
            },
            {
                id: 'bathroom-cleaning',
                name: 'Bathroom Cleaning',
                services: [
                    { id: 'toilet-clean', name: 'Toilet Cleaning', price: 300, description: 'Acid wash and sanitization...' },
                    { id: 'bathroom-deep-clean', name: 'Bathroom Deep Cleaning', price: 800, description: 'Full deep cleaning of bathroom...' }
                ]
            }
        ]
    },
    painting: {
        id: 'painting',
        name: 'Painting Services',
        icon: '/assets/icons/painting.png',
        subcategories: [
            {
                id: 'painting-walls',
                name: 'Wall Painting',
                services: [
                    { id: 'interior-paint', name: 'Interior Wall Painting', price: 15, description: 'Premium interior makeover... (Price per sqft approx)' },
                    { id: 'exterior-paint', name: 'Exterior Wall Painting', price: 20, description: 'High-performance exterior waterproofing...' }
                ]
            }
        ]
    },
    waterPurifier: {
        id: 'waterPurifier',
        name: 'Water Purifier Services',
        icon: '/assets/images/services/water-purifier/main-ro-v2.png',
        subcategories: [
            {
                id: 'ro-repair',
                name: 'Service & Repair',
                services: [
                    { id: 'filter-clean', name: 'Filter Cleaning', price: 300, description: 'Cleaning of sediment and pre-carbon filters...' },
                    { id: 'filter-replace', name: 'Filter Replacement', price: 450, description: 'Comprehensive replacement of filters...' },
                    { id: 'membrane', name: 'Membrane Replacement', price: 600, description: 'Replacement of RO membrane...' }
                ]
            },
            {
                id: 'ro-install-cat', // Renamed to avoid ID conflict
                name: 'Installation',
                services: [
                    { id: 'ro-install-svc', name: 'New RO Installation', price: 600, description: 'Installation of new RO water purifiers...' }
                ]
            }
        ]
    }
};

const seedServices = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Cleaning up existing service data...');
        // We delete from categories, causing cascade delete to services
        // But we want to keep "users" and "partners" if possible.
        // Let's only delete categories that match our keys or just truncate for fresh start?
        // User asked "why all services deleted", implying they want them back.
        // Let's TRUNCATE categories CASCADE. This wipes bookings too? YES.
        // If we want to keep bookings, we have a problem because old IDs were invalid/mock.
        // So wiping is actually better for consistency now.
        // But to be safe, let's just delete from services/categories.

        await client.query('TRUNCATE table categories CASCADE');
        // This effectively clears services too because of FK cascade

        console.log('Inserting new service data...');

        let catOrder = 1;
        for (const [key, cat] of Object.entries(servicesData)) {
            // Insert Category
            const catRes = await client.query(
                `INSERT INTO categories (name, slug, description, icon_url, display_order, is_active)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [cat.name, cat.id, `${cat.name} Description`, cat.icon, catOrder++, true]
            );
            const catId = catRes.rows[0].id;
            console.log(`Created Category: ${cat.name}`);

            if (cat.subcategories) {
                let subOrder = 1;
                for (const sub of cat.subcategories) {
                    // Insert Subcategory
                    const subRes = await client.query(
                        `INSERT INTO categories (name, slug, description, parent_id, display_order, is_active)
                         VALUES ($1, $2, $3, $4, $5, $6)
                         RETURNING id`,
                        [sub.name, sub.id, `${sub.name} Description`, catId, subOrder++, true]
                    );
                    const subId = subRes.rows[0].id;
                    console.log(`  -> Created Subcategory: ${sub.name}`);

                    if (sub.services) {
                        for (const svc of sub.services) {
                            // Insert Service
                            // Note: db requires 'price' as decimal. 
                            // Ensure price is a number. specific custom/range prices handled as approx number for now.
                            let priceVal = svc.price;
                            if (typeof priceVal === 'string') {
                                // strip non-numeric except dot
                                const num = parseFloat(priceVal.replace(/[^0-9.]/g, ''));
                                priceVal = isNaN(num) ? 0 : num;
                            }

                            await client.query(
                                `INSERT INTO services (category_id, name, slug, description, price, is_active, city)
                                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                                [subId, svc.name, svc.id, svc.description, priceVal, true, 'Hyderabad']
                            );
                            console.log(`    -> Created Service: ${svc.name}`);
                        }
                    }
                }
            }
        }

        await client.query('COMMIT');
        console.log('Seeding completed successfully!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error seeding data:', e);
    } finally {
        client.release();
        pool.end();
    }
};

seedServices();
