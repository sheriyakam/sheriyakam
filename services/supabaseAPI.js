/**
 * Supabase API Service Layer
 * Centralized data access — all CRUD operations go through here.
 * Falls back to local storage when Supabase is not available.
 */

import { supabase, isSupabaseConfigured } from '../config/supabaseConfig';

// ============================================================
//  USERS API
// ============================================================

export const UsersAPI = {
    /** Create a new user */
    async create(userData) {
        if (!isSupabaseConfigured) return { data: userData, error: null };
        const { data, error } = await supabase
            .from('users')
            .insert([{
                name: userData.name,
                email: userData.email?.toLowerCase().trim(),
                mobile: userData.mobile,
                password: userData.password, // TODO: hash with Supabase Auth
                role: userData.role || 'user',
            }])
            .select()
            .single();
        return { data, error };
    },

    /** Find user by email */
    async findByEmail(email) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();
        return { data, error };
    },

    /** Find user by email or mobile */
    async findByIdentifier(identifier) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .or(`email.eq.${identifier.toLowerCase().trim()},mobile.eq.${identifier}`)
            .single();
        return { data, error };
    },

    /** Get all users (admin only) */
    async getAll() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email, mobile, role, created_at')
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },
};

// ============================================================
//  SERVICES API
// ============================================================

export const ServicesAPI = {
    /** Get all available services */
    async getAll() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('id', { ascending: true });
        return { data: data || [], error };
    },
};

// ============================================================
//  LOCATIONS API
// ============================================================

export const LocationsAPI = {
    /** Get available cities/locations */
    async getCities() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('locations')
            .select('city_name')
            .order('city_name', { ascending: true });
        return { data: data ? data.map(d => d.city_name) : [], error };
    },
};

// ============================================================
//  PARTNERS API
// ============================================================

export const PartnersAPI = {
    /** Register a new partner */
    async create(partnerData) {
        if (!isSupabaseConfigured) return { data: partnerData, error: null };
        const { data, error } = await supabase
            .from('partners')
            .insert([{
                name: partnerData.name,
                email: partnerData.email?.toLowerCase().trim(),
                phone: partnerData.phone,
                password: partnerData.password,
                service_types: partnerData.serviceTypes || [],
                taluk: partnerData.taluk,
                status: 'pending',
                is_available: true,
                performance_score: 0,
                location: partnerData.location || null,
            }])
            .select()
            .single();
        return { data, error };
    },

    /** Find partner by phone */
    async findByPhone(phone) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .eq('phone', phone)
            .single();
        return { data, error };
    },

    /** Find partner by email */
    async findByEmail(email) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .eq('email', email.toLowerCase().trim())
            .single();
        return { data, error };
    },

    /** Get all partners (admin) */
    async getAll() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },

    /** Update partner status (approve/reject) */
    async updateStatus(id, status) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('partners')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    /** Toggle availability */
    async toggleAvailability(id, isAvailable) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('partners')
            .update({ is_available: isAvailable })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },
};

// ============================================================
//  BOOKINGS API
// ============================================================

export const BookingsAPI = {
    /** Create a new booking */
    async create(bookingData) {
        if (!isSupabaseConfigured) return { data: bookingData, error: null };
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                customer_name: bookingData.customerName,
                customer_phone: bookingData.customerPhone,
                customer_email: bookingData.customerEmail,
                service: bookingData.service,
                service_type: bookingData.serviceType,
                address: bookingData.address,
                date: bookingData.date,
                time: bookingData.time,
                price: bookingData.price || 0,
                status: 'open',
                otp: bookingData.otp,
                checkin_otp: bookingData.checkinOtp,
                notes: bookingData.notes,
                image_url: bookingData.imageUrl,
            }])
            .select()
            .single();
        return { data, error };
    },

    /** Get all bookings */
    async getAll() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },

    /** Get bookings by customer email */
    async getByCustomer(email) {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('customer_email', email.toLowerCase().trim())
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },

    /** Get open bookings (for partners) */
    async getOpen() {
        if (!isSupabaseConfigured) return { data: [], error: null };
        const { data, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false });
        return { data: data || [], error };
    },

    /** Update booking status */
    async updateStatus(id, status, extraData = {}) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('bookings')
            .update({ status, ...extraData })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    /** Complete a booking */
    async complete(id, finalPrice, materialCost, hoursWorked) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('bookings')
            .update({
                status: 'completed',
                final_price: finalPrice,
                material_cost: materialCost,
                hours_worked: hoursWorked,
                payment_status: 'pending',
            })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    /** Mark payment */
    async markPaid(id, method) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('bookings')
            .update({
                payment_status: 'paid',
                payment_method: method,
            })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    /** Cancel booking */
    async cancel(id) {
        if (!isSupabaseConfigured) return { data: null, error: null };
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();
        return { data, error };
    },

    /** Get booking stats (admin dashboard) */
    async getStats() {
        if (!isSupabaseConfigured) return { data: { total: 0, open: 0, completed: 0, revenue: 0 }, error: null };
        const { data: all, error } = await supabase
            .from('bookings')
            .select('status, final_price, payment_status');

        if (error) return { data: null, error };

        const stats = {
            total: all.length,
            open: all.filter(b => b.status === 'open').length,
            active: all.filter(b => ['accepted', 'in_progress'].includes(b.status)).length,
            completed: all.filter(b => b.status === 'completed').length,
            cancelled: all.filter(b => b.status === 'cancelled').length,
            revenue: all.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + (b.final_price || 0), 0),
        };
        return { data: stats, error: null };
    },
};
