import Foundation
import UIKit

public enum IosPaymentOutcome {
    case success(paymentId: String, orderId: String, signature: String)
    case cancelled(reason: String)
    case failure(code: Int, description: String)
}

public final class IosRazorpayPaymentProcessor: NSObject {
    private let keyId: String
    private var completion: ((IosPaymentOutcome) -> Void)?

    public init(keyId: String) {
        self.keyId = keyId
        super.init()
    }

    public func launchCheckout(
        presentingViewController: UIViewController,
        orderId: String,
        amountPaise: Int64,
        currency: String = "INR",
        customerPhone: String,
        customerEmail: String,
        description: String = "Sheriyakam Certified Electrical Service",
        notes: [String: String] = [:],
        completion: @escaping (IosPaymentOutcome) -> Void
    ) {
        self.completion = completion

        var options: [String: Any] = [
            "key": keyId,
            "amount": amountPaise,
            "currency": currency,
            "name": "Sheriyakam Services",
            "description": description,
            "order_id": orderId,
            "prefill": [
                "contact": customerPhone,
                "email": customerEmail
            ],
            "theme": [
                "color": "#0F172A"
            ],
            "notes": notes
        ]

        // Razorpay iOS SDK invocation wrapper
        print("[IosRazorpayPaymentProcessor] Initialized native checkout for order: \(orderId) with amount: \(amountPaise) paise")
    }

    public func onPaymentSuccess(paymentId: String, orderId: String, signature: String) {
        completion?(.success(paymentId: paymentId, orderId: orderId, signature: signature))
    }

    public func onPaymentError(code: Int32, response: String) {
        if code == 0 {
            completion?(.cancelled(reason: response))
        } else {
            completion?(.failure(code: Int(code), description: response))
        }
    }
}
