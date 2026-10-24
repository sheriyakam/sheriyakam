package com.sheriyakam.notifications

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull

class PushNotificationManagerTest {

    @Test
    fun testParseValidPayload() {
        val map = mapOf(
            "id" to "msg_88192",
            "title" to "Wireman Dispatched",
            "body" to "Rajesh K is en route",
            "category" to "DISPATCH_ASSIGNED",
            "bookingId" to "KL-EKM-4091",
            "timestampMs" to "1729810000000"
        )

        val result = PushNotificationManager.parsePayload(map)
        assertNotNull(result)
        assertEquals("msg_88192", result.id)
        assertEquals("Wireman Dispatched", result.title)
        assertEquals(NotificationCategory.DISPATCH_ASSIGNED, result.category)
        assertEquals("KL-EKM-4091", result.bookingId)
        assertEquals(1729810000000L, result.timestampMs)
    }

    @Test
    fun testGenerateDeepLinks() {
        val trackingPayload = PushNotificationPayload(
            id = "1",
            title = "En Route",
            body = "Tech is nearby",
            category = NotificationCategory.DISPATCH_ASSIGNED,
            bookingId = "KL-EKM-4091",
            timestampMs = 1000L
        )
        assertEquals("sheriyakam://tracking/KL-EKM-4091", PushNotificationManager.generateDeepLinkUri(trackingPayload))

        val receiptPayload = PushNotificationPayload(
            id = "2",
            title = "Paid",
            body = "Payment received",
            category = NotificationCategory.PAYMENT_CONFIRMED,
            bookingId = "KL-EKM-4091",
            timestampMs = 2000L
        )
        assertEquals("sheriyakam://receipt/KL-EKM-4091", PushNotificationManager.generateDeepLinkUri(receiptPayload))

        val disputePayload = PushNotificationPayload(
            id = "3",
            title = "Dispute",
            body = "Escrow locked",
            category = NotificationCategory.DISPUTE_ALERT,
            bookingId = "KL-EKM-4091",
            timestampMs = 3000L
        )
        assertEquals("sheriyakam://dispute/KL-EKM-4091", PushNotificationManager.generateDeepLinkUri(disputePayload))
    }

    @Test
    fun testMissingMandatoryFieldsReturnsNull() {
        val invalidMap = mapOf("category" to "DISPATCH_ASSIGNED")
        assertNull(PushNotificationManager.parsePayload(invalidMap))
    }
}
