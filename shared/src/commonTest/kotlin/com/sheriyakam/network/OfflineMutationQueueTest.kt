package com.sheriyakam.network

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class OfflineMutationQueueTest {

    @Test
    fun testEnqueueMutationGeneratesPendingStatusAndId() {
        val queue = OfflineMutationQueue()
        val mutation = queue.enqueue(
            endpoint = "/api/leads",
            httpMethod = "POST",
            payloadJson = """{"name":"Arun Kumar","phone":"+919847012345"}"""
        )

        assertNotNull(mutation.id)
        assertNotNull(mutation.idempotencyKey)
        assertEquals(MutationStatus.PENDING, mutation.status)
        assertEquals(0, mutation.retryCount)
        assertEquals(1, queue.getPending().size)
    }

    @Test
    fun testFifoOrderingOfPendingMutations() {
        val queue = OfflineMutationQueue()
        val m1 = queue.enqueue("/api/leads", "POST", """{"order":1}""")
        val m2 = queue.enqueue("/api/leads", "POST", """{"order":2}""")
        val m3 = queue.enqueue("/api/leads", "POST", """{"order":3}""")

        val pending = queue.getPending()
        assertEquals(3, pending.size)
        assertEquals(m1.id, pending[0].id)
        assertEquals(m2.id, pending[1].id)
        assertEquals(m3.id, pending[2].id)
    }

    @Test
    fun testLifecycleTransitions() {
        val queue = OfflineMutationQueue()
        val mutation = queue.enqueue("/api/leads", "POST", """{"order":1}""")

        // Mark syncing
        queue.markSyncing(mutation.id)
        val syncingItem = queue.getById(mutation.id)
        assertNotNull(syncingItem)
        assertEquals(MutationStatus.SYNCING, syncingItem.status)

        // Mark failed increments retry count and sets status FAILED
        queue.markFailed(mutation.id, "Network timeout 504")
        val failedItem = queue.getById(mutation.id)
        assertNotNull(failedItem)
        assertEquals(MutationStatus.FAILED, failedItem.status)
        assertEquals(1, failedItem.retryCount)
        assertEquals("Network timeout 504", failedItem.lastError)

        // Mark synced removes or marks as SYNCED
        queue.markSynced(mutation.id)
        val syncedItem = queue.getById(mutation.id)
        assertNotNull(syncedItem)
        assertEquals(MutationStatus.SYNCED, syncedItem.status)
        assertTrue(queue.getPending().isEmpty())
    }

    @Test
    fun testSerializationAndDeserializationPreservesState() {
        val queue = OfflineMutationQueue()
        queue.enqueue("/api/leads", "POST", """{"id":"lead-101"}""", idempotencyKey = "key-abc-123")
        val json = queue.serialize()

        val restoredQueue = OfflineMutationQueue()
        restoredQueue.deserialize(json)

        val pending = restoredQueue.getPending()
        assertEquals(1, pending.size)
        assertEquals("/api/leads", pending[0].endpoint)
        assertEquals("key-abc-123", pending[0].idempotencyKey)
        assertEquals(MutationStatus.PENDING, pending[0].status)
    }

    @Test
    fun testDeduplicationWithSameIdempotencyKey() {
        val queue = OfflineMutationQueue()
        val first = queue.enqueue("/api/leads", "POST", """{"lead":"A"}""", idempotencyKey = "dedup-key-1")
        val second = queue.enqueue("/api/leads", "POST", """{"lead":"A"}""", idempotencyKey = "dedup-key-1")

        assertEquals(first.id, second.id, "Mutations with identical idempotency keys should not duplicate in queue")
        assertEquals(1, queue.getAll().size)
    }
}
