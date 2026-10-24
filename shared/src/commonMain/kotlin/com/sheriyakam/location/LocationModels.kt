package com.sheriyakam.location

import kotlinx.serialization.Serializable

@Serializable
data class GeoCoordinates(
    val latitude: Double,
    val longitude: Double,
    val accuracyMeters: Float? = null,
    val altitudeMeters: Double? = null,
    val speedMps: Float? = null,
    val timestampMs: Long
)

@Serializable
data class LocationTrackingStatus(
    val isTracking: Boolean,
    val lastLocation: GeoCoordinates? = null,
    val hasPermission: Boolean = false,
    val errorMessage: String? = null
)

@Serializable
data class TechnicianTransitEta(
    val directDistanceKm: Double,
    val estimatedRoadKm: Double,
    val estimatedDurationMinutes: Int,
    val bearingDegrees: Int,
    val isArrived: Boolean
)
