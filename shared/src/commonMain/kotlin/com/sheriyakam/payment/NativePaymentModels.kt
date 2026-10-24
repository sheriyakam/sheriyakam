package com.sheriyakam.payment

import kotlinx.serialization.Serializable

@Serializable
data class NativePaymentOrder(
    val orderId: String,
    val amountPaise: Long,
    val currency: String = "INR",
    val customerPhone: String,
    val customerEmail: String = "",
    val description: String = "Sheriyakam Certified Electrical Service",
    val notes: Map<String, String> = emptyMap()
)

sealed class NativePaymentResult {
    data class Success(
        val paymentId: String,
        val orderId: String,
        val signature: String
    ) : NativePaymentResult()

    data class Cancelled(
        val reason: String = "User cancelled payment"
    ) : NativePaymentResult()

    data class Failure(
        val code: Int,
        val description: String
    ) : NativePaymentResult()
}

interface NativePaymentProcessor {
    fun launchCheckout(
        order: NativePaymentOrder,
        onResult: (NativePaymentResult) -> Unit
    )
}
