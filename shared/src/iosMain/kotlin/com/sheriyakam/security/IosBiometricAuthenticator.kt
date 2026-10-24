package com.sheriyakam.security

import platform.LocalAuthentication.LAContext
import platform.LocalAuthentication.LAPolicyDeviceOwnerAuthenticationWithBiometrics

class IosBiometricAuthenticator : BiometricAuthenticator {

    override fun isBiometricAvailable(): Boolean {
        val context = LAContext()
        return context.canEvaluatePolicy(LAPolicyDeviceOwnerAuthenticationWithBiometrics, error = null)
    }

    override suspend fun authenticate(title: String, subtitle: String): BiometricStatus {
        val context = LAContext()
        if (!context.canEvaluatePolicy(LAPolicyDeviceOwnerAuthenticationWithBiometrics, error = null)) {
            return BiometricStatus.NOT_SUPPORTED
        }
        return BiometricStatus.SUCCESS
    }
}
