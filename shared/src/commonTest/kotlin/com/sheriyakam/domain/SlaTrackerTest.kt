package com.sheriyakam.domain

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class SlaTrackerTest {

    @Test
    fun testComputesSlaStatesAccurately() {
        val createdAtMs = 1700000000000L
        val maxMinutes = 90

        // 1. At 30 mins elapsed -> Normal
        val normal = SlaTracker.calculateSla(
            createdAtMs = createdAtMs,
            currentTimeMs = createdAtMs + (30 * 60000L),
            slaMinutes = maxMinutes,
            isCompleted = false
        )
        assertFalse(normal.isWarning)
        assertFalse(normal.isBreached)
        assertEquals(60, normal.remainingMinutes)
        assertEquals(30, normal.elapsedMinutes)

        // 2. At 70 mins elapsed -> Warning (<= 30 mins remaining)
        val warning = SlaTracker.calculateSla(
            createdAtMs = createdAtMs,
            currentTimeMs = createdAtMs + (70 * 60000L),
            slaMinutes = maxMinutes,
            isCompleted = false
        )
        assertTrue(warning.isWarning)
        assertFalse(warning.isBreached)
        assertEquals(20, warning.remainingMinutes)

        // 3. At 95 mins elapsed -> Breached
        val breached = SlaTracker.calculateSla(
            createdAtMs = createdAtMs,
            currentTimeMs = createdAtMs + (95 * 60000L),
            slaMinutes = maxMinutes,
            isCompleted = false
        )
        assertTrue(breached.isBreached)
        assertTrue(breached.remainingMinutes <= 0)

        // 4. Completed jobs are never breached
        val completed = SlaTracker.calculateSla(
            createdAtMs = createdAtMs,
            currentTimeMs = createdAtMs + (120 * 60000L),
            slaMinutes = maxMinutes,
            isCompleted = true
        )
        assertFalse(completed.isBreached)
    }
}
