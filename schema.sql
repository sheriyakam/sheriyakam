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

-- 6. Services Table (Dynamic Content)
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    specialty VARCHAR(255),
    time VARCHAR(50) DEFAULT '1 hr',
    price DECIMAL(10,2),
    image_key VARCHAR(100),
    is_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert Mock Data
INSERT INTO services (id, name, rating, specialty, time, price, image_key, is_emergency) VALUES
(1, 'Emergency Repair Specialist', 4.8, 'Emergency Repairs', '1 hr', 550, 'emergency.png', true),
(2, 'Fan Repair', 4.6, 'Ceiling & Exhaust Fans', '1 hr', 350, 'light_fan.png', false),
(3, 'Wiring', 4.5, 'Wiring & Installation', '1 hr', 550, 'wiring.png', false),
(4, 'DB Maintenance', 4.7, 'Distribution Boards', '1 hr', 450, 'switch.png', false),
(5, 'Inverter Service', 5.0, 'Inverter & UPS', '1 hr', 500, 'inverter.png', false),
(6, 'AC Service', 4.2, 'Air Conditioning', '1 hr', 650, 'ac.png', false),
(7, 'CCTV Setup', 4.9, 'Security Systems', '1 hr', 700, 'cctv.png', false),
(8, 'Home Automation', 4.8, 'Smart Home Setup', '1 hr', 1500, 'automation.png', false);

-- 7. Locations Table (Dynamic Cities)
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL UNIQUE
);

-- Insert Mock Data
INSERT INTO locations (city_name) VALUES
('Thalassery, Kerala'),
('Mahe, Puducherry'),
('Calicut, Kerala'),
('Kochi, Kerala'),
('Kannur, Kerala');
