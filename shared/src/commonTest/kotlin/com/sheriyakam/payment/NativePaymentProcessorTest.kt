package com.sheriyakam.payment

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class NativePaymentProcessorTest {

    @Test
    fun testPaymentOrderConstruction() {
        val order = NativePaymentOrder(
            orderId = "order_test_99881122",
            amountPaise = 49000L,
            customerPhone = "+919876543210",
            customerEmail = "kerala@sheriyakam.com",
            description = "Fan Repair Service",
            notes = mapOf("district" to "Ernakulam")
        )

        assertEquals("order_test_99881122", order.orderId)
        assertEquals(49000L, order.amountPaise)
        assertEquals("INR", order.currency)
        assertEquals("+919876543210", order.customerPhone)
        assertEquals("Ernakulam", order.notes["district"])
    }

    @Test
    fun testPaymentResultPolymorphism() {
        val success: NativePaymentResult = NativePaymentResult.Success(
            paymentId = "pay_test_123",
            orderId = "order_test_99881122",
            signature = "sig_abc"
        )
        assertTrue(success is NativePaymentResult.Success)

        val cancelled: NativePaymentResult = NativePaymentResult.Cancelled()
        assertTrue(cancelled is NativePaymentResult.Cancelled)

        val failure: NativePaymentResult = NativePaymentResult.Failure(
            code = 101,
            description = "Network timeout"
        )
        assertTrue(failure is NativePaymentResult.Failure)
    }
}
