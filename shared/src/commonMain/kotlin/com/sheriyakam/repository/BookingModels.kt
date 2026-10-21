package com.sheriyakam.repository

import kotlinx.serialization.Serializable

@Serializable
enum class BookingStatus {
    OPEN,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    CANCELLED,
    DISPUTED
}

@Serializable
enum class OtpVerificationResult {
    SUCCESS,
    INVALID_OTP,
    ALREADY_VERIFIED,
    RATE_LIMITED
}

@Serializable
data class Booking(
    val id: String,
    val customerName: String,
    val customerPhone: String,
    val service: String,
    val serviceType: String,
    val district: String,
    val taluk: String,
    val address: String,
    val price: Int,
    val finalPrice: Int,
    val platformFee: Int,
    val netPartnerPayout: Int,
    val status: BookingStatus = BookingStatus.OPEN,
    val isEmergency: Boolean = false,
    val assignedPartnerId: String? = null,
    val partnerName: String? = null,
    val assignedPartnerPhone: String? = null,
    val checkInOtp: String,
    val completionOtp: String,
    val slaMinutes: Int = 90,
    val createdAtTimestamp: Long,
    val acceptedAtTimestamp: Long? = null,
    val completedAtTimestamp: Long? = null,
    val payoutStatus: String = "PENDING",
    val disputeReason: String? = null
)
