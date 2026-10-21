package com.sheriyakam.domain

import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class PaymentSplitTest {

    @Test
    fun testRupeesToPaiseConvertsWithoutFloatingPointError() {
        assertEquals(10000L, PaymentSplit.rupeesToPaise(100.0))
        assertEquals(4950L, PaymentSplit.rupeesToPaise(49.50))
        assertEquals(73025L, PaymentSplit.rupeesToPaise(730.25))
        assertEquals(29900L, PaymentSplit.rupeesToPaise("299.00"))
    }

    @Test
    fun testCalculateSplitBreakdownComputesAccurateTaxesAndShares() {
        val breakdown = PaymentSplit.calculateSplitBreakdown(
            laborCharge = 400.00,
            platformFee = 29.00,
            materialsCharge = 300.00,
            travelAllowance = 50.00
        )

        // 1. Service subtotal = 400 + 29 = 429.00
        assertEquals(429.00, breakdown.subtotalService)

        // 2. Tax calculations (9% CGST + 9% SGST on 429 = 38.61 each)
        assertEquals(38.61, breakdown.cgstService)
        assertEquals(38.61, breakdown.sgstService)

        // 3. Materials Tax (9% CGST + 9% SGST on 300 = 27.00 each)
        assertEquals(27.00, breakdown.cgstMaterials)
        assertEquals(27.00, breakdown.sgstMaterials)
        assertEquals(131.22, breakdown.totalTax)

        // 4. Technician share: 85% of labor (340) + 100% materials (300) + 100% travel (50) = 690.00
        assertEquals(690.00, breakdown.technicianShareRupees)

        // 5. Grand total = subtotal (429) + materials (300) + tax (131.22) + travel (50) = 910.22 -> rounded to 910
        assertEquals(910L, breakdown.grandTotal)

        // 6. Platform share = 910 - 690 = 220.00
        assertEquals(220.00, breakdown.platformShareRupees)

        // 7. Paise conversion consistency
        assertEquals(91000L, breakdown.grandTotalPaise)
        assertEquals(69000L, breakdown.technicianSharePaise)
        assertEquals(22000L, breakdown.platformSharePaise)
    }

    @Test
    fun testBuildSplitOrderPayloadGeneratesEscrowTransfers() {
        val breakdown = PaymentSplit.calculateSplitBreakdown(
            laborCharge = 500.00,
            platformFee = 29.00,
            materialsCharge = 150.00,
            travelAllowance = 0.00
        )

        val payload = PaymentSplit.buildSplitOrderPayload(
            orderId = "order_sk_test_123",
            technicianAccountId = "acc_tech_amal_8819",
            corporateAccountId = "acc_sheriyakam_corp",
            isHighRiskJob = true,
            breakdown = breakdown
        )

        assertEquals("order_sk_test_123", payload.orderId)
        assertEquals("INR", payload.currency)
        assertEquals(2, payload.transfers.size)

        val techTransfer = payload.transfers[0]
        assertEquals("acc_tech_amal_8819", techTransfer.account)
        assertTrue(techTransfer.onHold, "High-risk job must hold technician payout in escrow")

        val platformTransfer = payload.transfers[1]
        assertEquals("acc_sheriyakam_corp", platformTransfer.account)
        assertEquals(false, platformTransfer.onHold)
    }
}
