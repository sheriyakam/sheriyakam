package com.sheriyakam.notifications

import kotlinx.serialization.Serializable

@Serializable
enum class NotificationCategory {
    DISPATCH_ASSIGNED,
    SLA_WARNING,
    TECHNICIAN_ARRIVED,
    PAYMENT_CONFIRMED,
    DISPUTE_ALERT
}

@Serializable
data class PushNotificationPayload(
    val id: String,
    val title: String,
    val body: String,
    val category: NotificationCategory,
    val bookingId: String? = null,
    val data: Map<String, String> = emptyMap(),
    val timestampMs: Long
)

interface PushTokenRegistrar {
    suspend fun registerDeviceToken(token: String, platform: String): Result<Boolean>
}
