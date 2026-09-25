-- ============================================================
-- SHERIYAKAM BACKEND SCHEMA EXPANSION
-- Tables: customers, services, technicians, bookings
-- ============================================================

-- 1. CUSTOMERS TABLE (Unique by Indian Mobile Number)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT 'Resident Customer',
    email TEXT,
    addresses JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of addresses [{label, address, taluk, district}]
    total_bookings INTEGER NOT NULL DEFAULT 1,
    is_repeat_customer BOOLEAN GENERATED ALWAYS AS (total_bookings > 1) STORED,
    notes TEXT,
    last_booking_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for instant phone number lookup
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);

-- 2. SERVICES TABLE (Dynamic Service Catalog)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY, -- e.g. 'fan-repair', 'switch-socket', 'mcb-tripping'
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Electrical',
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 249.00,
    original_price NUMERIC(10, 2),
    duration TEXT DEFAULT '30-60 mins',
    problems_covered TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for active services query
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active, display_order);

-- 3. TECHNICIANS TABLE (Roster / Staff / Partners)
CREATE TABLE IF NOT EXISTS public.technicians (
    id TEXT PRIMARY KEY DEFAULT ('tech_' || substr(md5(random()::text), 1, 8)),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'wireman', -- 'owner', 'wireman', 'supervisor'
    license_number TEXT,
    district TEXT NOT NULL DEFAULT 'Kannur',
    taluk TEXT NOT NULL DEFAULT 'Thalassery',
    skills TEXT[] DEFAULT '{"Electrical", "Fan", "Wiring", "MCB"}'::text[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_available BOOLEAN NOT NULL DEFAULT true,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    total_completed_jobs INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. BOOKINGS TABLE (Expanded with FK references & AI Triage)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY DEFAULT ('b_' || extract(epoch from now())::bigint),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_id TEXT REFERENCES public.services(id) ON DELETE SET NULL,
    service_title TEXT NOT NULL,
    category TEXT DEFAULT 'Electrical',
    district TEXT DEFAULT 'Kannur',
    taluk TEXT DEFAULT 'Thalassery',
    address TEXT NOT NULL,
    preferred_time TEXT DEFAULT 'Immediate (45-90 mins)',
    price NUMERIC(10, 2) NOT NULL DEFAULT 249.00,
    final_price NUMERIC(10, 2), -- Set after job is done
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    payment_method TEXT, -- 'Cash', 'Razorpay UPI', 'Razorpay Card'
    payment_link TEXT,
    assigned_to TEXT REFERENCES public.technicians(id) ON DELETE SET NULL,
    assigned_technician_name TEXT DEFAULT 'Zanjan (Owner / Lead)',
    status TEXT NOT NULL DEFAULT 'open', -- 'open', 'assigned', 'in_progress', 'completed', 'cancelled'
    notes TEXT, -- Technician ops notes
    problem_description TEXT, -- Free-text customer description
    ai_triage_analysis JSONB, -- Stored Claude AI suggestions & urgency
    before_photo_url TEXT,
    after_photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON public.bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);

-- Initial Seed Data for Core Services
INSERT INTO public.services (id, name, short_name, category, description, price, duration, problems_covered, is_active, display_order)
VALUES
    ('fan-repair', 'Ceiling & Exhaust Fan Repair', 'Fan Repair', 'Electrical', 'Complete inspection, capacitor fix, noise diagnosis, and regulator replacement.', 249.00, '30-45 mins', '{"Fan humming", "Fan slow speed", "Regulator burnt", "Bearing noise"}', true, 1),
    ('switch-socket', 'Modular Switch & Socket Replacement', 'Switch & Socket', 'Electrical', 'Replace burned switch points, 16A heavy power points, and flickering outlets.', 149.00, '20-40 mins', '{"Sparking switch", "Loose socket", "Burned 16A point", "AC switch replace"}', true, 2),
    ('mcb-tripping', 'MCB Distribution Box & Fuse Repair', 'MCB & DB Repair', 'Electrical', 'Diagnose tripping circuit breakers, short circuits, and phase drop issues.', 349.00, '45-90 mins', '{"Main MCB tripping", "Short circuit", "Phase neutral fault", "Burning smell at DB"}', true, 3),
    ('house-wiring', 'Complete Home Wiring & Earthing', 'House Wiring', 'Electrical', 'Full domestic wiring inspection, earth leakage protection, and rod installation.', 550.00, '2-4 hours', '{"Electric shock from tap", "Earth fault", "Full house wiring", "New point wiring"}', true, 4),
    ('inverter-wiring', 'Inverter & Battery Power Backup Wiring', 'Inverter Wiring', 'Electrical', 'Battery terminal change, inverter wiring, and changeover switch setup.', 500.00, '45-60 mins', '{"Inverter not charging", "Changeover switch fault", "Backup failure"}', true, 5),
    ('callback', 'Phone Callback & Expert Guidance', 'Phone Callback', 'Consultation', 'Direct discussion with a licensed master wireman to evaluate electrical queries.', 0.00, '15 mins', '{"General query", "Quotation estimate", "Project advice"}', true, 6)
ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, description = EXCLUDED.description;

-- Initial Seed Technician (Owner)
INSERT INTO public.technicians (id, name, phone, role, license_number, district, taluk, is_active, is_available)
VALUES
    ('tech_owner', 'Zanjan', '+91 75940 56789', 'owner', 'KSELB/WB-4102/KL', 'Kannur', 'Thalassery', true, true)
ON CONFLICT (id) DO NOTHING;
