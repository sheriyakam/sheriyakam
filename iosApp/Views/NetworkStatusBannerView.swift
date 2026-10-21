import SwiftUI

public struct NetworkStatusBannerView: View {
    public let isOnline: Bool
    public let pendingCount: Int
    public let isSyncing: Bool
    public let onSyncNow: () -> Void

    public init(
        isOnline: Bool,
        pendingCount: Int,
        isSyncing: Bool = false,
        onSyncNow: @escaping () -> Void = {}
    ) {
        self.isOnline = isOnline
        self.pendingCount = pendingCount
        self.isSyncing = isSyncing
        self.onSyncNow = onSyncNow
    }

    public var body: some View {
        if !isOnline || pendingCount > 0 {
            HStack(spacing: 12) {
                Image(systemName: isOnline ? "arrow.triangle.2.circlepath" : "wifi.slash")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)

                VStack(alignment: .leading, spacing: 2) {
                    Text(isOnline ? "\(pendingCount) Action(s) Pending Sync" : "Offline Mode — Cached Locally")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)

                    Text(isOnline ? "Tap to reconcile mutations with backend" : "All bookings queued safely on device")
                        .font(.system(size: 11, weight: .regular))
                        .foregroundColor(.white.opacity(0.85))
                }

                Spacer()

                if isSyncing {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else if isOnline && pendingCount > 0 {
                    Button(action: onSyncNow) {
                        Text("Sync")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(Color(red: 0.06, green: 0.09, blue: 0.16))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.white)
                            .cornerRadius(6)
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(isOnline ? Color.orange : Color.red)
            .cornerRadius(10)
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
            .transition(.move(edge: .top).combined(with: .opacity))
            .animation(.easeInOut(duration: 0.25), value: isOnline)
            .animation(.easeInOut(duration: 0.25), value: pendingCount)
        }
    }
}
