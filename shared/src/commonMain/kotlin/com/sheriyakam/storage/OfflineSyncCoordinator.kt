package com.sheriyakam.storage

import com.sheriyakam.network.MutationStatus
import com.sheriyakam.network.QueuedMutation
import kotlin.math.min
import kotlin.math.pow

data class SyncBatchResult(
    val syncedCount: Int,
    val failedCount: Int,
    val remainingPending: Int
)

class OfflineSyncCoordinator(
    private val persistentQueue: PersistentOfflineQueue,
    private val maxRetries: Int = 5
) {
    /**
     * Calculates exponential backoff in milliseconds: base 1000ms * 2^retryCount.
     */
    fun calculateBackoffMs(retryCount: Int): Long {
        val exponent = min(retryCount, 6)
        val factor = 2.0.pow(exponent.toDouble()).toLong()
        return 1000L * factor
    }

    /**
     * Executes background batch reconciliation using the provided remote sender function.
     */
    suspend fun reconcilePendingMutations(
        sender: suspend (QueuedMutation) -> Result<Boolean>
    ): SyncBatchResult {
        val pending = persistentQueue.getPending().filter { it.retryCount < maxRetries }

        var synced = 0
        var failed = 0

        for (mutation in pending) {
            persistentQueue.markSyncing(mutation.id)
            val result = try {
                sender(mutation)
            } catch (e: Exception) {
                Result.failure(e)
            }

            if (result.isSuccess && result.getOrNull() == true) {
                persistentQueue.markSynced(mutation.id)
                synced++
            } else {
                val errorMsg = result.exceptionOrNull()?.message ?: "Reconciliation HTTP failure"
                persistentQueue.markFailed(mutation.id, errorMsg)
                failed++
            }
        }

        val remaining = persistentQueue.getPending().count { it.status != MutationStatus.SYNCED }
        return SyncBatchResult(
            syncedCount = synced,
            failedCount = failed,
            remainingPending = remaining
        )
    }
}
