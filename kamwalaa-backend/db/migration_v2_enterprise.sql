-- ============================================================
-- KAMWALAA — ENTERPRISE DATABASE MIGRATION v2.0
-- Run AFTER the initial schema (DATABASE_SCHEMA.md)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================
-- WALLET SYSTEM
-- ============================================================
CREATE TABLE IF NOT EXISTS wallets (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    balance     DECIMAL(12,2) DEFAULT 0.00 CHECK (balance >= 0),
    currency    VARCHAR(3) DEFAULT 'INR',
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id       UUID REFERENCES wallets(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    type            VARCHAR(20) CHECK (type IN ('credit','debit','refund','cashback','referral','bonus')) NOT NULL,
    amount          DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    balance_after   DECIMAL(12,2) NOT NULL,
    description     TEXT,
    reference_id    VARCHAR(100),
    reference_type  VARCHAR(50),
    status          VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending','completed','failed','reversed')),
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txns_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txns_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_txns_type ON wallet_transactions(type);
CREATE INDEX IF NOT EXISTS idx_wallet_txns_created_at ON wallet_transactions(created_at DESC);

-- ============================================================
-- SUBSCRIPTION / AMC PLANS
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    description         TEXT,
    price               DECIMAL(10,2) NOT NULL,
    billing_cycle       VARCHAR(20) CHECK (billing_cycle IN ('monthly','quarterly','annual')) NOT NULL,
    features            JSONB DEFAULT '[]',
    max_bookings_per_month INTEGER,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_popular          BOOLEAN DEFAULT false,
    is_active           BOOLEAN DEFAULT true,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id         UUID REFERENCES subscription_plans(id),
    status          VARCHAR(20) CHECK (status IN ('active','expired','cancelled','paused')) DEFAULT 'active',
    started_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMP NOT NULL,
    auto_renew      BOOLEAN DEFAULT true,
    payment_method  VARCHAR(50),
    payment_ref     VARCHAR(100),
    next_billing_date DATE,
    bookings_used   INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_subs_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subs_status ON user_subscriptions(status);

-- Seed default plans
INSERT INTO subscription_plans (name, slug, description, price, billing_cycle, features, max_bookings_per_month, discount_percentage, is_popular)
VALUES
    ('Basic', 'basic-monthly', 'Perfect for occasional home service needs', 199.00, 'monthly', '["2 services/month","5% discount","Priority support"]', 2, 5, false),
    ('Pro', 'pro-monthly', 'Most popular for regular home maintenance', 399.00, 'monthly', '["5 services/month","15% discount","Priority booking","Free AC checkup"]', 5, 15, true),
    ('Premium AMC', 'premium-annual', 'Complete annual maintenance contract', 2999.00, 'annual', '["Unlimited services","25% discount","Dedicated partner","Emergency support","Free quarterly checkup"]', NULL, 25, false)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- LOYALTY POINTS
-- ============================================================
CREATE TABLE IF NOT EXISTS loyalty_points (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    points      INTEGER NOT NULL,
    type        VARCHAR(20) CHECK (type IN ('earned','redeemed','expired','bonus','referral')) NOT NULL,
    description TEXT,
    booking_id  UUID REFERENCES bookings(id),
    expires_at  TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty balance view
CREATE OR REPLACE VIEW loyalty_balances AS
SELECT
    user_id,
    COALESCE(SUM(CASE WHEN type IN ('earned','bonus','referral') THEN points ELSE 0 END), 0) AS earned,
    COALESCE(SUM(CASE WHEN type = 'redeemed' THEN points ELSE 0 END), 0) AS redeemed,
    COALESCE(SUM(CASE WHEN type = 'expired' THEN points ELSE 0 END), 0) AS expired,
    COALESCE(
        SUM(CASE WHEN type IN ('earned','bonus','referral') THEN points ELSE -points END),
        0
    ) AS balance
FROM loyalty_points
WHERE expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP
GROUP BY user_id;

-- ============================================================
-- REFERRAL PROGRAM
-- ============================================================
CREATE TABLE IF NOT EXISTS referrals (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id     UUID REFERENCES users(id),
    referee_id      UUID REFERENCES users(id),
    referral_code   VARCHAR(20) NOT NULL,
    status          VARCHAR(20) CHECK (status IN ('pending','completed','rewarded','expired')) DEFAULT 'pending',
    reward_amount   DECIMAL(10,2),
    rewarded_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(referee_id) -- One referrer per user
);

-- Add referral code to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by   UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_points_balance INTEGER DEFAULT 0;

-- ============================================================
-- PARTNER PAYOUTS
-- ============================================================
CREATE TABLE IF NOT EXISTS partner_payouts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id      UUID REFERENCES partners(id) ON DELETE CASCADE,
    amount          DECIMAL(12,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(12,2) NOT NULL,
    gst_amount      DECIMAL(10,2) DEFAULT 0,
    tds_amount      DECIMAL(10,2) DEFAULT 0,
    net_amount      DECIMAL(12,2) NOT NULL,
    status          VARCHAR(20) CHECK (status IN ('pending','processing','completed','failed','on_hold')) DEFAULT 'pending',
    payout_method   VARCHAR(50),        -- 'bank_transfer', 'upi'
    payout_reference VARCHAR(100),
    upi_id          VARCHAR(100),
    bank_account    JSONB,              -- {account_number, ifsc, name}
    period_start    DATE,
    period_end      DATE,
    bookings_count  INTEGER DEFAULT 0,
    remarks         TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at    TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payouts_partner_id ON partner_payouts(partner_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON partner_payouts(status);

-- ============================================================
-- COMMISSION CONFIG
-- ============================================================
CREATE TABLE IF NOT EXISTS commission_configs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID REFERENCES categories(id),
    city            VARCHAR(100),
    commission_type VARCHAR(20) CHECK (commission_type IN ('percentage','fixed')) DEFAULT 'percentage',
    commission_value DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    gst_percentage  DECIMAL(5,2) DEFAULT 18.00,
    tds_percentage  DECIMAL(5,2) DEFAULT 1.00,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default commission
INSERT INTO commission_configs (commission_type, commission_value, gst_percentage)
VALUES ('percentage', 20.00, 18.00)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DYNAMIC PRICING RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_rules (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(255) NOT NULL,
    service_id  UUID REFERENCES services(id),
    rule_type   VARCHAR(50) CHECK (rule_type IN ('peak_hour','surge','seasonal','demand','festival')) NOT NULL,
    multiplier  DECIMAL(5,2) NOT NULL CHECK (multiplier >= 1.0 AND multiplier <= 5.0),
    conditions  JSONB,  -- {"day_of_week": [5,6], "start_time": "18:00", "hours": [18,19,20,21]}
    is_active   BOOLEAN DEFAULT true,
    valid_from  TIMESTAMP,
    valid_until TIMESTAMP,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SUPPORT TICKETS
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number   VARCHAR(50) UNIQUE NOT NULL,
    user_id         UUID REFERENCES users(id),
    booking_id      UUID REFERENCES bookings(id),
    category        VARCHAR(50) DEFAULT 'general',
    priority        VARCHAR(20) CHECK (priority IN ('low','medium','high','urgent')) DEFAULT 'medium',
    status          VARCHAR(20) CHECK (status IN ('open','in_progress','waiting_customer','resolved','closed')) DEFAULT 'open',
    subject         VARCHAR(500) NOT NULL,
    description     TEXT NOT NULL,
    resolution      TEXT,
    assigned_to     UUID REFERENCES users(id),
    resolved_at     TIMESTAMP,
    satisfaction    INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id   UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_id   UUID REFERENCES users(id),
    message     TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_internal BOOLEAN DEFAULT false,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- Ticket number sequence
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq;
-- Function to auto-generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number := 'TKT' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') ||
                         LPAD(nextval('ticket_number_seq')::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_ticket_number_trigger') THEN
        CREATE TRIGGER generate_ticket_number_trigger
        BEFORE INSERT ON support_tickets
        FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();
    END IF;
END $$;

-- ============================================================
-- REAL-TIME CHAT
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_rooms (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id  UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id),
    partner_id  UUID REFERENCES partners(id),
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(booking_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    room_id         UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id       UUID REFERENCES users(id),
    sender_type     VARCHAR(20) CHECK (sender_type IN ('customer','partner','admin','bot')) NOT NULL,
    message         TEXT,
    message_type    VARCHAR(20) CHECK (message_type IN ('text','image','file','location','system')) DEFAULT 'text',
    attachment_url  VARCHAR(500),
    is_read         BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_booking_id ON chat_rooms(booking_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);

-- ============================================================
-- JOB PHOTOS (Before/After)
-- ============================================================
CREATE TABLE IF NOT EXISTS job_photos (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id  UUID REFERENCES bookings(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id),
    photo_type  VARCHAR(20) CHECK (photo_type IN ('before','after','damage','progress','completion')) NOT NULL,
    photo_url   VARCHAR(500) NOT NULL,
    description TEXT,
    ai_analysis JSONB,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_photos_booking_id ON job_photos(booking_id);

-- ============================================================
-- USER SESSIONS (Device Management)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token   TEXT NOT NULL,
    device_name     VARCHAR(255),
    device_type     VARCHAR(50),    -- 'mobile', 'desktop', 'tablet'
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    is_active       BOOLEAN DEFAULT true,
    last_used_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID REFERENCES users(id),
    action      VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id   UUID,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ============================================================
-- MULTI-TENANT ORGANIZATIONS (SaaS)
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    domain              VARCHAR(255) UNIQUE,
    logo_url            VARCHAR(500),
    theme_config        JSONB DEFAULT '{}',
    subscription_tier   VARCHAR(20) CHECK (subscription_tier IN ('starter','professional','enterprise')) DEFAULT 'starter',
    max_cities          INTEGER DEFAULT 5,
    max_partners        INTEGER DEFAULT 100,
    commission_override DECIMAL(5,2),
    is_active           BOOLEAN DEFAULT true,
    owner_id            UUID REFERENCES users(id),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);

-- ============================================================
-- EXTEND PARTNERS TABLE
-- ============================================================
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    performance_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    acceptance_rate   DECIMAL(5,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    cancellation_rate DECIMAL(5,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    avg_response_time INTEGER DEFAULT 0; -- seconds
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    total_earnings    DECIMAL(12,2) DEFAULT 0;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    upi_id            VARCHAR(100);
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    bank_details      JSONB;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS 
    deleted_at        TIMESTAMP;  -- Soft delete

-- ============================================================
-- EXTEND BOOKINGS TABLE
-- ============================================================
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    coupon_code       VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    coupon_discount   DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    wallet_amount     DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    gst_amount        DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    platform_fee      DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    partner_earnings  DECIMAL(10,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    is_emergency      BOOLEAN DEFAULT false;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    accepted_at       TIMESTAMP;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    partner_notified_at TIMESTAMP;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    acceptance_deadline TIMESTAMP;  -- 60-second rule
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS 
    deleted_at        TIMESTAMP;    -- Soft delete

-- ============================================================
-- REVENUE ANALYTICS VIEW (for Admin Dashboard)
-- ============================================================
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT
    DATE_TRUNC('day', b.created_at) AS date,
    COUNT(*)                         AS total_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) AS completed_bookings,
    COUNT(CASE WHEN b.status = 'cancelled' THEN 1 END) AS cancelled_bookings,
    COUNT(CASE WHEN b.payment_status = 'paid' THEN 1 END) AS paid_bookings,
    COALESCE(SUM(CASE WHEN b.payment_status = 'paid' THEN b.total_amount ELSE 0 END), 0) AS gross_revenue,
    COALESCE(SUM(b.platform_fee), 0) AS platform_revenue,
    COALESCE(SUM(b.gst_amount), 0)   AS gst_collected,
    COUNT(DISTINCT b.user_id)        AS unique_customers,
    COUNT(DISTINCT b.partner_id)     AS active_partners,
    b.city
FROM bookings b
WHERE b.deleted_at IS NULL
GROUP BY DATE_TRUNC('day', b.created_at), b.city;

-- ============================================================
-- PARTNER PERFORMANCE VIEW
-- ============================================================
CREATE OR REPLACE VIEW partner_performance AS
SELECT
    p.id,
    u.name,
    u.phone,
    p.rating,
    p.total_bookings,
    p.total_reviews,
    p.acceptance_rate,
    p.cancellation_rate,
    p.avg_response_time,
    p.total_earnings,
    p.performance_score,
    p.availability_status,
    COUNT(b.id) AS bookings_this_month
FROM partners p
JOIN users u ON p.user_id = u.id
LEFT JOIN bookings b ON b.partner_id = p.id
    AND b.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND b.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.id, u.name, u.phone;

-- ============================================================
-- UPDATED_AT triggers for new tables
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN VALUES ('wallets'),('user_subscriptions'),('support_tickets'),('commission_configs')
    LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_trigger 
            WHERE tgname = 'update_' || t || '_updated_at'
        ) THEN
            EXECUTE format(
                'CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I
                 FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t
            );
        END IF;
    END LOOP;
END $$;

-- Done!
SELECT 'Migration v2.0 complete — Wallet, Subscriptions, Loyalty, Payouts, Chat, Audit, SaaS tables created.' AS status;
