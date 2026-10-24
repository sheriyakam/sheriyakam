package com.sheriyakam.android.workers

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import com.sheriyakam.network.SheriyakamApiClient
import com.sheriyakam.storage.AndroidSharedPreferencesDriver
import com.sheriyakam.storage.OfflineSyncCoordinator
import com.sheriyakam.storage.PersistentOfflineQueue

class SyncOfflineMutationsWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val driver = AndroidSharedPreferencesDriver(applicationContext)
        val queue = PersistentOfflineQueue(driver)
        val coordinator = OfflineSyncCoordinator(queue)
        val apiClient = SheriyakamApiClient()

        return try {
            val result = coordinator.reconcilePendingMutations { mutation ->
                apiClient.postMutation(mutation.endpoint, mutation.payloadJson)
            }

            if (result.remainingPending > 0) {
                Result.retry()
            } else {
                queue.pruneSynced()
                Result.success()
            }
        } catch (e: Exception) {
            Result.retry()
        }
    }
}
