# 🗄️ DATABASE SCHEMA & SAMPLE DATA

## Complete Database Structure for Urban Seva Clone

---

## 📊 DATABASE SCHEMA

### PostgreSQL Setup

```sql
-- Create database
CREATE DATABASE urbanseva_db;

-- Connect to database
\c urbanseva_db;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------
-- 1. USERS TABLE
-----------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(15) UNIQUE NOT NULL,
    city VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('customer', 'partner', 'admin')) DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-----------------------------------------------------------
-- 2. OTP TABLE (For authentication)
-----------------------------------------------------------
CREATE TABLE otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otps_phone ON otps(phone);

-----------------------------------------------------------
-- 3. CITIES TABLE
-----------------------------------------------------------
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cities_is_active ON cities(is_active);

-----------------------------------------------------------
-- 4. CATEGORIES TABLE
-----------------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-----------------------------------------------------------
-- 5. SERVICES TABLE
-----------------------------------------------------------
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    price DECIMAL(10, 2),
    image_url VARCHAR(500),
    is_free_site_visit BOOLEAN DEFAULT false,
    city VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_is_active ON services(is_active);

-----------------------------------------------------------
-- 6. PARTNERS TABLE
-----------------------------------------------------------
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    category_id UUID REFERENCES categories(id),
    experience_years INTEGER,
    service_areas TEXT[], -- Array of cities/areas they serve
    documents JSONB, -- {id_proof: "url", address_proof: "url", certificates: ["url1", "url2"]}
    is_verified BOOLEAN DEFAULT false,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'busy', 'offline')) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_category_id ON partners(category_id);
CREATE INDEX idx_partners_is_verified ON partners(is_verified);
CREATE INDEX idx_partners_rating ON partners(rating);

-----------------------------------------------------------
-- 7. BOOKINGS TABLE
-----------------------------------------------------------
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL, -- e.g., BK20240121001
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES partners(id) ON DELETE SET NULL,
    
    -- Service details
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    
    -- Address
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    
    -- Additional info
    special_instructions TEXT,
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    cancellation_reason TEXT,
    
    -- Payment
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(100), -- Razorpay payment ID
    
    -- Pricing
    service_price DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) DEFAULT 0.00,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Timestamps
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_partner_id ON bookings(partner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);

-----------------------------------------------------------
-- 8. REVIEWS TABLE
-----------------------------------------------------------
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    
    -- Partner can reply to review
    partner_reply TEXT,
    partner_reply_at TIMESTAMP,
    
    is_verified BOOLEAN DEFAULT false, -- Only verified if booking was completed
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one review per booking
    UNIQUE(booking_id)
);

CREATE INDEX idx_reviews_partner_id ON reviews(partner_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-----------------------------------------------------------
-- 9. CART TABLE
-----------------------------------------------------------
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- One service per user in cart
    UNIQUE(user_id, service_id)
);

CREATE INDEX idx_cart_user_id ON cart(user_id);

-----------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-----------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'booking', 'payment', 'reminder', etc.
    is_read BOOLEAN DEFAULT false,
    metadata JSONB, -- Additional data like booking_id, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-----------------------------------------------------------
-- 11. PARTNER AVAILABILITY TABLE
-----------------------------------------------------------
CREATE TABLE partner_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(partner_id, day_of_week, start_time)
);

CREATE INDEX idx_partner_availability_partner_id ON partner_availability(partner_id);

-----------------------------------------------------------
-- 12. PROMO CODES TABLE
-----------------------------------------------------------
CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_value DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);

-----------------------------------------------------------
-- 13. USER ADDRESSES TABLE
-----------------------------------------------------------
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('home', 'work', 'other')) DEFAULT 'home',
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    pincode VARCHAR(10) NOT NULL,
    landmark VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);

-----------------------------------------------------------
-- TRIGGERS FOR UPDATED_AT
-----------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-----------------------------------------------------------
-- FUNCTIONS
-----------------------------------------------------------

-- Function to update partner rating
CREATE OR REPLACE FUNCTION update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE partners
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE partner_id = NEW.partner_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE partner_id = NEW.partner_id
        )
    WHERE id = NEW.partner_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_partner_rating();

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number := 'BK' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || 
                          LPAD(nextval('booking_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE booking_number_seq;

CREATE TRIGGER generate_booking_number_trigger
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION generate_booking_number();
```

