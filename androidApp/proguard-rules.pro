# Proguard rules for Sheriyakam Android (Kotlin + Jetpack Compose + KMP)

# Kotlin Serialization
-keepattributes *Annotation*, InnerClasses
-dontnote kotlinx.serialization.SerializationKt
-keepclassmembers class * {
    @kotlinx.serialization.SerialName <fields>;
}
-keepclasseswithmembers class * {
    companion object;
}

# Jetpack Compose
-keepclassmembers class * extends androidx.compose.runtime.State { *; }

# Ktor Client
-keep class io.ktor.** { *; }
