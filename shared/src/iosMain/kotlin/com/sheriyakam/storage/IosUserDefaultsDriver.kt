package com.sheriyakam.storage

import platform.Foundation.NSUserDefaults

class IosUserDefaultsDriver(
    private val userDefaults: NSUserDefaults = NSUserDefaults.standardUserDefaults
) : KeyValueStorageDriver {

    override fun getString(key: String): String? {
        return userDefaults.stringForKey(key)
    }

    override fun putString(key: String, value: String) {
        userDefaults.setObject(value, forKey = key)
    }

    override fun remove(key: String) {
        userDefaults.removeObjectForKey(key)
    }

    override fun clear() {
        val dict = userDefaults.dictionaryRepresentation()
        for (key in dict.keys) {
            userDefaults.removeObjectForKey(key as String)
        }
    }
}
