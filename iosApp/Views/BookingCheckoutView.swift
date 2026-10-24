import SwiftUI

// Bridging interface / direct consumer of shared KMP framework
// When Shared.framework is linked: import Shared
struct BookingCheckoutView: View {
    @State private var laborCharge: Double = 400.0
    @State private var materialsCharge: Double = 300.0
    @State private var travelAllowance: Double = 50.0
    @State private var platformFee: Double = 29.0

    public var onInitiateCheckout: ((Int64) -> Void)? = nil

    // Computed SAC 9987 Tax & Split Breakdown (Symmetric to KMP PaymentSplit domain)
    private var subtotalService: Double { laborCharge + platformFee }
    private var serviceTax: Double { (subtotalService * 0.18).rounded() }
    private var grandTotal: Int {
        Int((subtotalService + materialsCharge + travelAllowance + serviceTax).rounded())
    }
    private var amountPaise: Int64 {
        Int64(grandTotal * 100)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 10/255, green: 15/255, blue: 28/255)
                    .ignoresSafeArea()

                VStack(spacing: 20) {
                    // Service Header Card
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Kerala Electrical Service (SAC 9987)")
                            .font(.headline)
                            .foregroundColor(.white)
                        Text("KSELB Certified Wireman On-Site Dispatch")
                            .font(.subheadline)
                            .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(Color(red: 19/255, green: 27/255, blue: 46/255))
                    .cornerRadius(12)

                    // Breakdown Card
                    VStack(spacing: 12) {
                        PriceRow(title: "Labor Charge", amount: "₹\(Int(laborCharge))")
                        PriceRow(title: "Platform & Diagnostic Fee", amount: "₹\(Int(platformFee))")
                        PriceRow(title: "ISI Approved Materials", amount: "₹\(Int(materialsCharge))")
                        PriceRow(title: "Travel Allowance", amount: "₹\(Int(travelAllowance))")
                        PriceRow(title: "GST (18% SAC 9987)", amount: "₹\(Int(serviceTax))")

                        Divider()
                            .background(Color(red: 30/255, green: 41/255, blue: 59/255))

                        HStack {
                            Text("Grand Total")
                                .font(.title3)
                                .fontWeight(.bold)
                                .foregroundColor(.white)
                            Spacer()
                            Text("₹\(grandTotal)")
                                .font(.title)
                                .fontWeight(.heavy)
                                .foregroundColor(Color(red: 245/255, green: 158/255, blue: 11/255))
                        }
                    }
                    .padding()
                    .background(Color(red: 19/255, green: 27/255, blue: 46/255))
                    .cornerRadius(12)

                    Spacer()

                    // Pay CTA (Native Razorpay Checkout)
                    Button(action: {
                        onInitiateCheckout?(amountPaise)
                    }) {
                        Text("Confirm & Pay ₹\(grandTotal)")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.black)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(Color(red: 245/255, green: 158/255, blue: 11/255))
                            .cornerRadius(12)
                    }
                }
                .padding()
            }
            .navigationTitle("Checkout")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

private struct PriceRow: View {
    let title: String
    let amount: String

    var body: some View {
        HStack {
            Text(title)
                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
            Spacer()
            Text(amount)
                .fontWeight(.medium)
                .foregroundColor(.white)
        }
    }
}
