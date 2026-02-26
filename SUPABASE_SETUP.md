# 🚀 Supabase Setup Guide for Sheriyakam

## Step 1: Create a Supabase Project

1. Go to **[https://supabase.com](https://supabase.com)**
2. Click **"Start your project"** → Sign up with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Name**: `sheriyakam`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: `South Asia (Mumbai)` ← closest to Kerala
5. Click **"Create new project"** and wait ~2 minutes

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings → API**
2. Copy these two values:
   - **Project URL** → e.g., `https://abcdefghij.supabase.co`
   - **anon/public key** → starts with `eyJhbGciOiJIUzI1NiIs...`

## Step 3: Add Keys to Your App

Open `config/supabaseConfig.js` and replace:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT-ID.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIs...YOUR_KEY_HERE';
```

## Step 4: Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run this SQL:

```sql
-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  mobile TEXT,
  password TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin user
INSERT INTO users (name, email, mobile, password, role)
VALUES ('Admin', 'sheriyakam.info@gmail.com', '+919000000000', 'admin123', 'admin');

-- ========================================
-- PARTNERS TABLE
-- ========================================
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT NOT NULL,
  password TEXT NOT NULL,
  service_types TEXT[] DEFAULT '{}',
  taluk TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_available BOOLEAN DEFAULT TRUE,
  performance_score INTEGER DEFAULT 0,
  location JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- BOOKINGS TABLE
-- ========================================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  service TEXT NOT NULL,
  service_type TEXT,
  address TEXT,
  date TEXT,
  time TEXT,
  price NUMERIC DEFAULT 0,
  final_price NUMERIC DEFAULT 0,
  material_cost NUMERIC DEFAULT 0,
  hours_worked NUMERIC DEFAULT 1,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'in_progress', 'completed', 'cancelled')),
  partner_name TEXT,
  otp TEXT,
  checkin_otp TEXT,
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write for now (you can tighten this later)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all partners" ON partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
```

## Step 5: Verify Connection

After adding your keys, restart the app:
```bash
npx expo start --web
```

The app will automatically detect the Supabase configuration and use it for data storage.

## 🎯 What Gets Stored in Supabase

| Table | Purpose |
|-------|---------|
| `users` | Customer accounts, admin login |
| `partners` | Partner registrations, approvals |
| `bookings` | All service bookings, payments |

## 💡 Free Tier Limits

Supabase free tier includes:
- **500 MB** database storage
- **2 GB** bandwidth
- **50,000** monthly active users
- **Unlimited** API requests

This is more than enough for Sheriyakam!
