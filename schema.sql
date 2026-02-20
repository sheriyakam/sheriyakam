-- ==========================================
-- Scalable Database Schema for Sheriyakam Map MVP
-- Designed for Supabase / PostgreSQL
-- ==========================================

-- 1. Users Table (Customers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    lat DECIMAL(9,6),
    long DECIMAL(9,6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Partners Table (Technicians)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- If partners also need app login
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    license_no VARCHAR(100) UNIQUE,
    certificate_expiry DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified', 'suspended'
    current_lat DECIMAL(9,6),
    current_long DECIMAL(9,6),
    is_available BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partner Skills (To handle "Fan Repair", "Wiring", etc.)
CREATE TABLE partner_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
    service_name VARCHAR(100) NOT NULL
);

-- 3. Bookings Table (Jobs)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partners(id),
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'accepted', 'in_progress', 'completed', 'cancelled'
    start_otp VARCHAR(6),
    end_otp VARCHAR(6),
    total_price DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    is_experimental BOOLEAN DEFAULT false, -- Beta/Trial Mode Toggle Support
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. Reviews Table (Service Recovery Logic)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partners(id),
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    issue_type VARCHAR(50), -- 'technical' or 'behavioral' (For 1 or 2 star ratings)
    wants_revisit BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Admin Settings (For Beta/Trial Mode)
CREATE TABLE admin_settings (
    id INT PRIMARY KEY DEFAULT 1,
    beta_mode_active BOOLEAN DEFAULT false,
    commission_rate DECIMAL(5,2) DEFAULT 10.00 -- 10% default
);

-- ==========================================
-- Triggers and Logic Hooks examples:
--
-- 1. Service Recovery Workflow:
-- If a review is inserted with rating <= 2 and issue_type = 'technical',
-- create a 'Red Flag' ticket or immediately change partner status to 'suspended' for review.
-- 
-- 2. Partner Performance Algorithm:
-- Sorting partners on customer view by: 
-- ORDER BY (calculate_distance(lat, long)) ASC, rating DESC
-- ==========================================
