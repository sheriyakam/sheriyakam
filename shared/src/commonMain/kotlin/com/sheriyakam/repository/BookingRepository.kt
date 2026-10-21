package com.sheriyakam.repository

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.random.Random

class BookingRepository {

    private val _bookings = MutableStateFlow<List<Booking>>(emptyList())
    val bookings: StateFlow<List<Booking>> = _bookings.asStateFlow()

    private fun generateOtp(): String {
        return Random.nextInt(1000, 9999).toString()
    }

    private fun generateBookingId(): String {
        val rand = Random.nextInt(10000, 99999)
        return "b-kmp-$rand"
    }

    fun getById(id: String): Booking? {
        return _bookings.value.find { it.id == id }
    }

    fun createBooking(
        customerName: String,
        customerPhone: String,
        service: String,
        serviceType: String,
        district: String,
        taluk: String,
        address: String,
        price: Int,
        isEmergency: Boolean = false,
        slaMinutes: Int = 90
    ): Booking {
        val platformFee = price * 10 / 100
        val netPayout = price - platformFee

        val newBooking = Booking(
            id = generateBookingId(),
            customerName = customerName,
            customerPhone = customerPhone,
            service = service,
            serviceType = serviceType,
            district = district,
            taluk = taluk,
            address = address,
            price = price,
            finalPrice = price,
            platformFee = platformFee,
            netPartnerPayout = netPayout,
            status = BookingStatus.OPEN,
            isEmergency = isEmergency,
            checkInOtp = generateOtp(),
            completionOtp = generateOtp(),
            slaMinutes = slaMinutes,
            createdAtTimestamp = Random.nextLong(1_700_000_000, 1_800_000_000),
            payoutStatus = "PENDING"
        )

        _bookings.value = _bookings.value + newBooking
        return newBooking
    }

    fun acceptBooking(
        bookingId: String,
        partnerId: String,
        partnerName: String,
        partnerPhone: String
    ): Result<Booking> {
        val currentList = _bookings.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == bookingId }
        if (index == -1) {
            return Result.failure(IllegalArgumentException("Booking with ID $bookingId not found"))
        }

        val updated = currentList[index].copy(
            status = BookingStatus.ACCEPTED,
            assignedPartnerId = partnerId,
            partnerName = partnerName,
            assignedPartnerPhone = partnerPhone,
            acceptedAtTimestamp = Random.nextLong(1_700_000_000, 1_800_000_000)
        )
        currentList[index] = updated
        _bookings.value = currentList
        return Result.success(updated)
    }

    fun verifyCheckInOtp(bookingId: String, enteredOtp: String): OtpVerificationResult {
        val currentList = _bookings.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == bookingId }
        if (index == -1) return OtpVerificationResult.INVALID_OTP

        val booking = currentList[index]
        if (booking.status == BookingStatus.IN_PROGRESS || booking.status == BookingStatus.COMPLETED) {
            return OtpVerificationResult.ALREADY_VERIFIED
        }

        if (booking.checkInOtp != enteredOtp) {
            return OtpVerificationResult.INVALID_OTP
        }

        val updated = booking.copy(status = BookingStatus.IN_PROGRESS)
        currentList[index] = updated
        _bookings.value = currentList
        return OtpVerificationResult.SUCCESS
    }

    fun verifyCompletionOtp(bookingId: String, enteredOtp: String): OtpVerificationResult {
        val currentList = _bookings.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == bookingId }
        if (index == -1) return OtpVerificationResult.INVALID_OTP

        val booking = currentList[index]
        if (booking.status == BookingStatus.COMPLETED) {
            return OtpVerificationResult.ALREADY_VERIFIED
        }

        if (booking.completionOtp != enteredOtp) {
            return OtpVerificationResult.INVALID_OTP
        }

        val updated = booking.copy(
            status = BookingStatus.COMPLETED,
            completedAtTimestamp = Random.nextLong(1_700_000_000, 1_800_000_000),
            payoutStatus = "SETTLED"
        )
        currentList[index] = updated
        _bookings.value = currentList
        return OtpVerificationResult.SUCCESS
    }

    fun disputeBooking(bookingId: String, reason: String): Result<Booking> {
        val currentList = _bookings.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == bookingId }
        if (index == -1) {
            return Result.failure(IllegalArgumentException("Booking with ID $bookingId not found"))
        }

        val updated = currentList[index].copy(
            status = BookingStatus.DISPUTED,
            payoutStatus = "ESCROW_LOCKED",
            disputeReason = reason
        )
        currentList[index] = updated
        _bookings.value = currentList
        return Result.success(updated)
    }

    fun cancelBooking(bookingId: String, reason: String): Result<Booking> {
        val currentList = _bookings.value.toMutableList()
        val index = currentList.indexOfFirst { it.id == bookingId }
        if (index == -1) {
            return Result.failure(IllegalArgumentException("Booking with ID $bookingId not found"))
        }

        val updated = currentList[index].copy(
            status = BookingStatus.CANCELLED,
            payoutStatus = "REFUNDED",
            disputeReason = reason
        )
        currentList[index] = updated
        _bookings.value = currentList
        return Result.success(updated)
    }

    fun getActiveEmergencyBookings(): List<Booking> {
        return _bookings.value.filter {
            it.isEmergency && (
                it.status == BookingStatus.OPEN ||
                it.status == BookingStatus.ACCEPTED ||
                it.status == BookingStatus.IN_PROGRESS
            )
        }
    }
}
