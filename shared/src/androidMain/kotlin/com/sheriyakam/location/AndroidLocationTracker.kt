package com.sheriyakam.location

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import androidx.core.content.ContextCompat
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCancellableCoroutine

class AndroidLocationTracker(
    private val context: Context
) : LocationTracker, LocationListener {

    private val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager

    private val _trackingStatus = MutableStateFlow(
        LocationTrackingStatus(
            isTracking = false,
            hasPermission = hasLocationPermission()
        )
    )
    override val trackingStatus: StateFlow<LocationTrackingStatus> = _trackingStatus.asStateFlow()

    override fun hasLocationPermission(): Boolean {
        val fineLocation = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val coarseLocation = ContextCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        return fineLocation || coarseLocation
    }

    override suspend fun getCurrentLocation(): Result<GeoCoordinates> = suspendCancellableCoroutine { continuation ->
        if (!hasLocationPermission()) {
            continuation.resume(Result.failure(SecurityException("Location permission not granted")))
            return@suspendCancellableCoroutine
        }

        val lm = locationManager
        if (lm == null) {
            continuation.resume(Result.failure(IllegalStateException("Location service unavailable")))
            return@suspendCancellableCoroutine
        }

        try {
            val isGpsEnabled = lm.isProviderEnabled(LocationManager.GPS_PROVIDER)
            val isNetworkEnabled = lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)

            val provider = when {
                isGpsEnabled -> LocationManager.GPS_PROVIDER
                isNetworkEnabled -> LocationManager.NETWORK_PROVIDER
                else -> null
            }

            if (provider == null) {
                continuation.resume(Result.failure(IllegalStateException("No location provider enabled")))
                return@suspendCancellableCoroutine
            }

            val lastKnown: Location? = try {
                lm.getLastKnownLocation(provider)
            } catch (e: SecurityException) {
                null
            }

            if (lastKnown != null) {
                val coords = GeoCoordinates(
                    latitude = lastKnown.latitude,
                    longitude = lastKnown.longitude,
                    accuracyMeters = lastKnown.accuracy,
                    altitudeMeters = lastKnown.altitude,
                    speedMps = lastKnown.speed,
                    timestampMs = lastKnown.time
                )
                continuation.resume(Result.success(coords))
            } else {
                continuation.resume(Result.failure(IllegalStateException("Location fix not yet acquired")))
            }
        } catch (e: Exception) {
            continuation.resume(Result.failure(e))
        }
    }

    override fun startTracking(minIntervalMs: Long, minDistanceMeters: Float) {
        if (!hasLocationPermission()) {
            _trackingStatus.value = _trackingStatus.value.copy(
                hasPermission = false,
                errorMessage = "Location permission denied"
            )
            return
        }

        val lm = locationManager ?: return

        try {
            if (lm.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
                lm.requestLocationUpdates(
                    LocationManager.GPS_PROVIDER,
                    minIntervalMs,
                    minDistanceMeters,
                    this
                )
            } else if (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
                lm.requestLocationUpdates(
                    LocationManager.NETWORK_PROVIDER,
                    minIntervalMs,
                    minDistanceMeters,
                    this
                )
            }

            _trackingStatus.value = _trackingStatus.value.copy(
                isTracking = true,
                hasPermission = true,
                errorMessage = null
            )
        } catch (e: SecurityException) {
            _trackingStatus.value = _trackingStatus.value.copy(
                isTracking = false,
                errorMessage = e.message
            )
        }
    }

    override fun stopTracking() {
        locationManager?.removeUpdates(this)
        _trackingStatus.value = _trackingStatus.value.copy(isTracking = false)
    }

    override fun onLocationChanged(location: Location) {
        val coords = GeoCoordinates(
            latitude = location.latitude,
            longitude = location.longitude,
            accuracyMeters = location.accuracy,
            altitudeMeters = location.altitude,
            speedMps = location.speed,
            timestampMs = location.time
        )
        _trackingStatus.value = _trackingStatus.value.copy(
            lastLocation = coords,
            errorMessage = null
        )
    }

    @Deprecated("Deprecated in Java")
    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
    override fun onProviderEnabled(provider: String) {}
    override fun onProviderDisabled(provider: String) {}
}
