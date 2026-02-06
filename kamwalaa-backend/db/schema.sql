-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------
-- 1. USERS TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    login_pin VARCHAR(255),
    city VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('customer', 'partner', 'admin')) DEFAULT 'customer',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-----------------------------------------------------------
-- 2. OTP TABLE (For authentication)
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS otps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(15) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otps_phone ON otps(phone);

-----------------------------------------------------------
-- 3. CITIES TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    state VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cities_is_active ON cities(is_active);

-----------------------------------------------------------
-- 4. CATEGORIES TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
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

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-----------------------------------------------------------
-- 5. SERVICES TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
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

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_city ON services(city);
CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);

-----------------------------------------------------------
-- 6. PARTNERS TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS partners (
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

CREATE INDEX IF NOT EXISTS idx_partners_user_id ON partners(user_id);
CREATE INDEX IF NOT EXISTS idx_partners_category_id ON partners(category_id);
CREATE INDEX IF NOT EXISTS idx_partners_is_verified ON partners(is_verified);
CREATE INDEX IF NOT EXISTS idx_partners_rating ON partners(rating);

-----------------------------------------------------------
-- 7. BOOKINGS TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS bookings (
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

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_partner_id ON bookings(partner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);

-----------------------------------------------------------
-- 8. REVIEWS TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
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

CREATE INDEX IF NOT EXISTS idx_reviews_partner_id ON reviews(partner_id);
CREATE INDEX IF NOT EXISTS idx_reviews_service_id ON reviews(service_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-----------------------------------------------------------
-- 9. CART TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- One service per user in cart
    UNIQUE(user_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id);

-----------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'booking', 'payment', 'reminder', etc.
    is_read BOOLEAN DEFAULT false,
    metadata JSONB, -- Additional data like booking_id, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-----------------------------------------------------------
-- 11. PARTNER AVAILABILITY TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS partner_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(partner_id, day_of_week, start_time)
);

CREATE INDEX IF NOT EXISTS idx_partner_availability_partner_id ON partner_availability(partner_id);

-----------------------------------------------------------
-- 12. PROMO CODES TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_codes (
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

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);

-----------------------------------------------------------
-- 13. USER ADDRESSES TABLE
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_addresses (
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

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);

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

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partners_updated_at ON partners;
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
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

DROP TRIGGER IF EXISTS update_partner_rating_trigger ON reviews;
CREATE TRIGGER update_partner_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_partner_rating();

-- Function to generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.booking_number := 'KM-' || TO_CHAR(CURRENT_DATE, 'YYYY') || 
                          LPAD(nextval('booking_number_seq')::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS booking_number_seq;

DROP TRIGGER IF EXISTS generate_booking_number_trigger ON bookings;
CREATE TRIGGER generate_booking_number_trigger
BEFORE INSERT ON bookings
FOR EACH ROW EXECUTE FUNCTION generate_booking_number();

-------------------------------------------------------------------------
-- SAMPLE DATA
-------------------------------------------------------------------------

-- 1. Insert Cities
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
('Jaipur', 'Rajasthan', true, 15)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Categories
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
('Carpenter', 'carpenter', 'Carpentry and interior design', '/icons/carpenter.svg', 9)
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories for Appliances Repair
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'AC Service and Repair', 'ac-service-repair', 'Air conditioner service and repair', id, 1
FROM categories WHERE slug = 'appliances-repair'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'RO Repair and Service', 'ro-repair-service', 'Water purifier repair and service', id, 2
FROM categories WHERE slug = 'appliances-repair'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Refrigerator Repair', 'refrigerator-repair', 'Fridge repair and maintenance', id, 3
FROM categories WHERE slug = 'appliances-repair'
ON CONFLICT (slug) DO NOTHING;

-- Sub-categories for Home Repair
INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Electrician', 'electrician', 'Electrical work and repairs', id, 1
FROM categories WHERE slug = 'home-repair'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, display_order)
SELECT 'Plumber', 'plumber', 'Plumbing services', id, 2
FROM categories WHERE slug = 'home-repair'
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Services
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
WHERE c.slug = 'ac-service-repair' AND NOT EXISTS (SELECT 1 FROM services WHERE slug = 'ac-service-repair-ranchi');

-- Refrigerator
INSERT INTO services (category_id, name, slug, short_description, description, price, image_url, is_free_site_visit, city, is_active)
SELECT 
    c.id,
    'Refrigerator Repair',
    'refrigerator-repair-ranchi',
    'Fridge repair and maintenance service',
    'Expert refrigerator repair services for all brands.',
    350.00,
    '/images/services/fridge-repair.jpg',
    true,
    'Ranchi',
    true
FROM categories c
WHERE c.slug = 'refrigerator-repair' AND NOT EXISTS (SELECT 1 FROM services WHERE slug = 'refrigerator-repair-ranchi');

-- Users
INSERT INTO users (name, email, phone, city, role, is_verified) VALUES
('Admin User', 'admin@kamwalaa.com', '9876543216', 'Mumbai', 'admin', true),
('Rahul Customer', 'rahul@kamwalaa.com', '9876543210', 'Ranchi', 'customer', true)
ON CONFLICT (phone) DO NOTHING;

