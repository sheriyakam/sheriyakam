package com.sheriyakam.storage

import kotlinx.coroutines.test.runTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals

class OfflineSyncCoordinatorTest {

    private class InMemoryStorageDriver : KeyValueStorageDriver {
        val map = mutableMapOf<String, String>()
        override fun getString(key: String): String? = map[key]
        override fun putString(key: String, value: String) { map[key] = value }
        override fun remove(key: String) { map.remove(key) }
    }

    private lateinit var storageDriver: InMemoryStorageDriver
    private lateinit var queue: PersistentOfflineQueue
    private lateinit var coordinator: OfflineSyncCoordinator

    @BeforeTest
    fun setUp() {
        storageDriver = InMemoryStorageDriver()
        queue = PersistentOfflineQueue(storageDriver, "test_sync_key")
        coordinator = OfflineSyncCoordinator(queue, maxRetries = 5)
    }

    @Test
    fun testExponentialBackoffProgression() {
        assertEquals(1000L, coordinator.calculateBackoffMs(0))
        assertEquals(2000L, coordinator.calculateBackoffMs(1))
        assertEquals(4000L, coordinator.calculateBackoffMs(2))
        assertEquals(8000L, coordinator.calculateBackoffMs(3))
        assertEquals(16000L, coordinator.calculateBackoffMs(4))
        assertEquals(32000L, coordinator.calculateBackoffMs(5))
    }

    @Test
    fun testReconcileSuccessBatch() = runTest {
        queue.enqueue("/api/v1/bookings", "POST", "{\"id\":1}")
        queue.enqueue("/api/v1/otp", "POST", "{\"otp\":\"1234\"}")

        val result = coordinator.reconcilePendingMutations { Result.success(true) }

        assertEquals(2, result.syncedCount)
        assertEquals(0, result.failedCount)
        assertEquals(0, result.remainingPending)
    }

    @Test
    fun testReconcileFailureIncrementsRetries() = runTest {
        val mut = queue.enqueue("/api/v1/bookings", "POST", "{\"id\":1}")

        val result = coordinator.reconcilePendingMutations { Result.failure(Exception("Network error")) }

        assertEquals(0, result.syncedCount)
        assertEquals(1, result.failedCount)
        assertEquals(1, result.remainingPending)

        val updated = queue.getById(mut.id)
        assertEquals(1, updated?.retryCount)
    }
}
