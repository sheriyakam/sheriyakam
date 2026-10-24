import Foundation
import UserNotifications
import UIKit

public final class PushNotificationService: NSObject, UNUserNotificationCenterDelegate {
    public static let shared = PushNotificationService()

    private override init() {
        super.init()
    }

    public func requestAuthorization(application: UIApplication) {
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
            if granted {
                DispatchQueue.main.async {
                    application.registerForRemoteNotifications()
                }
            }
        }
    }

    public func handleRemoteNotification(userInfo: [AnyHashable: Any], onDeepLink: @escaping (URL) -> Void) {
        guard let aps = userInfo["aps"] as? [String: Any],
              let alert = aps["alert"] as? [String: Any],
              let title = alert["title"] as? String,
              let body = alert["body"] as? String else {
            return
        }

        let category = userInfo["category"] as? String ?? "DISPATCH_ASSIGNED"
        let bookingId = userInfo["bookingId"] as? String

        let deepLinkStr: String
        switch category {
        case "DISPATCH_ASSIGNED", "SLA_WARNING", "TECHNICIAN_ARRIVED":
            deepLinkStr = bookingId != nil ? "sheriyakam://tracking/\(bookingId!)" : "sheriyakam://tracking"
        case "PAYMENT_CONFIRMED":
            deepLinkStr = bookingId != nil ? "sheriyakam://receipt/\(bookingId!)" : "sheriyakam://"
        case "DISPUTE_ALERT":
            deepLinkStr = bookingId != nil ? "sheriyakam://dispute/\(bookingId!)" : "sheriyakam://support"
        default:
            deepLinkStr = "sheriyakam://"
        }

        if let url = URL(string: deepLinkStr) {
            onDeepLink(url)
        }
    }

    // UNUserNotificationCenterDelegate presentation in foreground
    public func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification,
        withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
    ) {
        completionHandler([.banner, .sound])
    }
}