---

## 📝 SAMPLE DATA

### Insert Cities

```sql
INSERT INTO cities (name, state, is_active, display_order) VALUES
('Ranchi', 'Jharkhand', true, 1),
('Bokaro', 'Jharkhand', true, 2),
('Godda', 'Jharkhand', true, 3),
('Koderma', 'Jharkhand', true, 4),
('Greater Noida', 'Uttar Pradesh', true, 5),
('Ghaziabad', 'Uttar Pradesh', true, 6),
('Delhi', 'Delhi', true, 7),
('Mumbai', 'Maharashtra', true, 8),
('Bangalore', 'Karnataka', true, 9),
('Hyderabad', 'Telangana', true, 10),
('Chennai', 'Tamil Nadu', true, 11),
('Kolkata', 'West Bengal', true, 12),
('Pune', 'Maharashtra', true, 13),
('Ahmedabad', 'Gujarat', true, 14),
('Jaipur', 'Rajasthan', true, 15);
```

### Insert Categories

```sql
-- Main Categories
INSERT INTO categories (name, slug, description, icon_url, display_order) VALUES
('Appliances Repair', 'appliances-repair', 'Repair and servicing for home appliances', '/icons/appliances.svg', 1),
('Home Repair', 'home-repair', 'Home repair and maintenance services', '/icons/home-repair.svg', 2),
('Gadgets Repair', 'gadgets-repair', 'Mobile and laptop repair services', '/icons/gadgets.svg', 3),
('Painting Services', 'painting-services', 'Professional painting services', '/icons/painting.svg', 4),
('IT Services', 'it-services', 'App, website and digital marketing services', '/icons/it.svg', 5),
('Photographer', 'photographer', 'Photography and videography services', '/icons/camera.svg', 6),
('Beauty Services', 'beauty-services', 'Salon and spa services', '/icons/beauty.svg', 7),
('Haircut & Grooming', 'haircut-grooming', 'Men''s salon and grooming', '/icons/grooming.svg', 8),
('Carpenter', 'carpenter', 'Carpentry and interior design', '/icons/carpenter.svg', 9);

-- Sub-categories for Appliances Repair
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'AC Service and Repair', 'ac-service-repair', 'Air conditioner service and repair', id, 1
FROM categories WHERE slug = 'appliances-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'RO Repair and Service', 'ro-repair-service', 'Water purifier repair and service', id, 2
FROM categories WHERE slug = 'appliances-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Refrigerator Repair', 'refrigerator-repair', 'Fridge repair and maintenance', id, 3
FROM categories WHERE slug = 'appliances-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Microwave Oven Repair', 'microwave-oven-repair', 'Microwave repair service', id, 4
FROM categories WHERE slug = 'appliances-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Washing Machine Repair', 'washing-machine-repair', 'Washing machine service', id, 5
FROM categories WHERE slug = 'appliances-repair';

-- Sub-categories for Home Repair
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Electrician', 'electrician', 'Electrical work and repairs', id, 1
FROM categories WHERE slug = 'home-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Plumber', 'plumber', 'Plumbing services', id, 2
FROM categories WHERE slug = 'home-repair';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Pest Control', 'pest-control', 'Pest control and fumigation', id, 3
FROM categories WHERE slug = 'home-repair';

-- Sub-categories for Photographer
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Wedding Photography', 'wedding-photography', 'Professional wedding photography', id, 1
FROM categories WHERE slug = 'photographer';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Pre-Wedding Photography', 'pre-wedding-photography', 'Pre-wedding photoshoot', id, 2
FROM categories WHERE slug = 'photographer';

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Drone Services', 'drone-services', 'Aerial photography and videography', id, 3
FROM categories WHERE slug = 'photographer';
```

