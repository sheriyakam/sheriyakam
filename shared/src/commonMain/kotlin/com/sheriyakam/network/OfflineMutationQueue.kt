package com.sheriyakam.network

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlin.random.Random

class OfflineMutationQueue {

    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        encodeDefaults = true
    }

    private val lock = Any()
    private val queue = mutableListOf<QueuedMutation>()

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
        // Deduplication check
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
        }
    }

    fun markSynced(id: String) {
        val index = queue.indexOfFirst { it.id == id }
        if (index != -1) {
            queue[index] = queue[index].copy(status = MutationStatus.SYNCED)
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
        }
    }

    fun serialize(): String {
        return json.encodeToString(queue)
    }

    fun deserialize(jsonString: String) {
        val items: List<QueuedMutation> = json.decodeFromString(jsonString)
        queue.clear()
        queue.addAll(items)
    }

    fun clear() {
        queue.clear()
    }
}
