package com.sheriyakam.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.sheriyakam.android.navigation.NavigationState
import com.sheriyakam.android.navigation.SheriyakamNativeApp
import com.sheriyakam.repository.BookingRepository

class MainActivity : ComponentActivity() {

    private val repository = BookingRepository()
    private val navigationState = NavigationState()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Process incoming deep link
        intent?.dataString?.let { uri ->
            navigationState.handleDeepLink(uri)
        }

        setContent {
            val sheriyakamColorScheme = darkColorScheme(
                primary = Color(0xFFF59E0B), // Volt Gold
                background = Color(0xFF0A0F1C), // Deep Kerala Midnight Navy
                surface = Color(0xFF131B2E),
                onPrimary = Color(0xFF000000),
                onBackground = Color(0xFFFFFFFF),
                onSurface = Color(0xFFE2E8F0)
            )

            MaterialTheme(colorScheme = sheriyakamColorScheme) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SheriyakamNativeApp(
                        repository = repository,
                        navState = navigationState
                    )
                }
            }
        }
    }
}
