package com.sheriyakam.location

import kotlin.math.*

object DistanceCalculator {
    const val EARTH_RADIUS_KM = 6371.0
    const val KERALA_URBAN_SPEED_KMH = 28.0
    const val ROAD_CURVATURE_FACTOR = 1.35 // Kerala coastal and town roads have detour ratio ~1.35x

    fun degreesToRadians(degrees: Double): Double {
        return (degrees * PI) / 180.0
    }

    fun radiansToDegrees(radians: Double): Double {
        return (radians * 180.0) / PI
    }

    /**
     * Calculates direct Haversine distance in kilometers between two geo-coordinates.
     */
    fun calculateDistanceKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val dLat = degreesToRadians(lat2 - lat1)
        val dLon = degreesToRadians(lon2 - lon1)

        val rLat1 = degreesToRadians(lat1)
        val rLat2 = degreesToRadians(lat2)

        val a = sin(dLat / 2.0).pow(2) + sin(dLon / 2.0).pow(2) * cos(rLat1) * cos(rLat2)
        val c = 2.0 * atan2(sqrt(a), sqrt(1.0 - a))

        return round(EARTH_RADIUS_KM * c * 100.0) / 100.0
    }

    /**
     * Calculates compass bearing heading in degrees (0..359).
     */
    fun calculateBearingDegrees(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Int {
        val rLat1 = degreesToRadians(lat1)
        val rLat2 = degreesToRadians(lat2)
        val dLon = degreesToRadians(lon2 - lon1)

        val y = sin(dLon) * cos(rLat2)
        val x = cos(rLat1) * sin(rLat2) - sin(rLat1) * cos(rLat2) * cos(dLon)

        val bearing = radiansToDegrees(atan2(y, x))
        return ((round(bearing).toInt() % 360) + 360) % 360
    }

    /**
     * Estimates transit duration in minutes for Kerala urban conditions.
     * Takes into account road detour curvature and traffic congestion multiplier.
     */
    fun estimateTransitEta(
        techLat: Double,
        techLon: Double,
        destinationLat: Double,
        destinationLon: Double,
        trafficMultiplier: Double = 1.0
    ): TechnicianTransitEta {
        val directKm = calculateDistanceKm(techLat, techLon, destinationLat, destinationLon)
        val bearing = calculateBearingDegrees(techLat, techLon, destinationLat, destinationLon)

        if (directKm <= 0.05) {
            return TechnicianTransitEta(
                directDistanceKm = directKm,
                estimatedRoadKm = 0.0,
                estimatedDurationMinutes = 0,
                bearingDegrees = bearing,
                isArrived = true
            )
        }

        val roadKm = round(directKm * ROAD_CURVATURE_FACTOR * 100.0) / 100.0
        val effectiveSpeedKmh = max(10.0, KERALA_URBAN_SPEED_KMH / trafficMultiplier)
        val durationHours = roadKm / effectiveSpeedKmh
        val minutes = max(1, ceil(durationHours * 60.0).toInt())

        return TechnicianTransitEta(
            directDistanceKm = directKm,
            estimatedRoadKm = roadKm,
            estimatedDurationMinutes = minutes,
            bearingDegrees = bearing,
            isArrived = false
        )
    }
}
