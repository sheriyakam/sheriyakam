package com.sheriyakam.network

import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.headersOf
import io.ktor.utils.io.ByteReadChannel
import kotlinx.coroutines.test.runTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SheriyakamApiClientTest {

    @Test
    fun testCheckHealthReturnsActiveStatus() = runTest {
        val mockEngine = MockEngine { request ->
            assertEquals("/api/health", request.url.encodedPath)
            respond(
                content = ByteReadChannel("""{"status":"active","message":"Sheriyakam Backend API is running properly"}"""),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = SheriyakamApiClient(engine = mockEngine, baseUrl = "http://localhost:5000")
        val response = client.checkHealth()

        assertEquals("active", response.status)
        assertEquals("Sheriyakam Backend API is running properly", response.message)
    }

    @Test
    fun testSubmitLeadSendsPayloadAndReceivesConfirmation() = runTest {
        val mockEngine = MockEngine { request ->
            assertEquals("/api/leads", request.url.encodedPath)
            respond(
                content = ByteReadChannel("""{"success":true,"leadId":"lead_9988","message":"Lead registered successfully"}"""),
                status = HttpStatusCode.Created,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = SheriyakamApiClient(engine = mockEngine, baseUrl = "http://localhost:5000")
        val request = LeadSubmissionRequest(
            customerName = "Rahul Nair",
            customerPhone = "+919847011223",
            district = "Ernakulam",
            taluk = "Kochi",
            serviceCategory = "Electrical",
            description = "Main breaker keeps tripping under AC load",
            urgency = "EMERGENCY"
        )
        val response = client.submitLead(request)

        assertTrue(response.success)
        assertEquals("lead_9988", response.leadId)
        assertEquals("Lead registered successfully", response.message)
    }

    @Test
    fun testTriageProblemInvokesBackendAiEndpoint() = runTest {
        val mockEngine = MockEngine { request ->
            assertEquals("/api/triage", request.url.encodedPath)
            respond(
                content = ByteReadChannel("""{
                    "category":"ELECTRICAL_SAFETY",
                    "urgencyTier":"EMERGENCY",
                    "estimatedPriceMin":349,
                    "estimatedPriceMax":799,
                    "requiresKselbLicense":true,
                    "summaryEn":"Emergency tripping repair required",
                    "summaryMl":"അടിയന്തര ട്രിപ്പിംഗ് റിപ്പയർ ആവശ്യമാണ്"
                }"""),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = SheriyakamApiClient(engine = mockEngine, baseUrl = "http://localhost:5000")
        val result = client.triageProblem(TriageApiRequest(problemDescription = "Sparks from DB box"))

        assertEquals("ELECTRICAL_SAFETY", result.category)
        assertEquals("EMERGENCY", result.urgencyTier)
        assertEquals(349, result.estimatedPriceMin)
        assertTrue(result.requiresKselbLicense)
    }

    @Test
    fun testSyncQueuedMutationAttachesIdempotencyKeyHeader() = runTest {
        var capturedHeader: String? = null
        val mockEngine = MockEngine { request ->
            capturedHeader = request.headers["X-Idempotency-Key"]
            respond(
                content = ByteReadChannel("""{"success":true}"""),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = SheriyakamApiClient(engine = mockEngine, baseUrl = "http://localhost:5000")
        val queue = OfflineMutationQueue()
        val mutation = queue.enqueue("/api/leads", "POST", """{"test":true}""", idempotencyKey = "idemp-xyz-789")

        val result = client.syncQueuedMutation(mutation)
        assertTrue(result.isSuccess)
        assertEquals("idemp-xyz-789", capturedHeader)
    }

    @Test
    fun testProcessQueueProcessesAllPendingMutations() = runTest {
        val mockEngine = MockEngine {
            respond(
                content = ByteReadChannel("""{"success":true}"""),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, "application/json")
            )
        }

        val client = SheriyakamApiClient(engine = mockEngine, baseUrl = "http://localhost:5000")
        val queue = OfflineMutationQueue()
        queue.enqueue("/api/leads", "POST", """{"order":1}""")
        queue.enqueue("/api/leads", "POST", """{"order":2}""")

        assertEquals(2, queue.getPending().size)
        val syncedCount = client.processQueue(queue)
        assertEquals(2, syncedCount)
        assertEquals(0, queue.getPending().size)
    }
}
