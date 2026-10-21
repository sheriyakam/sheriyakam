package com.sheriyakam.domain

import kotlinx.serialization.Serializable

@Serializable
data class PhoneValidationResult(
    val isValid: Boolean,
    val normalized: String,
    val error: String?
)

object PhoneValidator {

    private val LEADING_DIGIT_REGEX = Regex("^[6-9]")

    fun validate(input: String?): PhoneValidationResult {
        if (input.isNullOrBlank()) {
            return PhoneValidationResult(
                isValid = false,
                normalized = "",
                error = "Phone number is required"
            )
        }

        val digits = input.filter { it.isDigit() }

        // 10 digits directly (e.g. 9876543210)
        if (digits.length == 10) {
            if (!LEADING_DIGIT_REGEX.containsMatchIn(digits)) {
                return PhoneValidationResult(
                    isValid = false,
                    normalized = "",
                    error = "Mobile number must start with 6, 7, 8, or 9"
                )
            }
            return PhoneValidationResult(
                isValid = true,
                normalized = "+91$digits",
                error = null
            )
        }

        // 12 digits with country code (e.g. 919876543210)
        if (digits.length == 12 && digits.startsWith("91")) {
            val local = digits.substring(2)
            if (!LEADING_DIGIT_REGEX.containsMatchIn(local)) {
                return PhoneValidationResult(
                    isValid = false,
                    normalized = "",
                    error = "Mobile number must start with 6, 7, 8, or 9"
                )
            }
            return PhoneValidationResult(
                isValid = true,
                normalized = "+91$local",
                error = null
            )
        }

        // 11 digits starting with 0 (e.g. 09876543210)
        if (digits.length == 11 && digits.startsWith("0")) {
            val local = digits.substring(1)
            if (!LEADING_DIGIT_REGEX.containsMatchIn(local)) {
                return PhoneValidationResult(
                    isValid = false,
                    normalized = "",
                    error = "Mobile number must start with 6, 7, 8, or 9"
                )
            }
            return PhoneValidationResult(
                isValid = true,
                normalized = "+91$local",
                error = null
            )
        }

        return PhoneValidationResult(
            isValid = false,
            normalized = "",
            error = "Please enter a valid 10-digit mobile number"
        )
    }
}
