package com.sheriyakam.domain

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlin.math.roundToLong

/**
 * Payment Gateway Split-Payout & Escrow Utility (KMP Shared Domain)
 * Compatible with Razorpay Route, Cashfree Easy Split, and Stripe Connect.
 * Implements SAC 9987 18% GST (9% CGST + 9% SGST) and ISI spare parts tax.
 */
object PaymentSplit {
    const val COMMISSION_RATE: Double = 0.15 // 15% Platform Commission
    const val GST_RATE: Double = 0.18 // 18% GST (9% CGST + 9% SGST)

    /**
     * Converts INR Rupees to Paise (integer long)
     */
    fun rupeesToPaise(amountInRupees: Double): Long {
        return (amountInRupees * 100.0).roundToLong()
    }

    fun rupeesToPaise(amountInRupeesStr: String): Long {
        val parsed = amountInRupeesStr.toDoubleOrNull() ?: 0.0
        return rupeesToPaise(parsed)
    }

    private fun round2(value: Double): Double {
        return (value * 100.0).roundToLong() / 100.0
    }

    /**
     * Calculates marketplace breakdown between Platform, Technician, and GST
     */
    fun calculateSplitBreakdown(
        laborCharge: Double = 350.00,
        platformFee: Double = 29.00,
        materialsCharge: Double = 240.00,
        travelAllowance: Double = 0.00
    ): SplitBreakdown {
        // 1. Service & Labor (SAC 9987)
        val subtotalService = round2(laborCharge + platformFee)
        val cgstService = round2(subtotalService * 0.09)
        val sgstService = round2(subtotalService * 0.09)
        val totalServiceTax = round2(cgstService + sgstService)

        // 2. Materials (HSN 8536)
        val cgstMaterials = round2(materialsCharge * 0.09)
        val sgstMaterials = round2(materialsCharge * 0.09)
        val totalMaterialsTax = round2(cgstMaterials + sgstMaterials)

        // 3. Totals
        val totalTax = round2(totalServiceTax + totalMaterialsTax)
        val grandTotal = (subtotalService + materialsCharge + totalTax + travelAllowance).roundToLong()

        // 4. Split Distribution
        // Technician receives 85% of labor, 100% of materials, and 100% of travel allowance
        val technicianShareRupees = round2((laborCharge * 0.85) + materialsCharge + travelAllowance)
        val platformShareRupees = round2(grandTotal.toDouble() - technicianShareRupees)

        return SplitBreakdown(
            laborCharge = laborCharge,
            platformFee = platformFee,
            materialsCharge = materialsCharge,
            travelAllowance = travelAllowance,
            subtotalService = subtotalService,
            cgstService = cgstService,
            sgstService = sgstService,
            cgstMaterials = cgstMaterials,
            sgstMaterials = sgstMaterials,
            totalTax = totalTax,
            grandTotal = grandTotal,
            technicianShareRupees = technicianShareRupees,
            platformShareRupees = platformShareRupees,
            grandTotalPaise = rupeesToPaise(grandTotal.toDouble()),
            technicianSharePaise = rupeesToPaise(technicianShareRupees),
            platformSharePaise = rupeesToPaise(platformShareRupees)
        )
    }

    /**
     * Generates official Razorpay Route / Cashfree split order payload
     */
    fun buildSplitOrderPayload(
        orderId: String = "order_VF_2026_89102",
        technicianAccountId: String = "acc_TechRajesh_7731",
        corporateAccountId: String = "acc_VoltFix_Corporate_Main",
        isHighRiskJob: Boolean = false,
        breakdown: SplitBreakdown = calculateSplitBreakdown()
    ): SplitOrderPayload {
        return SplitOrderPayload(
            amount = breakdown.grandTotalPaise,
            currency = "INR",
            orderId = orderId,
            transfers = listOf(
                TransferInstruction(
                    account = technicianAccountId,
                    amount = breakdown.technicianSharePaise,
                    currency = "INR",
                    notes = TransferNotes(
                        type = "technician_labor_and_materials",
                        breakdown = "Labor: ₹${breakdown.laborCharge}, Materials: ₹${breakdown.materialsCharge}"
                    ),
                    onHold = isHighRiskJob
                ),
                TransferInstruction(
                    account = corporateAccountId,
                    amount = breakdown.platformSharePaise,
                    currency = "INR",
                    notes = TransferNotes(
                        type = "platform_commission_and_gst",
                        breakdown = "Commission: 15%, GST SAC 9987: ₹${breakdown.totalTax}"
                    ),
                    onHold = false
                )
            )
        )
    }
}

@Serializable
data class SplitBreakdown(
    val laborCharge: Double,
    val platformFee: Double,
    val materialsCharge: Double,
    val travelAllowance: Double,
    val subtotalService: Double,
    val cgstService: Double,
    val sgstService: Double,
    val cgstMaterials: Double,
    val sgstMaterials: Double,
    val totalTax: Double,
    val grandTotal: Long,
    val technicianShareRupees: Double,
    val platformShareRupees: Double,
    val grandTotalPaise: Long,
    val technicianSharePaise: Long,
    val platformSharePaise: Long
)

@Serializable
data class SplitOrderPayload(
    val amount: Long,
    val currency: String,
    @SerialName("order_id") val orderId: String,
    val transfers: List<TransferInstruction>
)

@Serializable
data class TransferInstruction(
    val account: String,
    val amount: Long,
    val currency: String,
    val notes: TransferNotes,
    @SerialName("on_hold") val onHold: Boolean
)

@Serializable
data class TransferNotes(
    val type: String,
    val breakdown: String
)
