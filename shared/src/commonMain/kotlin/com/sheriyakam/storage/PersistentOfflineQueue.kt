package com.sheriyakam.storage

import com.sheriyakam.network.MutationStatus
import com.sheriyakam.network.QueuedMutation
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlin.random.Random

class PersistentOfflineQueue(
    private val driver: KeyValueStorageDriver,
    private val storageKey: String = "sheriyakam_offline_mutations"
) {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        encodeDefaults = true
    }

    private val queue = mutableListOf<QueuedMutation>()

    init {
        loadFromStorage()
    }

    private fun loadFromStorage() {
        val raw = driver.getString(storageKey)
        if (!raw.isNullOrBlank()) {
            try {
                val parsed: List<QueuedMutation> = json.decodeFromString(raw)
                queue.clear()
                queue.addAll(parsed)
            } catch (e: Exception) {
                // If corrupted, fallback gracefully
                queue.clear()
            }
        }
    }

    private fun flushToStorage() {
        try {
            val serialized = json.encodeToString(queue)
            driver.putString(storageKey, serialized)
        } catch (e: Exception) {
            // Storage flush error handling
        }
    }

    private fun generateId(prefix: String): String {
        val rand = Random.nextLong(100_000, 999_999)
        return "${prefix}_${rand}"
    }

    fun enqueue(
        endpoint: String,
        httpMethod: String,
        payloadJson: String,
        idempotencyKey: String = generateId("idemp")
    ): QueuedMutation {
        val existing = queue.find { it.idempotencyKey == idempotencyKey }
        if (existing != null) {
            return existing
        }

        val mutation = QueuedMutation(
            id = generateId("mut"),
            endpoint = endpoint,
            httpMethod = httpMethod,
            payloadJson = payloadJson,
            idempotencyKey = idempotencyKey,
            createdAtTimestamp = Random.nextLong(1_700_000_000, 1_800_000_000),
            retryCount = 0,
            status = MutationStatus.PENDING
        )
        queue.add(mutation)
        flushToStorage()
        return mutation
    }

    fun getPending(): List<QueuedMutation> {
        return queue.filter { it.status == MutationStatus.PENDING || it.status == MutationStatus.FAILED }
    }

    fun getAll(): List<QueuedMutation> {
        return queue.toList()
    }

    fun getById(id: String): QueuedMutation? {
        return queue.find { it.id == id }
    }

    fun markSyncing(id: String) {
        val index = queue.indexOfFirst { it.id == id }
        if (index != -1) {
            queue[index] = queue[index].copy(status = MutationStatus.SYNCING)
            flushToStorage()
        }
    }

    fun markSynced(id: String) {
        val index = queue.indexOfFirst { it.id == id }
        if (index != -1) {
            queue[index] = queue[index].copy(status = MutationStatus.SYNCED)
            flushToStorage()
        }
    }

    fun markFailed(id: String, error: String? = null) {
        val index = queue.indexOfFirst { it.id == id }
        if (index != -1) {
            val current = queue[index]
            queue[index] = current.copy(
                status = MutationStatus.FAILED,
                retryCount = current.retryCount + 1,
                lastError = error
            )
            flushToStorage()
        }
    }

    fun pruneSynced() {
        queue.removeAll { it.status == MutationStatus.SYNCED }
        flushToStorage()
    }

    fun clear() {
        queue.clear()
        driver.remove(storageKey)
    }
}
