package com.sheriyakam.location

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class DistanceCalculatorTest {

    private val kochiLat = 9.9816
    private val kochiLon = 76.2999

    private val edappallyLat = 10.0236
    private val edappallyLon = 76.3116

    @Test
    fun testDirectDistanceCalculation() {
        val distance = DistanceCalculator.calculateDistanceKm(
            kochiLat, kochiLon,
            edappallyLat, edappallyLon
        )
        // Expected direct distance is ~4.8 km - 5.0 km
        assertTrue(distance in 4.5..5.2, "Distance should be approximately 4.8 km, but was $distance")
    }

    @Test
    fun testZeroDistanceForIdenticalCoordinates() {
        val distance = DistanceCalculator.calculateDistanceKm(kochiLat, kochiLon, kochiLat, kochiLon)
        assertEquals(0.0, distance)
    }

    @Test
    fun testBearingCalculation() {
        val bearing = DistanceCalculator.calculateBearingDegrees(
            kochiLat, kochiLon,
            edappallyLat, edappallyLon
        )
        // Northeast direction ~15 degrees
        assertTrue(bearing in 10..25, "Bearing should be approximately 15 degrees, but was $bearing")
    }

    @Test
    fun testTransitEtaEstimationNormalAndCongested() {
        val etaNormal = DistanceCalculator.estimateTransitEta(
            kochiLat, kochiLon,
            edappallyLat, edappallyLon,
            trafficMultiplier = 1.0
        )

        assertTrue(etaNormal.estimatedDurationMinutes in 12..16)
        assertEquals(false, etaNormal.isArrived)

        val etaMonsoon = DistanceCalculator.estimateTransitEta(
            kochiLat, kochiLon,
            edappallyLat, edappallyLon,
            trafficMultiplier = 1.4
        )

        assertTrue(etaMonsoon.estimatedDurationMinutes in 18..24)
    }

    @Test
    fun testArrivedThreshold() {
        val etaArrived = DistanceCalculator.estimateTransitEta(
            kochiLat, kochiLon,
            kochiLat + 0.0001, kochiLon,
            trafficMultiplier = 1.0
        )
        assertEquals(0, etaArrived.estimatedDurationMinutes)
        assertEquals(true, etaArrived.isArrived)
    }
}