### Insert Services

```sql
-- AC Services
INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'AC Service and Repair',
    'ac-service-repair-ranchi',
    'Professional AC service and repair at your doorstep',
    'Get professional AC service, repair, gas filling, and maintenance. Our expert technicians will diagnose and fix all AC-related issues.',
    299.00,
    '/images/services/ac-repair.jpg',
    true,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'ac-service-repair';

INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'RO Repair and Service',
    'ro-repair-service-ranchi',
    'Water purifier repair and maintenance',
    'Complete RO water purifier service including filter replacement, membrane cleaning, and leak fixing.',
    199.00,
    '/images/services/ro-repair.jpg',
    true,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'ro-repair-service';

INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Refrigerator Repair',
    'refrigerator-repair-ranchi',
    'Fridge repair and maintenance service',
    'Expert refrigerator repair services for all brands. We fix cooling issues, compressor problems, and more.',
    350.00,
    '/images/services/fridge-repair.jpg',
    true,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'refrigerator-repair';

-- Home Repair Services
INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Electrician Services',
    'electrician-services-ranchi',
    'Professional electrician for all electrical work',
    'Licensed electrician for wiring, switch/socket installation, fan installation, and all electrical repairs.',
    150.00,
    '/images/services/electrician.jpg',
    false,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'electrician';

INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Plumbing Services',
    'plumbing-services-ranchi',
    'Expert plumber for all plumbing needs',
    'Professional plumbing services for tap repairs, pipeline fixing, bathroom fitting, and more.',
    180.00,
    '/images/services/plumber.jpg',
    false,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'plumber';

-- Photography Services
INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Wedding Photography Package',
    'wedding-photography-ranchi',
    'Complete wedding photography and videography',
    'Professional wedding photography package with candid photos, cinematic video, and edited albums.',
    25000.00,
    '/images/services/wedding-photo.jpg',
    false,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'wedding-photography';

INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Pre-Wedding Photoshoot',
    'pre-wedding-photoshoot-ranchi',
    'Pre-wedding photoshoot at outdoor locations',
    'Beautiful pre-wedding photoshoot with professional photographer and multiple outfit changes.',
    8000.00,
    '/images/services/pre-wedding.jpg',
    false,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'pre-wedding-photography';

INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Drone Photography',
    'drone-photography-ranchi',
    'Aerial photography and videography with drone',
    'Professional drone photography for events, real estate, and special occasions.',
    5000.00,
    '/images/services/drone.jpg',
    false,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'drone-services';
```

### Insert Sample Users

```sql
INSERT INTO users (name, email, phone, city, role, is_verified) VALUES
('Rahul Kumar', 'rahul.kumar@email.com', '9876543210', 'Ranchi', 'customer', true),
('Priya Sharma', 'priya.sharma@email.com', '9876543211', 'Ranchi', 'customer', true),
('Amit Singh', 'amit.singh@email.com', '9876543212', 'Delhi', 'customer', true),
('Rajesh Verma', 'rajesh.verma@email.com', '9876543213', 'Ranchi', 'partner', true),
('Sanjay Electricals', 'sanjay@email.com', '9876543214', 'Ranchi', 'partner', true),
('Vikram Plumbers', 'vikram@email.com', '9876543215', 'Ranchi', 'partner', true),
('Admin User', 'admin@urbanseva.com', '9876543216', 'Mumbai', 'admin', true);
```

### Insert Sample Partners

```sql
INSERT INTO partners (user_id, business_name, category_id, experience_years, service_areas, is_verified, rating, total_reviews)
SELECT 
    u.id,
    'Cool Air AC Services',
    c.id,
    8,
    ARRAY['Ranchi', 'Bokaro', 'Koderma'],
    true,
    4.7,
    156
FROM users u, categories c
WHERE u.phone = '9876543213' AND c.slug = 'ac-service-repair';

INSERT INTO partners (user_id, business_name, category_id, experience_years, service_areas, is_verified, rating, total_reviews)
SELECT 
    u.id,
    'Sanjay Electricals',
    c.id,
    12,
    ARRAY['Ranchi', 'Bokaro'],
    true,
    4.5,
    89
FROM users u, categories c
WHERE u.phone = '9876543214' AND c.slug = 'electrician';

INSERT INTO partners (user_id, business_name, category_id, experience_years, service_areas, is_verified, rating, total_reviews)
SELECT 
    u.id,
    'Vikram Plumbing Solutions',
    c.id,
    10,
    ARRAY['Ranchi'],
    true,
    4.8,
    132
FROM users u, categories c
WHERE u.phone = '9876543215' AND c.slug = 'plumber';
```

