# Proguard & R8 rules for Sheriyakam Native Android (Kotlin 2.0 + Jetpack Compose + KMP)

# Kotlin Serialization & Shared KMP Domain Models
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.SerializationKt
-keepclassmembers class * {
    @kotlinx.serialization.SerialName <fields>;
}
-keepclasseswithmembers class * {
    companion object;
}

# Preserve Domain, Repository, Location, Notifications, Payment, and Network Models
-keep class com.sheriyakam.domain.** { *; }
-keep class com.sheriyakam.network.** { *; }
-keep class com.sheriyakam.repository.** { *; }
-keep class com.sheriyakam.storage.** { *; }
-keep class com.sheriyakam.security.** { *; }
-keep class com.sheriyakam.location.** { *; }
-keep class com.sheriyakam.notifications.** { *; }
-keep class com.sheriyakam.payment.** { *; }
-keep class com.sheriyakam.android.workers.** { *; }

# Jetpack Compose Material 3 & AndroidX
-keepclassmembers class * extends androidx.compose.runtime.State { *; }
-keep class androidx.compose.material3.** { *; }
-keep class androidx.work.** { *; }

# Razorpay Android SDK
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Ktor 3.0 Client & Coroutines
-keep class io.ktor.** { *; }
-keep class kotlinx.coroutines.** { *; }
