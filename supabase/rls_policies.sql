-- ============================================================
-- SHERIYAKAM SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Enforces database-level object isolation and authorization.
-- ============================================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL PLATFORM TABLES
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. SERVICES CATALOG POLICIES
-- ============================================================

-- Public read access: Anyone (anon or authenticated) can view active services
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
ON public.services FOR SELECT
USING (is_active = true OR (auth.jwt() ->> 'role') = 'admin');

-- Admin write access: Only administrators can create, update or disable catalog items
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
CREATE POLICY "Admins can manage services"
ON public.services FOR ALL
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- 3. CUSTOMERS TABLE POLICIES
-- ============================================================

-- Public booking creation: Anonymous clients can insert customer details during booking
DROP POLICY IF EXISTS "Anyone can register customer record on booking" ON public.customers;
CREATE POLICY "Anyone can register customer record on booking"
ON public.customers FOR INSERT
WITH CHECK (true);

-- Customer access: Users can view and edit their own customer record
DROP POLICY IF EXISTS "Customers can view their own record" ON public.customers;
CREATE POLICY "Customers can view their own record"
ON public.customers FOR SELECT
USING (
    id = auth.uid() 
    OR (auth.jwt() ->> 'phone') = phone
    OR (auth.jwt() ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Customers can update their own record" ON public.customers;
CREATE POLICY "Customers can update their own record"
ON public.customers FOR UPDATE
USING (
    id = auth.uid() 
    OR (auth.jwt() ->> 'role') = 'admin'
)
WITH CHECK (
    id = auth.uid() 
    OR (auth.jwt() ->> 'role') = 'admin'
);

-- ============================================================
-- 4. TECHNICIANS (WIREMEN) ROSTER POLICIES
-- ============================================================

-- Public directory: Anyone can view active technician badges (ratings, skills, taluk)
DROP POLICY IF EXISTS "Public can view active technicians" ON public.technicians;
CREATE POLICY "Public can view active technicians"
ON public.technicians FOR SELECT
USING (is_active = true OR (auth.jwt() ->> 'role') = 'admin');

-- Admin management: Only administrators can add or suspend technicians
DROP POLICY IF EXISTS "Admins can manage technicians" ON public.technicians;
CREATE POLICY "Admins can manage technicians"
ON public.technicians FOR ALL
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- ============================================================
-- 5. BOOKINGS TABLE POLICIES (CORE DISPATCH SECURITY)
-- ============================================================

-- A. Intake: Any prospective customer can submit an electrical booking request
DROP POLICY IF EXISTS "Anyone can submit a booking request" ON public.bookings;
CREATE POLICY "Anyone can submit a booking request"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- B. Read: Customers see their own bookings; Technicians see their assigned jobs; Admins see all
DROP POLICY IF EXISTS "Users can only read authorized bookings" ON public.bookings;
CREATE POLICY "Users can only read authorized bookings"
ON public.bookings FOR SELECT
USING (
    customer_id = auth.uid()
    OR (auth.jwt() ->> 'phone') = customer_phone
    OR assigned_to = (auth.jwt() ->> 'sub')
    OR (auth.jwt() ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'role') = 'service_role'
);

-- C. Update:
-- - Assigned technicians can update status, photos, and final price
-- - Customers can cancel prior to dispatch
-- - Admins have unrestricted update access
DROP POLICY IF EXISTS "Authorized users can update bookings" ON public.bookings;
CREATE POLICY "Authorized users can update bookings"
ON public.bookings FOR UPDATE
USING (
    customer_id = auth.uid()
    OR assigned_to = (auth.jwt() ->> 'sub')
    OR (auth.jwt() ->> 'role') = 'admin'
)
WITH CHECK (
    customer_id = auth.uid()
    OR assigned_to = (auth.jwt() ->> 'sub')
    OR (auth.jwt() ->> 'role') = 'admin'
);

-- D. Delete: Only administrators can purge booking records
DROP POLICY IF EXISTS "Only admins can delete bookings" ON public.bookings;
CREATE POLICY "Only admins can delete bookings"
ON public.bookings FOR DELETE
USING ((auth.jwt() ->> 'role') = 'admin');
