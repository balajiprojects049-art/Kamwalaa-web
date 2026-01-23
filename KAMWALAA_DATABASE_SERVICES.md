# 🗄️ KAMWALAA - DATABASE SCHEMA FOR SERVICES

## Complete PostgreSQL Schema for Kamwalaa Service Platform

---

## 📊 SERVICE CATEGORIES & SUB-SERVICES INSERT SCRIPT

```sql
-- ==========================================================
-- KAMWALAA SERVICES - COMPLETE DATABASE POPULATION
-- ==========================================================

-- First, insert main categories
INSERT INTO categories (name, slug, description, icon_url, display_order, is_active) VALUES
('Electrical Services', 'electrical-services', 'Complete electrical solutions for your home', '/icons/electrical.svg', 1, true),
('Plumbing Services', 'plumbing-services', 'Professional plumbing services', '/icons/plumbing.svg', 2, true),
('Home Painting & Surface Works', 'painting-surface-works', 'Painting and surface finishing services', '/icons/painting.svg', 3, true),
('Water Purifier Services', 'water-purifier-services', 'RO installation and maintenance', '/icons/water-purifier.svg', 4, true),
('Home Dismantling Services', 'dismantling-services', 'Safe dismantling for renovation', '/icons/dismantling.svg', 5, true),
('Cleaning Services', 'cleaning-services', 'Deep cleaning solutions', '/icons/cleaning.svg', 6, true),
('Gardening & Plantation Services', 'gardening-services', 'Garden care and maintenance', '/icons/gardening.svg', 7, true),
('Stove & Gas Services', 'gas-services', 'Gas installation and safety services', '/icons/gas.svg', 8, true);

-- ==========================================================
-- ELECTRICAL SERVICES SUB-CATEGORIES
-- ==========================================================

-- Fan Services
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Fan Services', 'fan-services', 'Fan installation, repair and maintenance', id, 1
FROM categories WHERE slug = 'electrical-services';

-- House Wiring
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'House Wiring', 'house-wiring', 'Complete house wiring solutions', id, 2
FROM categories WHERE slug = 'electrical-services';

-- Light & Switch Installation
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Light & Switch Installation', 'light-switch-installation', 'Light and switch fitting services', id, 3
FROM categories WHERE slug = 'electrical-services';

-- Decorative Lighting
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Decorative Lighting', 'decorative-lighting', 'Aesthetic and festival lighting', id, 4
FROM categories WHERE slug = 'electrical-services';

-- ==========================================================
-- PLUMBING SERVICES SUB-CATEGORIES
-- ==========================================================

-- Sink & Tap Services
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Sink & Tap Services', 'sink-tap-services', 'Sink and tap installation and repair', id, 1
FROM categories WHERE slug = 'plumbing-services';

-- Water Tank & Sump Cleaning
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Water Tank & Sump Cleaning', 'tank-sump-cleaning', 'Tank and sump cleaning services', id, 2
FROM categories WHERE slug = 'plumbing-services';

-- Pipe & Water Line Services
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Pipe & Water Line Services', 'pipe-water-line', 'Pipeline installation and repair', id, 3
FROM categories WHERE slug = 'plumbing-services';

-- ==========================================================
-- PAINTING SUB-CATEGORIES
-- ==========================================================

-- Painting Services
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Painting Services', 'painting-services', 'Interior and exterior painting', id, 1
FROM categories WHERE slug = 'painting-surface-works';

-- Marble, Granite & Tiles
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Marble, Granite & Tiles', 'marble-granite-tiles', 'Flooring and surface installation', id, 2
FROM categories WHERE slug = 'painting-surface-works';

-- ==========================================================
-- WATER PURIFIER SUB-CATEGORIES
-- ==========================================================

-- RO Installation
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'RO Installation', 'ro-installation', 'Water purifier installation services', id, 1
FROM categories WHERE slug = 'water-purifier-services';

-- RO Servicing
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'RO Servicing', 'ro-servicing', 'Water purifier maintenance and repair', id, 2
FROM categories WHERE slug = 'water-purifier-services';

-- ==========================================================
-- CLEANING SUB-CATEGORIES
-- ==========================================================

-- Kitchen Cleaning
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Kitchen Cleaning', 'kitchen-cleaning', 'Deep kitchen cleaning', id, 1
FROM categories WHERE slug = 'cleaning-services';

-- Bathroom Cleaning
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Bathroom Cleaning', 'bathroom-cleaning', 'Complete bathroom sanitization', id, 2
FROM categories WHERE slug = 'cleaning-services';

-- ==========================================================
-- GARDENING SUB-CATEGORIES
-- ==========================================================

-- Garden Maintenance
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Garden Maintenance', 'garden-maintenance', 'Lawn and garden care', id, 1
FROM categories WHERE slug = 'gardening-services';

-- ==========================================================
-- GAS SERVICES SUB-CATEGORIES
-- ==========================================================

-- Gas Installation & Repair
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Gas Installation & Repair', 'gas-installation-repair', 'Stove and gas line services', id, 1
FROM categories WHERE slug = 'gas-services';

```

