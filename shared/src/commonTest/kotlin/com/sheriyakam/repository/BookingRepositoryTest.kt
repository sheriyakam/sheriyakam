package com.sheriyakam.repository

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class BookingRepositoryTest {

    @Test
    fun testCreateBookingEmitsToStateFlow() {
        val repo = BookingRepository()
        val booking = repo.createBooking(
            customerName = "Manju Warrier",
            customerPhone = "+91 94471 22334",
            service = "Ceiling Fan Repair & Capacitor Replacement",
            serviceType = "Electrical",
            district = "Thrissur",
            taluk = "Chalakudy",
            address = "Main Road, Near Town Hall, Chalakudy",
            price = 450
        )

        assertNotNull(booking.id)
        assertEquals(BookingStatus.OPEN, booking.status)
        assertEquals(450, booking.finalPrice)
        // 10% platform fee
        assertEquals(45, booking.platformFee)
        // 90% net partner payout
        assertEquals(405, booking.netPartnerPayout)
        assertEquals(1, repo.bookings.value.size)
        assertEquals(booking.id, repo.bookings.value[0].id)
    }

    @Test
    fun testAcceptBookingTransitionsToAccepted() {
        val repo = BookingRepository()
        val booking = repo.createBooking(
            customerName = "Arjun Das",
            customerPhone = "+91 98470 55667",
            service = "Emergency Blackout Triage",
            serviceType = "Electrical",
            district = "Ernakulam",
            taluk = "Kanayannur",
            address = "MG Road, Kochi",
            price = 650
        )

        val acceptResult = repo.acceptBooking(
            bookingId = booking.id,
            partnerId = "tech-koch-44",
            partnerName = "Vinod Kumar",
            partnerPhone = "+91 98765 11223"
        )

        assertTrue(acceptResult.isSuccess)
        val updated = acceptResult.getOrThrow()
        assertEquals(BookingStatus.ACCEPTED, updated.status)
        assertEquals("Vinod Kumar", updated.partnerName)
        assertEquals("+91 98765 11223", updated.assignedPartnerPhone)
        assertNotNull(updated.acceptedAtTimestamp)
    }

    @Test
    fun testTwoStepOtpVerificationWorkflow() {
        val repo = BookingRepository()
        val booking = repo.createBooking(
            customerName = "Sunil George",
            customerPhone = "+91 94470 99887",
            service = "DB Box MCB Replacement",
            serviceType = "Electrical",
            district = "Kottayam",
            taluk = "Kottayam",
            address = "Collectorate Road, Kottayam",
            price = 850
        )

        repo.acceptBooking(booking.id, "tech-1", "Anoop", "+91 99999 11111")

        // 1. Invalid Check-In OTP rejected
        val badCheckIn = repo.verifyCheckInOtp(booking.id, "0000")
        assertEquals(OtpVerificationResult.INVALID_OTP, badCheckIn)

        // 2. Valid Check-In OTP transitions status to IN_PROGRESS
        val goodCheckIn = repo.verifyCheckInOtp(booking.id, booking.checkInOtp)
        assertEquals(OtpVerificationResult.SUCCESS, goodCheckIn)
        val inProgressBooking = repo.getById(booking.id)
        assertNotNull(inProgressBooking)
        assertEquals(BookingStatus.IN_PROGRESS, inProgressBooking.status)

        // 3. Completion OTP verification transitions to COMPLETED
        val goodCompletion = repo.verifyCompletionOtp(booking.id, booking.completionOtp)
        assertEquals(OtpVerificationResult.SUCCESS, goodCompletion)
        val completedBooking = repo.getById(booking.id)
        assertNotNull(completedBooking)
        assertEquals(BookingStatus.COMPLETED, completedBooking.status)
        assertEquals("SETTLED", completedBooking.payoutStatus)
    }

    @Test
    fun testDisputeBookingLocksEscrow() {
        val repo = BookingRepository()
        val booking = repo.createBooking(
            customerName = "Reshma S",
            customerPhone = "+91 94477 12345",
            service = "AC Wiring Fault",
            serviceType = "AC",
            district = "Palakkad",
            taluk = "Palakkad",
            address = "Stadium Bypass, Palakkad",
            price = 500
        )

        val disputeResult = repo.disputeBooking(booking.id, "Technician did not replace burnt MCB as promised")
        assertTrue(disputeResult.isSuccess)
        val disputed = disputeResult.getOrThrow()
        assertEquals(BookingStatus.DISPUTED, disputed.status)
        assertEquals("ESCROW_LOCKED", disputed.payoutStatus)
        assertEquals("Technician did not replace burnt MCB as promised", disputed.disputeReason)
    }

    @Test
    fun testGetActiveEmergencyBookingsFiltersCorrectly() {
        val repo = BookingRepository()
        repo.createBooking(
            customerName = "Customer A",
            customerPhone = "+91 94471 11111",
            service = "Routine Fan Cleaning",
            serviceType = "Electrical",
            district = "Kozhikode",
            taluk = "Kozhikode",
            address = "Beach Road",
            price = 250,
            isEmergency = false
        )
        val b2 = repo.createBooking(
            customerName = "Customer B",
            customerPhone = "+91 94472 22222",
            service = "Main Line Sparking & Fire Hazard",
            serviceType = "Emergency",
            district = "Kozhikode",
            taluk = "Kozhikode",
            address = "Mavoor Road",
            price = 750,
            isEmergency = true
        )

        val activeEmergencies = repo.getActiveEmergencyBookings()
        assertEquals(1, activeEmergencies.size)
        assertEquals(b2.id, activeEmergencies[0].id)
    }
}
