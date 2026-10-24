package com.sheriyakam.security

enum class BiometricStatus {
    SUCCESS,
    FAILED,
    NOT_ENROLLED,
    NOT_SUPPORTED,
    CANCELED
}

interface BiometricAuthenticator {
    fun isBiometricAvailable(): Boolean
    suspend fun authenticate(title: String, subtitle: String): BiometricStatus
}
