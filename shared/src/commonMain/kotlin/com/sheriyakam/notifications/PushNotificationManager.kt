package com.sheriyakam.notifications

object PushNotificationManager {

    /**
     * Parses key-value payload received from Android FCM or iOS APNs.
     * Returns null if mandatory title or body are missing.
     */
    fun parsePayload(rawMap: Map<String, String>): PushNotificationPayload? {
        val title = rawMap["title"] ?: return null
        val body = rawMap["body"] ?: return null
        if (title.isBlank() || body.isBlank()) return null

        val categoryStr = rawMap["category"] ?: "DISPATCH_ASSIGNED"
        val category = try {
            NotificationCategory.valueOf(categoryStr)
        } catch (e: Exception) {
            NotificationCategory.DISPATCH_ASSIGNED
        }

        val id = rawMap["id"] ?: "notif_${rawMap["bookingId"] ?: "sys"}"
        val bookingId = rawMap["bookingId"]
        val timestampMs = rawMap["timestampMs"]?.toLongOrNull() ?: 0L

        return PushNotificationPayload(
            id = id,
            title = title,
            body = body,
            category = category,
            bookingId = bookingId,
            data = rawMap,
            timestampMs = timestampMs
        )
    }

    /**
     * Resolves deep link destination URI for in-app native navigation.
     */
    fun generateDeepLinkUri(notification: PushNotificationPayload): String {
        val bookingId = notification.bookingId
        return when (notification.category) {
            NotificationCategory.DISPATCH_ASSIGNED,
            NotificationCategory.SLA_WARNING,
            NotificationCategory.TECHNICIAN_ARRIVED -> {
                if (!bookingId.isNullOrBlank()) "sheriyakam://tracking/$bookingId" else "sheriyakam://tracking"
            }
            NotificationCategory.PAYMENT_CONFIRMED -> {
                if (!bookingId.isNullOrBlank()) "sheriyakam://receipt/$bookingId" else "sheriyakam://"
            }
            NotificationCategory.DISPUTE_ALERT -> {
                if (!bookingId.isNullOrBlank()) "sheriyakam://dispute/$bookingId" else "sheriyakam://support"
            }
        }
    }
}
