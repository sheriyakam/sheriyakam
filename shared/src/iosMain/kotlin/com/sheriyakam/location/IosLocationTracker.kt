package com.sheriyakam.location

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import platform.CoreLocation.*
import platform.Foundation.NSDate
import platform.Foundation.timeIntervalSince1970
import platform.darwin.NSObject

class IosLocationTracker : NSObject(), LocationTracker, CLLocationManagerDelegateProtocol {

    private val locationManager = CLLocationManager()

    private val _trackingStatus = MutableStateFlow(
        LocationTrackingStatus(
            isTracking = false,
            hasPermission = hasLocationPermission()
        )
    )
    override val trackingStatus: StateFlow<LocationTrackingStatus> = _trackingStatus.asStateFlow()

    init {
        locationManager.delegate = this
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.distanceFilter = 10.0 // 10 meters minimum update
    }

    override fun hasLocationPermission(): Boolean {
        val status = locationManager.authorizationStatus()
        return status == kCLAuthorizationStatusAuthorizedWhenInUse ||
                status == kCLAuthorizationStatusAuthorizedAlways
    }

    override suspend fun getCurrentLocation(): Result<GeoCoordinates> {
        if (!hasLocationPermission()) {
            return Result.failure(IllegalStateException("iOS Location authorization not granted"))
        }

        val location = locationManager.location
        return if (location != null) {
            val ts = (location.timestamp.timeIntervalSince1970 * 1000.0).toLong()
            Result.success(
                GeoCoordinates(
                    latitude = location.coordinate.latitude,
                    longitude = location.coordinate.longitude,
                    accuracyMeters = location.horizontalAccuracy.toFloat(),
                    altitudeMeters = location.altitude,
                    speedMps = location.speed.toFloat(),
                    timestampMs = ts
                )
            )
        } else {
            Result.failure(IllegalStateException("Location coordinate fix unavailable"))
        }
    }

    override fun startTracking(minIntervalMs: Long, minDistanceMeters: Float) {
        val status = locationManager.authorizationStatus()
        if (status == kCLAuthorizationStatusNotDetermined) {
            locationManager.requestWhenInUseAuthorization()
        }

        locationManager.distanceFilter = minDistanceMeters.toDouble()
        locationManager.startUpdatingLocation()

        _trackingStatus.value = _trackingStatus.value.copy(
            isTracking = true,
            hasPermission = hasLocationPermission()
        )
    }

    override fun stopTracking() {
        locationManager.stopUpdatingLocation()
        _trackingStatus.value = _trackingStatus.value.copy(isTracking = false)
    }

    override fun locationManager(manager: CLLocationManager, didUpdateLocations: List<*>) {
        val clLocation = didUpdateLocations.lastOrNull() as? CLLocation ?: return
        val ts = (clLocation.timestamp.timeIntervalSince1970 * 1000.0).toLong()

        val coords = GeoCoordinates(
            latitude = clLocation.coordinate.latitude,
            longitude = clLocation.coordinate.longitude,
            accuracyMeters = clLocation.horizontalAccuracy.toFloat(),
            altitudeMeters = clLocation.altitude,
            speedMps = clLocation.speed.toFloat(),
            timestampMs = ts
        )

        _trackingStatus.value = _trackingStatus.value.copy(
            lastLocation = coords,
            errorMessage = null
        )
    }

    override fun locationManager(manager: CLLocationManager, didFailWithError: platform.Foundation.NSError) {
        _trackingStatus.value = _trackingStatus.value.copy(
            errorMessage = didFailWithError.localizedDescription
        )
    }

    override fun locationManagerDidChangeAuthorization(manager: CLLocationManager) {
        _trackingStatus.value = _trackingStatus.value.copy(
            hasPermission = hasLocationPermission()
        )
    }
}
