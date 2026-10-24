package com.sheriyakam.android.navigation

import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.sheriyakam.android.ui.*
import com.sheriyakam.domain.LocalizationEngine
import com.sheriyakam.repository.BookingRepository

sealed class Screen(val route: String) {
    data object Home : Screen("home")
    data object SmartTriage : Screen("smart_triage")
    data object BookingCheckout : Screen("checkout/{serviceId}/{price}") {
        fun createRoute(serviceId: String, price: Int) = "checkout/$serviceId/$price"
    }
    data object ActiveDispatch : Screen("dispatch/{bookingId}") {
        fun createRoute(bookingId: String) = "dispatch/$bookingId"
    }
}

class NavigationState {
    var currentScreen by mutableStateOf<Screen>(Screen.Home)
        private set
    var activeBookingId by mutableStateOf<String?>(null)
        private set

    fun navigateTo(screen: Screen) {
        currentScreen = screen
    }

    fun navigateToDispatch(bookingId: String) {
        activeBookingId = bookingId
        currentScreen = Screen.ActiveDispatch
    }

    fun handleDeepLink(uriString: String): Boolean {
        return when {
            uriString.contains("/triage") || uriString.contains("smart-triage") -> {
                navigateTo(Screen.SmartTriage)
                true
            }
            uriString.contains("/dispatch/") -> {
                val bookingId = uriString.substringAfterLast("/")
                navigateToDispatch(bookingId)
                true
            }
            else -> false
        }
    }
}

@Composable
fun SheriyakamNativeApp(
    repository: BookingRepository,
    navState: NavigationState = remember { NavigationState() },
    modifier: Modifier = Modifier
) {
    var selectedLanguage by remember { mutableStateOf("en") }
    val bookings by repository.bookings.collectAsState()

    when (val screen = navState.currentScreen) {
        is Screen.Home, is Screen.BookingCheckout -> {
            BookingCheckoutScreen(
                baseServicePrice = 499,
                requiresKselbWireman = true,
                selectedLanguage = selectedLanguage,
                onLanguageChange = { selectedLanguage = it },
                onConfirmBooking = {
                    val newBooking = repository.createBooking(
                        customerName = "Resident Customer",
                        customerPhone = "+91 94470 12345",
                        service = LocalizationEngine.get("emergency_tag", selectedLanguage),
                        serviceType = "Electrical",
                        district = "Ernakulam",
                        taluk = "Kochi",
                        address = "Marine Drive, Kochi",
                        price = 499,
                        isEmergency = true
                    )
                    navState.navigateToDispatch(newBooking.id)
                }
            )
        }
        is Screen.SmartTriage -> {
            SmartTriageScreen(
                onTriageComplete = { triageResult ->
                    navState.navigateTo(Screen.BookingCheckout)
                },
                onBackClick = { navState.navigateTo(Screen.Home) }
            )
        }
        is Screen.ActiveDispatch -> {
            val bookingId = navState.activeBookingId ?: bookings.firstOrNull()?.id
            val booking = bookings.find { it.id == bookingId } ?: bookings.firstOrNull()

            if (booking != null) {
                ActiveDispatchTrackerScreen(
                    booking = booking,
                    remainingMinutes = 55,
                    slaStatus = "ON_TRACK",
                    onVerifyCheckInOtp = { otp ->
                        repository.verifyCheckInOtp(booking.id, otp)
                    },
                    onVerifyCompletionOtp = { otp ->
                        repository.verifyCompletionOtp(booking.id, otp)
                    },
                    onRaiseDispute = { reason ->
                        repository.disputeBooking(booking.id, reason)
                    },
                    onBackClick = { navState.navigateTo(Screen.Home) }
                )
            } else {
                BookingCheckoutScreen(
                    baseServicePrice = 499,
                    requiresKselbWireman = true,
                    selectedLanguage = selectedLanguage,
                    onLanguageChange = { selectedLanguage = it },
                    onConfirmBooking = { navState.navigateTo(Screen.Home) }
                )
            }
        }
    }
}
