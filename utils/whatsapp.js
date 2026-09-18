/**
 * SHERIYAKAM — WhatsApp Communication & Dispatch Engine
 * Standardized zero-cost instant notification templates for Kerala home services.
 */

import { Platform, Linking } from 'react-native';

const SHERIYAKAM_HELPLINE_WA = '914952800000';

/**
 * Generate formatted WhatsApp link with auto-encoded message
 * @param {string} phone - Target WhatsApp number (default helpline)
 * @param {string} message - Text payload
 * @returns {string}
 */
export const createWhatsAppUrl = (message, phone = SHERIYAKAM_HELPLINE_WA) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Open WhatsApp directly across Web, iOS & Android
 * @param {string} message
 * @param {string} phone
 */
export const openWhatsApp = (message, phone = SHERIYAKAM_HELPLINE_WA) => {
    const url = createWhatsAppUrl(message, phone);
    if (Platform.OS === 'web') {
        window.open(url, '_blank');
    } else {
        Linking.openURL(url);
    }
};

/**
 * 1. Customer Booking Dispatch Template
 */
export const sendCustomerBookingWhatsApp = (booking) => {
    const msg = `⚡ *SHERIYAKAM BOOKING CONFIRMATION*\n\n` +
        `*Booking ID:* ${booking.id || 'Pending'}\n` +
        `*Service:* ${booking.serviceTitle || booking.serviceName || 'Electrical Service'}\n` +
        `*Schedule:* ${booking.date || 'Today'} • ${booking.timeSlot || 'Standard Slot'}\n` +
        `*Location:* ${booking.address || booking.district || 'Kerala'}\n` +
        `*Total Payable:* ₹${booking.price || booking.finalPrice || 350}\n\n` +
        `🔒 *Check-in OTP:* ${booking.checkInOtp || '1234'}\n` +
        `_(Share this OTP with your electrician upon arrival to begin work)_\n\n` +
        `Track live on Sheriyakam: https://sheriyakam.vercel.app/dashboard`;

    openWhatsApp(msg);
};

/**
 * 2. Emergency 90-Min Triage Dispatch Template
 */
export const sendEmergencySOSWhatsApp = ({ hazard, location, phone, name }) => {
    const msg = `🚨 *EMERGENCY ELECTRICAL DISPATCH ALERT*\n\n` +
        `*Priority:* Critical Level 1\n` +
        `*Incident:* ${hazard || 'Short Circuit / Sparking'}\n` +
        `*Caller:* ${name || 'Resident'} (${phone || 'Direct Callback'})\n` +
        `*District / Locality:* ${location || 'Kerala'}\n` +
        `*Guaranteed SLA:* 45–90 Mins Doorstep Arrival\n\n` +
        `Please assign the nearest KSELB emergency squad immediately.`;

    openWhatsApp(msg);
};

/**
 * 3. Commercial Quotation Inquiry Template
 */
export const sendCommercialInquiryWhatsApp = ({ company, facility, district, phone }) => {
    const msg = `🏢 *SHERIYAKAM COMMERCIAL CONTRACTING INQUIRY*\n\n` +
        `*Company / Facility:* ${company || 'Commercial Client'}\n` +
        `*Sector:* ${facility || 'IT Office / Showroom'}\n` +
        `*Location:* ${district || 'Kerala'}\n` +
        `*Contact:* ${phone || 'Immediate Consultation'}\n\n` +
        `Please share formal electrical proposal & KSEB compliance details.`;

    openWhatsApp(msg);
};

/**
 * 4. Care AMC Membership Subscription Template
 */
export const sendAMCSubscriptionWhatsApp = ({ planTitle, price, city, name, phone }) => {
    const msg = `🛡️ *SHERIYAKAM CARE AMC SUBSCRIPTION*\n\n` +
        `*Plan:* ${planTitle || 'Home Care Plan'} (₹${price}/year)\n` +
        `*Subscriber:* ${name || 'Customer'} (${phone || 'Active Contact'})\n` +
        `*Location:* ${city || 'Kerala'}\n\n` +
        `Please schedule our 1st Quarterly Electrical Audit visit.`;

    openWhatsApp(msg);
};
