package com.sheriyakam.storage

/**
 * Platform-independent key-value storage driver.
 * Implemented on Android via EncryptedSharedPreferences / DataStore,
 * on iOS via Keychain / NSUserDefaults, and in-memory for testing.
 */
interface KeyValueStorageDriver {
    fun getString(key: String): String?
    fun putString(key: String, value: String)
    fun remove(key: String)
    fun clear()
}
