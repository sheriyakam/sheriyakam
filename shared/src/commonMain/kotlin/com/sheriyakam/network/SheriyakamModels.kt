package com.sheriyakam.network

import kotlinx.serialization.Serializable

@Serializable
enum class MutationStatus {
    PENDING,
    SYNCING,
    SYNCED,
    FAILED
}

@Serializable
data class QueuedMutation(
    val id: String,
    val endpoint: String,
    val httpMethod: String,
    val payloadJson: String,
    val idempotencyKey: String,
    val createdAtTimestamp: Long,
    val retryCount: Int = 0,
    val status: MutationStatus = MutationStatus.PENDING,
    val lastError: String? = null
)

@Serializable
data class HealthResponse(
    val status: String,
    val message: String
)

@Serializable
data class LeadSubmissionRequest(
    val customerName: String,
    val customerPhone: String,
    val district: String,
    val taluk: String,
    val serviceCategory: String,
    val description: String,
    val urgency: String = "STANDARD",
    val scheduledTime: String? = null,
    val address: String? = null
)

@Serializable
data class LeadSubmissionResponse(
    val success: Boolean,
    val leadId: String? = null,
    val message: String? = null,
    val error: String? = null
)

@Serializable
data class TriageApiRequest(
    val problemDescription: String,
    val language: String = "en"
)

@Serializable
data class TriageApiResponse(
    val category: String,
    val urgencyTier: String,
    val estimatedPriceMin: Int,
    val estimatedPriceMax: Int,
    val requiresKselbLicense: Boolean,
    val summaryEn: String,
    val summaryMl: String
)

@Serializable
data class ApiResponse<T>(
    val success: Boolean,
    val data: T? = null,
    val error: String? = null
)
