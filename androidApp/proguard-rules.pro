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

# Preserve Domain, Repository, and Network Models
-keep class com.sheriyakam.domain.** { *; }
-keep class com.sheriyakam.network.** { *; }
-keep class com.sheriyakam.repository.** { *; }
-keep class com.sheriyakam.storage.** { *; }
-keep class com.sheriyakam.security.** { *; }

# Jetpack Compose Material 3
-keepclassmembers class * extends androidx.compose.runtime.State { *; }
-keep class androidx.compose.material3.** { *; }

# Ktor 3.0 Client & Coroutines
-keep class io.ktor.** { *; }
-keep class kotlinx.coroutines.** { *; }
