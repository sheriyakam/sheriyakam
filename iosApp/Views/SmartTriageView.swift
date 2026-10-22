import SwiftUI

struct SmartTriageView: View {
    @State private var problemText: String = "Main MCB trip and there is spark in the kitchen switchboard"

    // Symmetric to KMP Shared TriageEngine
    private var isEmergency: Bool {
        let text = problemText.lowercased()
        return text.contains("mcb") || text.contains("trip") || text.contains("spark") ||
               text.contains("shock") || text.contains("smoke") || text.contains("fire")
    }

    private var serviceTitle: String {
        isEmergency ? "Emergency Repair Specialist (90-Min)" : "General Electrical Diagnostic"
    }

    private var estimatedPrice: String {
        isEmergency ? "₹449 - ₹899" : "₹299"
    }

    private var diagnosis: String {
        isEmergency
            ? "Possible insulation breakdown, neutral fault, or overload tripping the RCCB/MCB."
            : "General inspection required by certified wireman."
    }

    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 10/255, green: 15/255, blue: 28/255)
                    .ignoresSafeArea()

                VStack(alignment: .leading, spacing: 18) {
                    Text("Describe the electrical issue:")
                        .font(.subheadline)
                        .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))

                    TextEditor(text: $problemText)
                        .frame(height: 100)
                        .padding(8)
                        .scrollContentBackground(.hidden)
                        .background(Color(red: 19/255, green: 27/255, blue: 46/255))
                        .foregroundColor(.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color(red: 30/255, green: 41/255, blue: 59/255), lineWidth: 1)
                        )

                    // Diagnosis Card
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text(serviceTitle)
                                .font(.headline)
                                .foregroundColor(.white)
                            Spacer()

                            // Live Urgency Pill
                            Text(isEmergency ? "90-MIN EMERGENCY" : "STANDARD DISPATCH")
                                .font(.caption2)
                                .fontWeight(.heavy)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(
                                    isEmergency
                                        ? Color.red.opacity(0.2)
                                        : Color.blue.opacity(0.2)
                                )
                                .foregroundColor(isEmergency ? .red : .blue)
                                .cornerRadius(20)
                        }

                        Text(diagnosis)
                            .font(.subheadline)
                            .foregroundColor(Color(red: 203/255, green: 213/255, blue: 225/255))

                        Divider()
                            .background(Color(red: 30/255, green: 41/255, blue: 59/255))

                        HStack {
                            Text("Estimated Price:")
                                .font(.footnote)
                                .foregroundColor(Color(red: 148/255, green: 163/255, blue: 184/255))
                            Spacer()
                            Text(estimatedPrice)
                                .font(.headline)
                                .fontWeight(.bold)
                                .foregroundColor(Color(red: 245/255, green: 158/255, blue: 11/255))
                        }
                    }
                    .padding()
                    .background(Color(red: 19/255, green: 27/255, blue: 46/255))
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(isEmergency ? Color.red : Color(red: 30/255, green: 41/255, blue: 59/255), lineWidth: 1)
                    )

                    Spacer()

                    Button(action: {
                        // Confirm dispatch
                    }) {
                        Text(isEmergency ? "Dispatch Emergency Electrician Now" : "Proceed with Booking (\(estimatedPrice))")
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(isEmergency ? .white : .black)
                            .frame(maxWidth: .infinity)
                            .frame(height: 54)
                            .background(isEmergency ? Color.red : Color(red: 245/255, green: 158/255, blue: 11/255))
                            .cornerRadius(12)
                    }
                }
                .padding()
            }
            .navigationTitle("AI Problem Diagnostic")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}
