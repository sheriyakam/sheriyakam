package com.sheriyakam.location

import kotlinx.coroutines.flow.StateFlow

interface LocationTracker {
    /**
     * Observable state flow of current location and tracking state.
     */
    val trackingStatus: StateFlow<LocationTrackingStatus>

    /**
     * Checks if location permission has been granted by the host OS.
     */
    fun hasLocationPermission(): Boolean

    /**
     * Retrieves the last known or single-shot current location.
     */
    suspend fun getCurrentLocation(): Result<GeoCoordinates>

    /**
     * Starts continuous GPS location updates for active technician dispatch tracking.
     */
    fun startTracking(minIntervalMs: Long = 5000L, minDistanceMeters: Float = 10f)

    /**
     * Stops continuous location updates to preserve device battery life.
     */
    fun stopTracking()
}
