package com.sheriyakam.storage

import android.content.Context
import android.content.SharedPreferences

class AndroidSharedPreferencesDriver(context: Context, name: String = "sheriyakam_prefs") : KeyValueStorageDriver {
    private val prefs: SharedPreferences = context.getSharedPreferences(name, Context.MODE_PRIVATE)

    override fun getString(key: String): String? = prefs.getString(key, null)

    override fun putString(key: String, value: String) {
        prefs.edit().putString(key, value).apply()
    }

    override fun remove(key: String) {
        prefs.edit().remove(key).apply()
    }

    override fun clear() {
        prefs.edit().clear().apply()
    }
}
