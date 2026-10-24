package com.sheriyakam.security

import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class BiometricAuthenticatorTest {

    private class MockBiometricAuthenticator(
        var available: Boolean = true,
        var resultToReturn: BiometricStatus = BiometricStatus.SUCCESS
    ) : BiometricAuthenticator {
        override fun isBiometricAvailable(): Boolean = available

        override suspend fun authenticate(title: String, subtitle: String): BiometricStatus {
            if (!available) return BiometricStatus.NOT_SUPPORTED
            return resultToReturn
        }
    }

    @Test
    fun testSuccessfulBiometricAuthenticationReturnsSuccessStatus() = runTest {
        val auth = MockBiometricAuthenticator(available = true, resultToReturn = BiometricStatus.SUCCESS)
        assertTrue(auth.isBiometricAvailable())
        val status = auth.authenticate("KSELB Wireman Verification", "Confirm fingerprint for check-in")
        assertEquals(BiometricStatus.SUCCESS, status)
    }

    @Test
    fun testUnsupportedBiometricsReturnsNotSupportedStatus() = runTest {
        val auth = MockBiometricAuthenticator(available = false)
        assertFalse(auth.isBiometricAvailable())
        val status = auth.authenticate("Biometric Login", "Verify Identity")
        assertEquals(BiometricStatus.NOT_SUPPORTED, status)
    }

    @Test
    fun testFailedAuthenticationHandlesLockoutGracefully() = runTest {
        val auth = MockBiometricAuthenticator(available = true, resultToReturn = BiometricStatus.FAILED)
        val status = auth.authenticate("Secure Check-In", "Biometric Scan")
        assertEquals(BiometricStatus.FAILED, status)
    }
}
