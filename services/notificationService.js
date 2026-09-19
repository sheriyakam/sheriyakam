/**
 * Centralized Notification Service
 * Formats and dispatches WhatsApp messages, SMS payloads, and customer alerts.
 */

import { openWhatsApp } from '../utils/whatsapp';

export const NotificationService = {
    /**
     * Notify owner/ops of a new booking request
     */
    notifyOwnerNewBooking(booking) {
        const msg = `⚡ *NEW SHERIYAKAM BOOKING (#${booking.id})*\n\n` +
            `*Customer:* ${booking.customerName || 'Resident'}\n` +
            `*Phone:* ${booking.customerPhone}\n` +
            `*Service:* ${booking.service}\n` +
            `*Location:* ${booking.address || booking.taluk || 'Thalassery'}\n` +
            `*Time:* ${booking.preferredTime || booking.time || 'Immediate'}\n` +
            `*Estimated Price:* ₹${booking.price || 249}\n\n` +
            `👉 Open Dispatch Desk: https://sheriyakam.vercel.app/admin/manual-dispatch`;

        // Direct WhatsApp to owner
        return openWhatsApp(msg, '+917594056789');
    },

    /**
     * Notify customer that technician has been assigned and is on the way
     */
    notifyCustomerAssigned(booking, technicianName = 'Zanjan') {
        const msg = `Hello ${booking.customerName || 'Customer'},\n\n` +
            `Your Sheriyakam electrical service booking (#${booking.id}) has been confirmed.\n\n` +
            `⚡ *Assigned Electrician:* ${technicianName}\n` +
            `🕒 *Estimated Arrival:* 45–90 minutes\n` +
            `📍 *Location:* ${booking.address || 'Thalassery'}\n\n` +
            `Our technician will call you before arrival. For immediate help, call: 0490 299 6789.\n` +
            `_Sheriyakam Home Services Kerala_`;

        return openWhatsApp(msg, booking.customerPhone);
    },

    /**
     * Notify customer on job completion with payment details and 30-day warranty
     */
    notifyCustomerJobDone(booking, amount, paymentLink = null) {
        const finalAmt = amount || booking.finalPrice || booking.price || 249;
        const linkStr = paymentLink || `https://razorpay.me/@sheriyakam?amount=${finalAmt}`;

        const msg = `⚡ *SHERIYAKAM SERVICE INVOICE (#${booking.id})*\n\n` +
            `Dear ${booking.customerName || 'Customer'},\n` +
            `Your electrical service for *${booking.service}* is complete.\n\n` +
            `💰 *Total Amount:* ₹${finalAmt}\n` +
            `🛡️ *Warranty:* 30 Days Rework Protection\n\n` +
            `💳 *Pay Online (UPI / Card / NetBanking):*\n${linkStr}\n\n` +
            `_(You can also pay cash directly to the wireman)_\n\n` +
            `Thank you for trusting Sheriyakam! If you have any feedback, reply directly to this message.`;

        return openWhatsApp(msg, booking.customerPhone);
    }
};
