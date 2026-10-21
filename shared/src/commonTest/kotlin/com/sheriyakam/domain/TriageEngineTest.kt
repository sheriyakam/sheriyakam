package com.sheriyakam.domain

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TriageEngineTest {

    @Test
    fun testMapsElectricalFanIssuesToStandardUrgency() {
        val result = TriageEngine.triageProblem("Ceiling fan is spinning very slow and making a kattu sound")
        assertEquals("fan-repair", result.matchedServiceId)
        assertEquals("Ceiling & Exhaust Fan Repair", result.matchedServiceName)
        assertEquals(UrgencyTier.STANDARD, result.urgency)
        assertTrue(result.diagnosisNote.contains("capacitor") || result.diagnosisNote.contains("bearing"))
    }

    @Test
    fun testClassifiesSparkingAndMcbTrippingAsEmergencyTier() {
        val result = TriageEngine.triageProblem("Main MCB trip and there is spark and burning smell near DB box")
        assertEquals("emergency-repair", result.matchedServiceId)
        assertEquals("Emergency Repair Specialist (90-Min)", result.matchedServiceName)
        assertEquals(UrgencyTier.EMERGENCY, result.urgency)
        assertTrue(result.diagnosisNote.contains("insulation") || result.diagnosisNote.contains("overload"))
    }

    @Test
    fun testMapsAcCoolingAndGasIssues() {
        val result = TriageEngine.triageProblem("AC is not cooling, air conditioner gas might be low")
        assertEquals("ac-repair", result.matchedServiceId)
        assertEquals("AC Breakdown & Gas Charging", result.matchedServiceName)
        assertEquals(UrgencyTier.STANDARD, result.urgency)
    }

    @Test
    fun testMapsCctvOfflineIssues() {
        val result = TriageEngine.triageProblem("CCTV cameras are offline and DVR monitor shows no video feed")
        assertEquals("cctv-setup", result.matchedServiceId)
        assertEquals("CCTV Installation & Surveillance", result.matchedServiceName)
        assertEquals(UrgencyTier.STANDARD, result.urgency)
    }

    @Test
    fun testDraftsFormattedQuotationWith30DayWarranty() {
        val quote = TriageEngine.draftQuotation("Fix 2 ceiling fans and replace burnt switch")
        assertTrue(quote.contains("SHERIYAKAM ESTIMATED QUOTATION"))
        assertTrue(quote.contains("30-Day Workmanship Warranty"))
        assertTrue(quote.contains("₹600"))
    }

    @Test
    fun testGeneratesExecutiveWeeklyDigest() {
        val digest = TriageEngine.generateWeeklyDigest(
            weeklyRevenue = 45000L,
            completedJobs = 38,
            repeatCustomerRate = 42
        )
        assertTrue(digest.contains("SHERIYAKAM EXECUTIVE WEEKLY SUMMARY"))
        assertTrue(digest.contains("38 successful dispatches"))
        assertTrue(digest.contains("4.9 / 5.0"))
    }
}
