import SwiftUI

public enum AppRoute: Hashable {
    case home
    case checkout(serviceId: String, price: Int)
    case dispatch(bookingId: String)
    case triage
}

public class AppNavigationRouter: ObservableObject {
    @Published public var path = NavigationPath()
    @Published public var selectedLanguage: String = "en"

    public init() {}

    public func navigateTo(_ route: AppRoute) {
        path.append(route)
    }

    public func pop() {
        if !path.isEmpty {
            path.removeLast()
        }
    }

    public func popToRoot() {
        path = NavigationPath()
    }

    @discardableResult
    public func handleDeepLink(url: URL) -> Bool {
        let pathString = url.path
        if pathString.contains("triage") {
            navigateTo(.triage)
            return true
        } else if pathString.contains("dispatch") {
            let bookingId = url.lastPathComponent
            navigateTo(.dispatch(bookingId: bookingId))
            return true
        }
        return false
    }
}

public struct SheriyakamRootView: View {
    @StateObject private var router = AppNavigationRouter()

    public init() {}

    public var body: some View {
        NavigationStack(path: $router.path) {
            BookingCheckoutView(
                baseServicePrice: 499,
                requiresKselbWireman: true,
                onConfirmBooking: {
                    router.navigateTo(.dispatch(bookingId: "b-kmp-9901"))
                }
            )
            .navigationTitle("Sheriyakam")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { router.navigateTo(.triage) }) {
                        Image(systemName: "bolt.badge.automatic")
                            .foregroundColor(.orange)
                    }
                }
            }
            .navigationDestination(for: AppRoute.self) { route in
                switch route {
                case .home:
                    BookingCheckoutView()
                case .checkout(let serviceId, let price):
                    BookingCheckoutView(baseServicePrice: price)
                case .triage:
                    SmartTriageView(onTriageComplete: { _ in
                        router.navigateTo(.checkout(serviceId: "emergency-triage", price: 499))
                    })
                case .dispatch(let bookingId):
                    ActiveDispatchTrackerView(
                        bookingId: bookingId,
                        customerName: "Resident Customer",
                        district: "Ernakulam",
                        taluk: "Kochi",
                        status: "ACCEPTED",
                        wiremanName: "Rajesh Varma (KSELB Wireman)",
                        wiremanPhone: "+91 94470 54321",
                        checkInOtp: "4521",
                        completionOtp: "8912",
                        remainingMinutes: 55
                    )
                }
            }
        }
        .onOpenURL { url in
            router.handleDeepLink(url: url)
        }
    }
}
