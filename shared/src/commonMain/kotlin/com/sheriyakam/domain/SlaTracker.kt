package com.sheriyakam.domain

import kotlinx.serialization.Serializable
import kotlin.math.max

@Serializable
data class SlaStatus(
    val slaMinutes: Int,
    val elapsedMinutes: Int,
    val remainingMinutes: Int,
    val isWarning: Boolean,
    val isBreached: Boolean
)

object SlaTracker {

    /**
     * Calculates 90-minute Kerala emergency wireman SLA countdown.
     * Flags a warning at <= 30 minutes remaining.
     * Flags breached at <= 0 minutes remaining if not completed.
     */
    fun calculateSla(
        createdAtMs: Long,
        currentTimeMs: Long,
        slaMinutes: Int = 90,
        isCompleted: Boolean = false
    ): SlaStatus {
        val elapsedMs = currentTimeMs - createdAtMs
        val elapsedMinutes = max(0, (elapsedMs / 60000L).toInt())
        val remainingMinutes = slaMinutes - elapsedMinutes

        val isWarning = remainingMinutes in 1..30 && !isCompleted
        val isBreached = remainingMinutes <= 0 && !isCompleted

        return SlaStatus(
            slaMinutes = slaMinutes,
            elapsedMinutes = elapsedMinutes,
            remainingMinutes = remainingMinutes,
            isWarning = isWarning,
            isBreached = isBreached
        )
    }
}