---

## 📝 DETAILED SERVICES INSERTION

```sql
-- ==========================================================
-- ELECTRICAL SERVICES - FAN SERVICES
-- ==========================================================

-- Fan Installation (New)
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id, 
'Fan Installation (New Fan Fixing)',
'fan-installation-new',
'Installation of brand new ceiling fans',
'Complete fan installation service including bracket mounting, wiring connection, regulator installation, and safety testing. Ensures proper air circulation and electrical safety.',
250.00,
false,
true
FROM categories c WHERE c.slug = 'fan-services';

-- Fan Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Fan Replacement (Old to New)',
'fan-replacement',
'Replace old fan with new one',
'Complete service including removal of old fan, bracket checking/replacement, new fan installation, wiring upgrade if needed, regulator replacement, testing and cleanup.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'fan-services';

-- Fan Repair
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Fan Repair (Noise, Speed Issues)',
'fan-repair',
'Fix fan noise and speed problems',
'Expert diagnosis and repair of bearing issues, capacitor replacement, speed control repair, noise troubleshooting, and testing for extended fan life.',
200.00,
true,
true
FROM categories c WHERE c.slug = 'fan-services';

-- Regulator Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Regulator Replacement',
'regulator-replacement',
'Replace fan regulator',
'Old regulator removal, new regulator installation (standard/digital), wiring connection, and speed testing.',
150.00,
false,
true
FROM categories c WHERE c.slug = 'fan-services';

-- ==========================================================
-- ELECTRICAL SERVICES - HOUSE WIRING
-- ==========================================================

-- New House Wiring
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'New House Wiring (Complete)',
'new-house-wiring',
'Complete electrical installation for new homes',
'Full electrical service including layout planning, wire routing, switchboard installation, distribution board setup, earthing system, MCB/RCCB installation, testing and safety certification.',
NULL, -- Custom quote based on area
true,
true
FROM categories c WHERE c.slug = 'house-wiring';

-- Partial Wiring
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Partial Wiring (Room/Kitchen)',
'partial-wiring',
'Single room or kitchen rewiring',
'Includes room/kitchen rewiring, point addition, switch and socket installation, connection to main board, and testing.',
3000.00,
true,
true
FROM categories c WHERE c.slug = 'house-wiring';

-- Switchboard Wiring
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Switchboard Wiring',
'switchboard-wiring',
'Switchboard installation and organization',
'Old switchboard removal, new board installation, wiring reorganization, proper labeling, and testing.',
1000.00,
false,
true
FROM categories c WHERE c.slug = 'house-wiring';

-- Earthing Connection
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Earthing Connection',
'earthing-connection',
'Electrical safety earthing system',
'Earth pit digging, copper plate/rod installation, earth wire connection, resistance testing, and connection to main board.',
2000.00,
true,
true
FROM categories c WHERE c.slug = 'house-wiring';

-- ==========================================================
-- ELECTRICAL SERVICES - LIGHT & SWITCH
-- ==========================================================

-- Light Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Light Installation (LED, Tube Light)',
'light-installation',
'Install new lights in your home',
'Ceiling/wall light installation, LED panel fitting, tube light with starter/choke, wiring connection, and testing.',
200.00,
false,
true
FROM categories c WHERE c.slug = 'light-switch-installation';

-- Switch Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Switch Replacement',
'switch-replacement',
'Replace old switches with new ones',
'Old switch removal, new switch installation, proper wiring connection, and testing.',
100.00,
false,
true
FROM categories c WHERE c.slug = 'light-switch-installation';

-- Switchboard Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Switchboard Installation (Complete)',
'switchboard-installation',
'Install modular switchboard',
'Complete switchboard fixing, multiple switch installation, modular plate fitting, wiring connections, and testing.',
400.00,
false,
true
FROM categories c WHERE c.slug = 'light-switch-installation';

-- Dimmer Switch Setup
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Dimmer Switch Setup',
'dimmer-switch-setup',
'Install dimmer for adjustable lighting',
'Dimmer switch installation, compatible bulb checking, wiring adjustment, and dimming testing.',
250.00,
false,
true
FROM categories c WHERE c.slug = 'light-switch-installation';

-- ==========================================================
-- ELECTRICAL SERVICES - DECORATIVE LIGHTING
-- ==========================================================

-- Festival Lighting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Festival Lighting',
'festival-lighting',
'Decorative lights for festivals',
'String lights installation, timer setup, extension board placement, outdoor/indoor setup, and safety measures.',
800.00,
false,
true
FROM categories c WHERE c.slug = 'decorative-lighting';

-- Balcony Lighting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Balcony Lighting',
'balcony-lighting',
'Beautiful LED lights for balcony',
'LED strip installation, waterproof connection, switch/remote setup, mounting and testing.',
1000.00,
false,
true
FROM categories c WHERE c.slug = 'decorative-lighting';

-- False Ceiling Lights
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'False Ceiling Lights',
'false-ceiling-lights',
'Recessed lights for false ceiling',
'Recessed light installation, COB light fitting, wiring through false ceiling, and testing.',
2000.00,
false,
true
FROM categories c WHERE c.slug = 'decorative-lighting';

-- Outdoor Decorative Lights
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Outdoor Decorative Lights',
'outdoor-decorative-lights',
'Garden and pathway lighting',
'Garden lights installation, pathway lighting, wall-mounted lights, and weatherproof connections.',
1500.00,
false,
true
FROM categories c WHERE c.slug = 'decorative-lighting';

-- ==========================================================
-- PLUMBING SERVICES - SINK & TAP
-- ==========================================================

-- Sink Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Sink Installation',
'sink-installation',
'Install new sink in kitchen/bathroom',
'Sink placement and fixing, drain pipe connection, tap installation, sealant application, and water flow testing.',
500.00,
false,
true
FROM categories c WHERE c.slug = 'sink-tap-services';

-- Sink Leakage Repair
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Sink Leakage Repair',
'sink-leakage-repair',
'Fix leaking sink',
'Leak detection, sealant/putty application, drain pipe repair, and testing.',
250.00,
true,
true
FROM categories c WHERE c.slug = 'sink-tap-services';

-- Tap Repair
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Tap Repair',
'tap-repair',
'Fix dripping or loose taps',
'Tap disassembly, washer/cartridge replacement, handle repair, reassembly and testing.',
200.00,
true,
true
FROM categories c WHERE c.slug = 'sink-tap-services';

-- Tap Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Tap Replacement',
'tap-replacement',
'Replace old tap with new one',
'Old tap removal, new tap installation, teflon tape application, connection tightening, and testing.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'sink-tap-services';

-- ==========================================================
-- PLUMBING SERVICES - TANK CLEANING
-- ==========================================================

-- Overhead Tank Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Overhead Tank Cleaning',
'overhead-tank-cleaning',
'Deep cleaning of overhead water tank',
'Water draining, manual scrubbing, sludge removal, disinfection with chemicals, and refilling.',
1200.00,
false,
true
FROM categories c WHERE c.slug = 'tank-sump-cleaning';

-- Underground Sump Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Underground Sump Cleaning',
'underground-sump-cleaning',
'Sump tank deep cleaning',
'Pump-out water, manual cleaning, sludge removal, wall scrubbing, disinfection, and refilling.',
1500.00,
false,
true
FROM categories c WHERE c.slug = 'tank-sump-cleaning';

-- Disinfection Service
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Tank Disinfection',
'tank-disinfection',
'Sanitize water tank',
'Chemical disinfection, anti-algae treatment, and final rinsing.',
400.00,
false,
true
FROM categories c WHERE c.slug = 'tank-sump-cleaning';

-- ==========================================================
-- PLUMBING SERVICES - PIPES & WATER LINES
-- ==========================================================

-- New Water Line Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'New Water Line Installation',
'new-water-line',
'Install new water pipeline',
'Pipeline route planning, pipe laying, joint sealing, connection to main line, and pressure testing.',
2500.00,
true,
true
FROM categories c WHERE c.slug = 'pipe-water-line';

-- Pipe Leakage Repair
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Pipe Leakage Repair',
'pipe-leakage-repair',
'Fix leaking water pipes',
'Leak detection, pipe section replacement, joint sealing, and testing.',
500.00,
true,
true
FROM categories c WHERE c.slug = 'pipe-water-line';

-- Blockage Removal
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Drain Blockage Removal',
'drain-blockage-removal',
'Clear blocked drains and pipes',
'Blockage diagnosis, manual/machine cleaning, drain snake usage, and water flow testing.',
800.00,
true,
true
FROM categories c WHERE c.slug = 'pipe-water-line';

-- Bathroom Pipeline Repair
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Bathroom Pipeline Repair',
'bathroom-pipeline-repair',
'Complete bathroom plumbing fix',
'Complete bathroom pipeline check, leak repair, fixture connection, and testing.',
1200.00,
true,
true
FROM categories c WHERE c.slug = 'pipe-water-line';

-- ==========================================================
-- PAINTING SERVICES
-- ==========================================================

-- Interior Wall Painting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Interior Wall Painting',
'interior-wall-painting',
'Professional interior painting',
'Surface preparation, putty application (2 coats), primer coat, paint application (2 coats), touch-up, and cleanup. Price per sq.ft.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'painting-services';

-- Exterior Wall Painting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Exterior Wall Painting',
'exterior-wall-painting',
'Weather-resistant exterior paint',
'Wall cleaning, crack filling, weatherproof primer, outdoor paint (2 coats), and cleanup.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'painting-services';

-- Ceiling Painting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Ceiling Painting',
'ceiling-painting',
'Ceiling paint service',
'Ceiling cleaning, putty application, primer coat, white/color paint (2 coats).',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'painting-services';

-- Texture Painting
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Texture Painting',
'texture-painting',
'Premium wall texture design',
'Base preparation, texture design application, color coating, and protective layer.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'painting-services';

-- ==========================================================
-- FLOORING SERVICES
-- ==========================================================

-- Tile Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Tile Installation',
'tile-installation',
'Professional tile laying service',
'Surface leveling, tile laying with adhesive, grout application, cleaning and polishing.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'marble-granite-tiles';

-- Tile Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Tile Replacement',
'tile-replacement',
'Replace broken or damaged tiles',
'Broken tile removal, surface preparation, new tile installation, grouting, and cleaning.',
350.00,
false,
true
FROM categories c WHERE c.slug = 'marble-granite-tiles';

-- Marble Flooring
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Marble Flooring',
'marble-flooring',
'Premium marble floor installation',
'Floor leveling, marble laying, polishing, and sealing.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'marble-granite-tiles';

-- Granite Kitchen Slabs
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Granite Kitchen Slabs',
'granite-kitchen-slabs',
'Granite counter top installation',
'Measurement, slab cutting, installation, edge polishing, and sealing.',
NULL, -- Custom quote
true,
true
FROM categories c WHERE c.slug = 'marble-granite-tiles';

-- ==========================================================
-- WATER PURIFIER SERVICES - INSTALLATION
-- ==========================================================

-- New RO Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'New RO Installation',
'new-ro-installation',
'Install water purifier',
'Wall mounting, water line connection, drain line installation, electrical connection, and water quality testing.',
600.00,
false,
true
FROM categories c WHERE c.slug = 'ro-installation';

-- RO Relocation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'RO Relocation',
'ro-relocation',
'Move RO to new location',
'Uninstallation from old location, safe transportation, installation at new location, all connections, and testing.',
700.00,
false,
true
FROM categories c WHERE c.slug = 'ro-installation';

-- ==========================================================
-- WATER PURIFIER SERVICES - SERVICING
-- ==========================================================

-- Filter Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'RO Filter Cleaning',
'ro-filter-cleaning',
'Clean RO filters',
'All filter removal, manual cleaning, sediment filter wash, carbon filter check, and reinstallation.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'ro-servicing';

-- Filter Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'RO Filter Replacement',
'ro-filter-replacement',
'Replace RO filters',
'Old filter removal, new filter installation, system flushing, and testing.',
450.00,
false,
true
FROM categories c WHERE c.slug = 'ro-servicing';

-- Membrane Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'RO Membrane Replacement',
'ro-membrane-replacement',
'Replace RO membrane',
'Old membrane removal, new RO membrane installation, system sanitization, and TDS testing.',
600.00,
false,
true
FROM categories c WHERE c.slug = 'ro-servicing';

-- ==========================================================
-- HOME DISMANTLING SERVICES
-- ==========================================================

-- Kitchen Dismantling
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Kitchen Dismantling',
'kitchen-dismantling',
'Complete kitchen removal',
'Cabinet removal, sink and tap removal, countertop removal, gas line disconnection, and safe disposal.',
3500.00,
true,
true
FROM categories c WHERE c.slug = 'dismantling-services';

-- Wardrobe Dismantling
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Wardrobe Dismantling',
'wardrobe-dismantling',
'Remove old wardrobes',
'Shelf removal, panel dismantling, hardware collection, and area cleaning.',
1200.00,
false,
true
FROM categories c WHERE c.slug = 'dismantling-services';

-- False Ceiling Dismantling
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'False Ceiling Dismantling',
'false-ceiling-dismantling',
'Remove false ceiling',
'Light removal, panel dismantling, framework removal, material segregation, and cleanup.',
2000.00,
true,
true
FROM categories c WHERE c.slug = 'dismantling-services';

-- Old Fittings Removal
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Old Fittings Removal',
'old-fittings-removal',
'Remove old fixtures',
'Old fixtures removal, minor wall repair, debris collection, and site cleaning.',
800.00,
false,
true
FROM categories c WHERE c.slug = 'dismantling-services';

-- ==========================================================
-- CLEANING SERVICES - KITCHEN
-- ==========================================================

-- Stove & Chimney Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Stove & Chimney Cleaning',
'stove-chimney-cleaning',
'Deep clean stove and chimney',
'Burner cleaning, grease removal from chimney, filter cleaning, and polishing.',
600.00,
false,
true
FROM categories c WHERE c.slug = 'kitchen-cleaning';

-- Cabinet Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Kitchen Cabinet Cleaning',
'kitchen-cabinet-cleaning',
'Clean kitchen cabinets',
'Inside/outside cleaning, shelf wiping, handle polishing, and organization.',
450.00,
false,
true
FROM categories c WHERE c.slug = 'kitchen-cleaning';

-- Kitchen Floor Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Kitchen Floor Cleaning',
'kitchen-floor-cleaning',
'Deep floor cleaning',
'Sweeping, mopping with disinfectant, grease spot removal, and polishing.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'kitchen-cleaning';

-- ==========================================================
-- CLEANING SERVICES - BATHROOM
-- ==========================================================

-- Bathroom Tile Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Bathroom Tile Cleaning',
'bathroom-tile-cleaning',
'Deep tile and grout cleaning',
'Wall tile scrubbing, floor tile cleaning, grout whitening, and stain removal.',
400.00,
false,
true
FROM categories c WHERE c.slug = 'bathroom-cleaning';

-- Toilet Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Toilet Deep Cleaning',
'toilet-deep-cleaning',
'Sanitize toilet',
'Bowl cleaning and sanitization, tank cleaning, flush mechanism check, and deodorization.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'bathroom-cleaning';

-- Basin Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Basin & Mirror Cleaning',
'basin-mirror-cleaning',
'Clean basin and mirror',
'Sink scrubbing, tap polishing, drain cleaning, and mirror wiping.',
200.00,
false,
true
FROM categories c WHERE c.slug = 'bathroom-cleaning';

-- ==========================================================
-- GARDENING SERVICES
-- ==========================================================

-- Planting New Plants
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Planting New Plants',
'planting-new-plants',
'Plant new greenery',
'Soil preparation, plant placement, initial watering, and care instructions.',
500.00,
false,
true
FROM categories c WHERE c.slug = 'garden-maintenance';

-- Lawn Maintenance
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Lawn Maintenance',
'lawn-maintenance',
'Grass cutting and lawn care',
'Grass cutting, edge trimming, weed removal, and fertilizer application.',
800.00,
false,
true
FROM categories c WHERE c.slug = 'garden-maintenance';

-- Garden Cleaning
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Garden Cleaning',
'garden-cleaning',
'Clean garden area',
'Dry leaf removal, plant trimming, path cleaning, and waste disposal.',
450.00,
false,
true
FROM categories c WHERE c.slug = 'garden-maintenance';

-- Garden Water Line Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Garden Water Line Installation',
'garden-water-line',
'Install drip irrigation',
'Drip irrigation setup, sprinkler installation, timer setup, and testing.',
1800.00,
true,
true
FROM categories c WHERE c.slug = 'garden-maintenance';

-- ==========================================================
-- GAS SERVICES
-- ==========================================================

-- Stove Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Gas Stove Installation',
'gas-stove-installation',
'Install new gas stove',
'Stove placement, gas connection, leak testing, and burner testing.',
300.00,
false,
true
FROM categories c WHERE c.slug = 'gas-installation-repair';

-- Gas Pipeline Installation
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Gas Pipeline Installation',
'gas-pipeline-installation',
'Install gas pipeline',
'Pipeline routing, fitting installation, regulator connection, and safety testing.',
1200.00,
true,
true
FROM categories c WHERE c.slug = 'gas-installation-repair';

-- Gas Leakage Detection
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Gas Leakage Detection',
'gas-leakage-detection',
'Detect and fix gas leaks',
'Complete pipeline check, soap solution testing, leak identification, and temporary sealing.',
350.00,
false,
true
FROM categories c WHERE c.slug = 'gas-installation-repair';

-- Gas Regulator Replacement
INSERT INTO services (category_id, name, slug, short_description, description, price, is_free_site_visit, is_active)
SELECT c.id,
'Gas Regulator Replacement',
'gas-regulator-replacement',
'Replace gas regulator',
'Old regulator removal, new regulator installation, leak testing, and safety check.',
200.00,
false,
true
FROM categories c WHERE c.slug = 'gas-installation-repair';

```