### Insert Sample Bookings

```sql
INSERT INTO bookings (
    user_id, 
    service_id, 
    partner_id, 
    booking_date, 
    booking_time,
    address_line1,
    city,
    state,
    pincode,
    status,
    payment_status,
    service_price,
    total_amount
)
SELECT 
    u.id,
    s.id,
    p.id,
    '2026-01-25',
    '14:00:00',
    '123 Main Road, Doranda',
    'Ranchi',
    'Jharkhand',
    '834002',
    'confirmed',
    'paid',
    299.00,
    299.00
FROM users u, services s, partners p
WHERE u.phone = '9876543210' 
  AND s.slug = 'ac-service-repair-ranchi'
  AND p.business_name = 'Cool Air AC Services';

INSERT INTO bookings (
    user_id, 
    service_id, 
    partner_id, 
    booking_date, 
    booking_time,
    address_line1,
    city,
    state,
    pincode,
    status,
    payment_status,
    service_price,
    total_amount
)
SELECT 
    u.id,
    s.id,
    p.id,
    '2026-01-26',
    '10:00:00',
    '456 College Road',
    'Ranchi',
    'Jharkhand',
    '834001',
    'pending',
    'pending',
    150.00,
    150.00
FROM users u, services s, partners p
WHERE u.phone = '9876543211' 
  AND s.slug = 'electrician-services-ranchi'
  AND p.business_name = 'Sanjay Electricals';
```

### Insert Sample Reviews

```sql
INSERT INTO reviews (booking_id, user_id, partner_id, service_id, rating, comment, is_verified)
SELECT 
    b.id,
    b.user_id,
    b.partner_id,
    b.service_id,
    5,
    'Excellent service! The technician was very professional and fixed my AC quickly.',
    true
FROM bookings b
WHERE b.status = 'confirmed'
LIMIT 1;

INSERT INTO reviews (booking_id, user_id, partner_id, service_id, rating, comment, is_verified)
SELECT 
    b.id,
    b.user_id,
    b.partner_id,
    b.service_id,
    4,
    'Good service, arrived on time. Reasonable pricing.',
    true
FROM bookings b
WHERE b.status = 'confirmed'
LIMIT 1 OFFSET 1;
```

### Insert Promo Codes

```sql
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit, is_active)
VALUES
('FIRST50', 'Get 50% off on your first booking', 'percentage', 50.00, 200.00, 200.00, '2026-01-01', '2026-12-31', 1000, true),
('SAVE100', 'Flat ₹100 off on orders above ₹500', 'fixed', 100.00, 500.00, 100.00, '2026-01-01', '2026-06-30', 5000, true),
('WELCOME20', 'Get 20% off on all services', 'percentage', 20.00, 100.00, 150.00, '2026-01-01', '2026-12-31', 10000, true);
```

---

## 🔍 USEFUL SQL QUERIES

### Get all services with category name

```sql
SELECT 
    s.id,
    s.name AS service_name,
    s.slug,
    s.price,
    s.city,
    c.name AS category_name,
    s.is_free_site_visit,
    s.is_active
FROM services s
JOIN categories c ON s.category_id = c.id
WHERE s.is_active = true
ORDER BY c.display_order, s.name;
```

### Get services by city

```sql
SELECT 
    s.*,
    c.name AS category_name
FROM services s
JOIN categories c ON s.category_id = c.id
WHERE s.city = 'Ranchi' AND s.is_active = true
ORDER BY c.display_order;
```

