import SwiftUI

public struct ActiveDispatchTrackerView: View {
    public let bookingId: String
    public let customerName: String
    public let district: String
    public let taluk: String
    public let status: String
    public let wiremanName: String?
    public let wiremanPhone: String?
    public let checkInOtp: String
    public let completionOtp: String
    public let remainingMinutes: Int
    public let onVerifyCheckIn: (String) -> Void
    public let onVerifyCompletion: (String) -> Void
    public let onRaiseDispute: (String) -> Void

    @State private var checkInInput: String = ""
    @State private var completionInput: String = ""
    @State private var showDisputeModal: Bool = false
    @State private var disputeReason: String = ""

    public init(
        bookingId: String,
        customerName: String,
        district: String,
        taluk: String,
        status: String,
        wiremanName: String? = nil,
        wiremanPhone: String? = nil,
        checkInOtp: String,
        completionOtp: String,
        remainingMinutes: Int = 55,
        onVerifyCheckIn: @escaping (String) -> Void = { _ in },
        onVerifyCompletion: @escaping (String) -> Void = { _ in },
        onRaiseDispute: @escaping (String) -> Void = { _ in }
    ) {
        self.bookingId = bookingId
        self.customerName = customerName
        self.district = district
        self.taluk = taluk
        self.status = status
        self.wiremanName = wiremanName
        self.wiremanPhone = wiremanPhone
        self.checkInOtp = checkInOtp
        self.completionOtp = completionOtp
        self.remainingMinutes = remainingMinutes
        self.onVerifyCheckIn = onVerifyCheckIn
        self.onVerifyCompletion = onVerifyCompletion
        self.onRaiseDispute = onRaiseDispute
    }

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Header & District
                VStack(spacing: 4) {
                    Text("Live Dispatch #\(bookingId)")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(.white)
                    Text("\(district) • \(taluk)")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color.gray)
                }
                .padding(.top, 10)

                // 90-Min Emergency SLA Card
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("90-Min Emergency SLA")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                        Spacer()
                        Text(status.uppercased())
                            .font(.system(size: 11, weight: .heavy))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.blue.opacity(0.2))
                            .foregroundColor(.blue)
                            .cornerRadius(6)
                    }

                    Text("\(max(0, remainingMinutes)) mins remaining")
                        .font(.system(size: 26, weight: .heavy))
                        .foregroundColor(remainingMinutes <= 15 ? .red : .green)

                    ProgressView(value: Double(max(0, min(90, remainingMinutes))), total: 90.0)
                        .accentColor(remainingMinutes <= 15 ? .red : .green)
                }
                .padding(16)
                .background(Color(red: 0.12, green: 0.16, blue: 0.23))
                .cornerRadius(12)

                // Assigned Wireman Card
                VStack(alignment: .leading, spacing: 8) {
                    Text("KSELB Licensed Wireman")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color.gray)

                    Text(wiremanName ?? "Assigning nearest licensed wireman...")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(.white)

                    if let phone = wiremanPhone {
                        Text(phone)
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.cyan)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
                .background(Color(red: 0.12, green: 0.16, blue: 0.23))
                .cornerRadius(12)

                // Two-Step OTP Verification
                VStack(alignment: .leading, spacing: 16) {
                    Text("Physical Verification OTPs")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)

                    // Step 1: Check-in OTP
                    HStack {
                        VStack(alignment: .leading) {
                            Text("1. Arrival OTP")
                                .font(.system(size: 12))
                                .foregroundColor(.gray)
                            Text(checkInOtp)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.orange)
                        }
                        Spacer()
                        if status == "ACCEPTED" {
                            Button("Check In") {
                                onVerifyCheckIn(checkInOtp)
                            }
                            .font(.system(size: 12, weight: .bold))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.orange)
                            .foregroundColor(.white)
                            .cornerRadius(6)
                        }
                    }

                    Divider().background(Color.gray.opacity(0.3))

                    // Step 2: Completion OTP
                    HStack {
                        VStack(alignment: .leading) {
                            Text("2. Completion OTP")
                                .font(.system(size: 12))
                                .foregroundColor(.gray)
                            Text(completionOtp)
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.green)
                        }
                        Spacer()
                        if status == "IN_PROGRESS" {
                            Button("Complete") {
                                onVerifyCompletion(completionOtp)
                            }
                            .font(.system(size: 12, weight: .bold))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.green)
                            .foregroundColor(.white)
                            .cornerRadius(6)
                        }
                    }
                }
                .padding(16)
                .background(Color(red: 0.12, green: 0.16, blue: 0.23))
                .cornerRadius(12)

                // Dispute / Lock Escrow Button
                Button(action: { showDisputeModal = true }) {
                    Text("Report Damage / Lock Escrow")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.red.opacity(0.6), lineWidth: 1)
                        )
                }
            }
            .padding(16)
        }
        .background(Color(red: 0.05, green: 0.07, blue: 0.12).ignoresSafeArea())
    }
}
