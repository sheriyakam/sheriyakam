package com.sheriyakam.network

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.engine.HttpClientEngine
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

class SheriyakamApiClient(
    engine: HttpClientEngine? = null,
    private val baseUrl: String = "http://localhost:5000"
) {
    private val jsonConfig = Json {
        ignoreUnknownKeys = true
        isLenient = true
        prettyPrint = false
        encodeDefaults = true
    }

    val httpClient: HttpClient = if (engine != null) {
        HttpClient(engine) {
            install(ContentNegotiation) {
                json(jsonConfig)
            }
        }
    } else {
        HttpClient {
            install(ContentNegotiation) {
                json(jsonConfig)
            }
        }
    }

    suspend fun checkHealth(): HealthResponse {
        return httpClient.get("$baseUrl/api/health").body()
    }

    suspend fun submitLead(request: LeadSubmissionRequest): LeadSubmissionResponse {
        return httpClient.post("$baseUrl/api/leads") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }

    suspend fun triageProblem(request: TriageApiRequest): TriageApiResponse {
        return httpClient.post("$baseUrl/api/triage") {
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body()
    }

    suspend fun syncQueuedMutation(mutation: QueuedMutation): Result<String> {
        return try {
            val response = httpClient.post("$baseUrl${mutation.endpoint}") {
                contentType(ContentType.Application.Json)
                header("X-Idempotency-Key", mutation.idempotencyKey)
                setBody(mutation.payloadJson)
            }
            if (response.status.isSuccess()) {
                Result.success(response.bodyAsText())
            } else {
                Result.failure(Exception("HTTP Error ${response.status.value}: ${response.bodyAsText()}"))
            }
        } catch (e: Throwable) {
            Result.failure(e)
        }
    }

    suspend fun processQueue(queue: OfflineMutationQueue): Int {
        val pending = queue.getPending()
        var successCount = 0
        for (mutation in pending) {
            queue.markSyncing(mutation.id)
            val result = syncQueuedMutation(mutation)
            if (result.isSuccess) {
                queue.markSynced(mutation.id)
                successCount++
            } else {
                queue.markFailed(mutation.id, result.exceptionOrNull()?.message)
            }
        }
        return successCount
    }
}
