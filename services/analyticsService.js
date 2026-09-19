/**
 * Analytics Backend Engine
 * Computes weekly/monthly revenue, booking volume, service popularity, and repeat customer retention.
 */

import { getBookings } from '../constants/bookingStore';
import { getCustomers } from '../constants/customerStore';

export const AnalyticsService = {
    /**
     * Compute comprehensive metrics for owner
     */
    getSummary() {
        const bookings = getBookings();
        const customers = getCustomers();

        const now = Date.now();
        const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

        // Filter bookings by window
        const thisWeekBookings = bookings.filter(b => new Date(b.createdAt || now).getTime() >= oneWeekAgo);
        const thisMonthBookings = bookings.filter(b => new Date(b.createdAt || now).getTime() >= oneMonthAgo);

        // Compute revenues (only for paid/completed jobs)
        const weeklyRevenue = thisWeekBookings
            .filter(b => b.paymentStatus === 'paid' || b.status === 'completed' || b.status === 'Done')
            .reduce((sum, b) => sum + (Number(b.finalPrice || b.price) || 0), 0);

        const monthlyRevenue = thisMonthBookings
            .filter(b => b.paymentStatus === 'paid' || b.status === 'completed' || b.status === 'Done')
            .reduce((sum, b) => sum + (Number(b.finalPrice || b.price) || 0), 0);

        const totalLifetimeRevenue = bookings
            .filter(b => b.paymentStatus === 'paid' || b.status === 'completed' || b.status === 'Done')
            .reduce((sum, b) => sum + (Number(b.finalPrice || b.price) || 0), 0);

        // Service Popularity breakdown
        const serviceCounts = {};
        bookings.forEach(b => {
            const srv = b.service || 'General Repair';
            serviceCounts[srv] = (serviceCounts[srv] || 0) + 1;
        });

        const topServices = Object.entries(serviceCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([service, count]) => ({ service, count }));

        const mostRequestedService = topServices.length > 0 ? topServices[0].service : 'Fan Repair';

        // Repeat customer count
        const repeatCustomers = customers.filter(c => c.totalBookings > 1 || c.isRepeat).length;
        const totalUniqueCustomers = customers.length;
        const repeatRatePercent = totalUniqueCustomers > 0 
            ? Math.round((repeatCustomers / totalUniqueCustomers) * 100) 
            : 0;

        return {
            totalBookingsCount: bookings.length,
            weeklyBookingsCount: thisWeekBookings.length,
            monthlyBookingsCount: thisMonthBookings.length,
            weeklyRevenue,
            monthlyRevenue,
            totalLifetimeRevenue,
            mostRequestedService,
            topServices,
            totalUniqueCustomers,
            repeatCustomersCount: repeatCustomers,
            repeatRatePercent,
            computedAt: new Date().toISOString(),
        };
    }
};