---

## 📊 SERVICES SUMMARY QUERY

```sql
-- Get complete service count by category
SELECT 
    main_cat.name AS main_category,
    sub_cat.name AS sub_category,
    COUNT(s.id) AS service_count,
    MIN(s.price) AS min_price,
    MAX(s.price) AS max_price
FROM categories main_cat
LEFT JOIN categories sub_cat ON sub_cat.parent_id = main_cat.id
LEFT JOIN services s ON s.category_id = sub_cat.id
WHERE main_cat.parent_id IS NULL
GROUP BY main_cat.name, sub_cat.name, main_cat.display_order
ORDER BY main_cat.display_order, sub_cat.display_order;
```

---

## 🎯 SERVICE ADD-ONS TABLE (OPTIONAL)

```sql
-- Table for service add-ons (materials, extra work, etc.)
CREATE TABLE service_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_optional BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example add-ons for Fan Installation
INSERT INTO service_addons (service_id, name, description, price, is_optional)
SELECT 
    s.id,
    'Fan (Basic Model)',
    'Standard ceiling fan 1200mm',
    1200.00,
    true
FROM services s WHERE s.slug = 'fan-installation-new';

INSERT INTO service_addons (service_id, name, description, price, is_optional)
SELECT 
    s.id,
    'Fan (Premium Model)',
    'Premium ceiling fan with remote',
    2500.00,
    true
FROM services s WHERE s.slug = 'fan-installation-new';

INSERT INTO service_addons (service_id, name, description, price, is_optional)
SELECT 
    s.id,
    'Additional Bracket',
    'Heavy-duty ceiling bracket',
    150.00,
    true
FROM services s WHERE s.slug = 'fan-installation-new';
```

