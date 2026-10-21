package com.sheriyakam.domain

import kotlinx.serialization.Serializable

@Serializable
enum class UrgencyTier {
    STANDARD,
    EMERGENCY
}

@Serializable
data class TriageResult(
    val matchedServiceId: String,
    val matchedServiceName: String,
    val estimatedPrice: String,
    val urgency: UrgencyTier,
    val diagnosisNote: String,
    val clarifyingQuestion: String
)

object TriageEngine {

    fun triageProblem(problemText: String?): TriageResult {
        val text = (problemText ?: "").lowercase()

        if (text.contains("fan") || text.contains("kattu") || text.contains("bearing") || text.contains("capacitor") || text.contains("slow")) {
            return TriageResult(
                matchedServiceId = "fan-repair",
                matchedServiceName = "Ceiling & Exhaust Fan Repair",
                estimatedPrice = "₹249",
                urgency = UrgencyTier.STANDARD,
                diagnosisNote = "Likely a degraded capacitor or dry bearing causing speed drop/humming.",
                clarifyingQuestion = "Is the fan making a humming sound or rotating very slowly?"
            )
        }

        if (text.contains("ac") || text.contains("cool") || text.contains("leak") || text.contains("air conditioner") || text.contains("gas")) {
            return TriageResult(
                matchedServiceId = "ac-repair",
                matchedServiceName = "AC Breakdown & Gas Charging",
                estimatedPrice = "₹599 - ₹1,499",
                urgency = UrgencyTier.STANDARD,
                diagnosisNote = "Probable gas leakage, blocked condenser coil, or faulty compressor capacitor.",
                clarifyingQuestion = "Is the indoor unit blowing air that is not cold, or is water dripping?"
            )
        }

        if (text.contains("mcb") || text.contains("trip") || text.contains("spark") || text.contains("shock") || text.contains("smell") || text.contains("fire") || text.contains("smoke")) {
            return TriageResult(
                matchedServiceId = "emergency-repair",
                matchedServiceName = "Emergency Repair Specialist (90-Min)",
                estimatedPrice = "₹449 - ₹899",
                urgency = UrgencyTier.EMERGENCY,
                diagnosisNote = "Possible insulation breakdown, neutral fault, or overload tripping the RCCB/MCB.",
                clarifyingQuestion = "Are all lights off in the house, or is only one specific circuit tripping?"
            )
        }

        if (text.contains("camera") || text.contains("cctv") || text.contains("dvr") || text.contains("nvr") || text.contains("view") || text.contains("offline")) {
            return TriageResult(
                matchedServiceId = "cctv-setup",
                matchedServiceName = "CCTV Installation & Surveillance",
                estimatedPrice = "₹499",
                urgency = UrgencyTier.STANDARD,
                diagnosisNote = "May be an SMPS power supply failure or disconnected BNC video cable.",
                clarifyingQuestion = "How many camera channels are installed, and is mobile remote viewing required?"
            )
        }

        if (text.contains("wire") || text.contains("renovat") || text.contains("switch") || text.contains("db") || text.contains("house") || text.contains("phase")) {
            return TriageResult(
                matchedServiceId = "house-rewiring",
                matchedServiceName = "House Rewiring & DB Renovation",
                estimatedPrice = "₹1,499+",
                urgency = UrgencyTier.STANDARD,
                diagnosisNote = "Aging wiring or unbalanced load across phases.",
                clarifyingQuestion = "How many bedrooms/floors is the property, and is single-phase or 3-phase power used?"
            )
        }

        return TriageResult(
            matchedServiceId = "general-consult",
            matchedServiceName = "General Electrical Diagnostic",
            estimatedPrice = "₹299",
            urgency = UrgencyTier.STANDARD,
            diagnosisNote = "General inspection required by certified wireman.",
            clarifyingQuestion = "Could you describe which appliance or room is experiencing the issue?"
        )
    }

    fun draftQuotation(roughNotes: String): String {
        val trimmed = roughNotes.trim()
        return "⚡ *SHERIYAKAM ESTIMATED QUOTATION*\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "📋 *Scope of Work:* $trimmed\n\n" +
            "🛠️ *Labor & Diagnostic:* ₹350\n" +
            "📦 *Estimated Spares:* ₹250 (Subject to on-site testing)\n" +
            "🛡️ *Platform Guarantee:* 30-Day Workmanship Warranty\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "💰 *Estimated Total:* ₹600\n\n" +
            "_Final bill based on actual materials used. No surprise charges._"
    }

    fun generateWeeklyDigest(weeklyRevenue: Long, completedJobs: Int, repeatCustomerRate: Int): String {
        return "📊 *SHERIYAKAM EXECUTIVE WEEKLY SUMMARY*\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "💰 *Completed Revenue:* ₹$weeklyRevenue\n" +
            "⚡ *Jobs Completed:* $completedJobs successful dispatches\n" +
            "🔁 *Repeat Client Rate:* $repeatCustomerRate%\n" +
            "⭐ *Avg Customer Rating:* 4.9 / 5.0 (28 verified reviews)\n" +
            "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
            "🚀 *Status:* On-demand wireman capacity active across Kerala."
    }
}
