package com.sheriyakam.android.payment

import android.app.Activity
import com.razorpay.Checkout
import com.razorpay.PaymentResultWithDataListener
import com.sheriyakam.payment.NativePaymentOrder
import com.sheriyakam.payment.NativePaymentProcessor
import com.sheriyakam.payment.NativePaymentResult
import org.json.JSONObject

class AndroidRazorpayPaymentProcessor(
    private val activity: Activity,
    private val keyId: String
) : NativePaymentProcessor {

    private var activeCallback: ((NativePaymentResult) -> Unit)? = null

    init {
        Checkout.preload(activity.applicationContext)
    }

    override fun launchCheckout(
        order: NativePaymentOrder,
        onResult: (NativePaymentResult) -> Unit
    ) {
        this.activeCallback = onResult

        val checkout = Checkout()
        checkout.setKeyID(keyId)

        try {
            val options = JSONObject().apply {
                put("name", "Sheriyakam Services")
                put("description", order.description)
                put("order_id", order.orderId)
                put("currency", order.currency)
                put("amount", order.amountPaise)

                val prefill = JSONObject().apply {
                    put("contact", order.customerPhone)
                    put("email", order.customerEmail)
                }
                put("prefill", prefill)

                val theme = JSONObject().apply {
                    put("color", "#0F172A")
                }
                put("theme", theme)

                val notes = JSONObject()
                order.notes.forEach { (k, v) -> notes.put(k, v) }
                put("notes", notes)
            }

            checkout.open(activity, options)
        } catch (e: Exception) {
            onResult(NativePaymentResult.Failure(code = -1, description = e.message ?: "Failed to open checkout"))
        }
    }

    fun handlePaymentSuccess(razorpayPaymentId: String, orderId: String, signature: String) {
        activeCallback?.invoke(
            NativePaymentResult.Success(
                paymentId = razorpayPaymentId,
                orderId = orderId,
                signature = signature
            )
        )
    }

    fun handlePaymentError(code: Int, response: String) {
        if (code == Checkout.PAYMENT_CANCELED) {
            activeCallback?.invoke(NativePaymentResult.Cancelled(reason = response))
        } else {
            activeCallback?.invoke(NativePaymentResult.Failure(code = code, description = response))
        }
    }
}
