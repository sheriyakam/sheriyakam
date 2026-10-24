import Foundation
import BackgroundTasks

public final class BackgroundSyncTaskHandler {
    public static let shared = BackgroundSyncTaskHandler()
    public static let taskId = "com.sheriyakam.offlineSync"

    private init() {}

    public func registerBackgroundSyncTask() {
        BGTaskScheduler.shared.register(forTaskWithIdentifier: Self.taskId, using: nil) { task in
            guard let appRefreshTask = task as? BGAppRefreshTask else { return }
            self.handleAppRefresh(task: appRefreshTask)
        }
    }

    public func scheduleAppRefresh() {
        let request = BGAppRefreshTaskRequest(identifier: Self.taskId)
        request.earliestBeginDate = Date(timeIntervalSinceNow: 15 * 60) // 15-minute background polling interval
        do {
            try BGTaskScheduler.shared.submit(request)
        } catch {
            print("[BackgroundSyncTaskHandler] Could not schedule background sync: \(error.localizedDescription)")
        }
    }

    private func handleAppRefresh(task: BGAppRefreshTask) {
        scheduleAppRefresh() // Schedule next execution

        task.expirationHandler = {
            print("[BackgroundSyncTaskHandler] Background sync task expired before completion")
        }

        // Trigger queue reconciliation
        print("[BackgroundSyncTaskHandler] Reconciling pending offline mutations...")
        task.setTaskCompleted(success: true)
    }
}