### Get top-rated partners

```sql
SELECT 
    p.id,
    p.business_name,
    u.name AS owner_name,
    u.phone,
    c.name AS category,
    p.rating,
    p.total_reviews,
    p.total_bookings
FROM partners p
JOIN users u ON p.user_id = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.is_verified = true
ORDER BY p.rating DESC, p.total_reviews DESC
LIMIT 10;
```

### Get user bookings with details

```sql
SELECT 
    b.id,
    b.booking_number,
    b.booking_date,
    b.booking_time,
    s.name AS service_name,
    p.business_name AS partner_name,
    b.status,
    b.payment_status,
    b.total_amount,
    b.address_line1,
    b.city
FROM bookings b
JOIN services s ON b.service_id = s.id
LEFT JOIN partners p ON b.partner_id = p.id
WHERE b.user_id = 'USER_ID_HERE'
ORDER BY b.created_at DESC;
```

### Get partner bookings

```sql
SELECT 
    b.id,
    b.booking_number,
    b.booking_date,
    b.booking_time,
    u.name AS customer_name,
    u.phone AS customer_phone,
    s.name AS service_name,
    b.status,
    b.total_amount,
    b.address_line1,
    b.city
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN services s ON b.service_id = s.id
WHERE b.partner_id = 'PARTNER_ID_HERE'
ORDER BY b.booking_date DESC, b.booking_time DESC;
```

### Get service reviews with user details

```sql
SELECT 
    r.id,
    r.rating,
    r.comment,
    r.created_at,
    u.name AS customer_name,
    p.business_name AS partner_name,
    r.partner_reply
FROM reviews r
JOIN users u ON r.user_id = u.id
LEFT JOIN partners p ON r.partner_id = p.id
WHERE r.service_id = 'SERVICE_ID_HERE' AND r.is_verified = true
ORDER BY r.created_at DESC;
```

### Get dashboard statistics

```sql
-- Total counts
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'customer') AS total_customers,
    (SELECT COUNT(*) FROM partners WHERE is_verified = true) AS total_partners,
    (SELECT COUNT(*) FROM bookings WHERE status = 'completed') AS total_bookings,
    (SELECT AVG(rating) FROM partners WHERE is_verified = true) AS average_rating;
```

### Calculate revenue

```sql
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_bookings,
    SUM(total_amount) AS total_revenue,
    AVG(total_amount) AS average_booking_value
FROM bookings
WHERE payment_status = 'paid'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;
```

### Get trending services (most booked)

```sql
SELECT 
    s.id,
    s.name,
    c.name AS category,
    COUNT(b.id) AS booking_count,
    AVG(b.total_amount) AS average_price
FROM services s
JOIN categories c ON s.category_id = c.id
LEFT JOIN bookings b ON s.id = b.service_id
GROUP BY s.id, s.name, c.name
ORDER BY booking_count DESC
LIMIT 10;
```

---

## 🔐 INDEXES FOR PERFORMANCE

```sql
-- Additional composite indexes for common queries

-- Services by city and category
CREATE INDEX idx_services_city_category ON services(city, category_id) WHERE is_active = true;

-- Bookings by date and status
CREATE INDEX idx_bookings_date_status ON bookings(booking_date, status);

-- Partner bookings for dashboard
CREATE INDEX idx_partner_bookings_status ON bookings(partner_id, status, booking_date);

-- User bookings for order history
CREATE INDEX idx_user_bookings_created ON bookings(user_id, created_at DESC);

-- Reviews for service page
CREATE INDEX idx_reviews_service_verified ON reviews(service_id, is_verified, created_at DESC);
```

---

## 🔄 DATABASE BACKUP

```sql
-- Backup command (run from terminal)
pg_dump -U postgres -d urbanseva_db > backup_$(date +%Y%m%d).sql

-- Restore command
psql -U postgres -d urbanseva_db < backup_20260121.sql
```

---

This complete database schema provides a solid foundation for your service marketplace platform. It includes all necessary tables, relationships, sample data, and useful queries to get you started!

