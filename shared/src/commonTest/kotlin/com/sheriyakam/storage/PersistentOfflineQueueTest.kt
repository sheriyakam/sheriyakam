package com.sheriyakam.storage

import com.sheriyakam.network.MutationStatus
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class PersistentOfflineQueueTest {

    private class InMemoryStorageDriver : KeyValueStorageDriver {
        private val storage = mutableMapOf<String, String>()

        override fun getString(key: String): String? = storage[key]

        override fun putString(key: String, value: String) {
            storage[key] = value
        }

        override fun remove(key: String) {
            storage.remove(key)
        }

        override fun clear() {
            storage.clear()
        }
    }

    @Test
    fun testSaveAndReloadPreservesMutationsAcrossRestarts() {
        val driver = InMemoryStorageDriver()
        val queue1 = PersistentOfflineQueue(driver)

        val m1 = queue1.enqueue("/api/leads", "POST", """{"customer":"Deepak"}""")
        val m2 = queue1.enqueue("/api/leads", "POST", """{"customer":"Anjali"}""")
        assertEquals(2, queue1.getPending().size)

        // Simulate app kill & cold restart with a new instance connected to same driver
        val queue2 = PersistentOfflineQueue(driver)
        val pending = queue2.getPending()

        assertEquals(2, pending.size)
        assertEquals(m1.id, pending[0].id)
        assertEquals(m2.id, pending[1].id)
        assertEquals(MutationStatus.PENDING, pending[0].status)
    }

    @Test
    fun testAtomicMutationStateTransitionsPersisted() {
        val driver = InMemoryStorageDriver()
        val queue = PersistentOfflineQueue(driver)
        val m = queue.enqueue("/api/triage", "POST", """{"issue":"MCB spark"}""")

        queue.markSyncing(m.id)
        val restored1 = PersistentOfflineQueue(driver)
        assertEquals(MutationStatus.SYNCING, restored1.getById(m.id)?.status)

        queue.markFailed(m.id, "Connection refused")
        val restored2 = PersistentOfflineQueue(driver)
        assertEquals(MutationStatus.FAILED, restored2.getById(m.id)?.status)
        assertEquals(1, restored2.getById(m.id)?.retryCount)

        queue.markSynced(m.id)
        val restored3 = PersistentOfflineQueue(driver)
        assertEquals(MutationStatus.SYNCED, restored3.getById(m.id)?.status)
        assertTrue(restored3.getPending().isEmpty())
    }

    @Test
    fun testPruneSyncedKeepsQueueLightweight() {
        val driver = InMemoryStorageDriver()
        val queue = PersistentOfflineQueue(driver)

        val m1 = queue.enqueue("/api/leads", "POST", """{"item":1}""")
        val m2 = queue.enqueue("/api/leads", "POST", """{"item":2}""")
        queue.markSynced(m1.id)

        queue.pruneSynced()
        val all = queue.getAll()
        assertEquals(1, all.size)
        assertEquals(m2.id, all[0].id)
    }
}