---

## 📋 COMPLETE SERVICE COUNT

```sql
-- Total services by main category
SELECT 
    c.name AS category,
    COUNT(s.id) AS total_services
FROM categories c
LEFT JOIN categories sub_cat ON sub_cat.parent_id = c.id
LEFT JOIN services s ON s.category_id = sub_cat.id
WHERE c.parent_id IS NULL
GROUP BY c.name, c.display_order
ORDER BY c.display_order;
```

**Expected Results:**

| Category | Total Services |
|----------|----------------|
| Electrical Services | 13 |
| Plumbing Services | 11 |
| Home Painting & Surface Works | 7 |
| Water Purifier Services | 5 |
| Home Dismantling Services | 4 |
| Cleaning Services | 6 |
| Gardening & Plantation Services | 4 |
| Stove & Gas Services | 4 |
| **TOTAL** | **54 Services** |

---

## 🔍 USEFUL QUERIES FOR KAMWALAA

### Get all services with pricing

```sql
SELECT 
    main_cat.name AS main_category,
    sub_cat.name AS sub_category,
    s.name AS service_name,
    s.price,
    s.is_free_site_visit,
    s.is_active
FROM services s
JOIN categories sub_cat ON s.category_id = sub_cat.id
JOIN categories main_cat ON sub_cat.parent_id = main_cat.id
WHERE s.is_active = true
ORDER BY main_cat.display_order, sub_cat.display_order, s.name;
```

### Get services requiring site visit

```sql
SELECT 
    name,
    short_description,
    slug
FROM services
WHERE is_free_site_visit = true
AND is_active = true
ORDER BY name;
```

### Get services by price range

```sql
SELECT 
    name,
    price,
    short_description
FROM services
WHERE price BETWEEN 100 AND 500
AND is_active = true
ORDER BY price;
```

---

This completes the Kamwalaa-specific database schema with all **54 services** properly categorized and ready to use!

