/**
 * Payment Gateway Split-Payout & Escrow Utility
 * Compatible with Razorpay Route, Cashfree Easy Split, and Stripe Connect.
 * All currency calculations are handled in the lowest denomination (Paise / INR 0.01).
 */

export const COMMISSION_RATE = 0.15; // 15% Platform Commission
export const GST_RATE = 0.18; // 18% GST (9% CGST + 9% SGST)

/**
 * Converts INR Rupees to Paise (integer)
 * e.g. 730.00 -> 73000
 */
export function rupeesToPaise(amountInRupees) {
    return Math.round(Number(amountInRupees) * 100);
}

/**
 * Calculates marketplace breakdown between Platform, Technician, and GST
 * @param {number} laborCharge - Base labor fee in Rupees
 * @param {number} platformFee - Convenience charge in Rupees
 * @param {number} materialsCharge - Approved genuine ISI spare parts in Rupees
 * @param {number} travelAllowance - Doorstep travel compensation in Rupees
 */
export function calculateSplitBreakdown({
    laborCharge = 350.00,
    platformFee = 29.00,
    materialsCharge = 240.00,
    travelAllowance = 0.00,
}) {
    // 1. Service & Labor (SAC 9987)
    const subtotalService = laborCharge + platformFee;
    const cgstService = Number((subtotalService * 0.09).toFixed(2));
    const sgstService = Number((subtotalService * 0.09).toFixed(2));
    const totalServiceTax = cgstService + sgstService;

    // 2. Materials (HSN 8536)
    const cgstMaterials = Number((materialsCharge * 0.09).toFixed(2));
    const sgstMaterials = Number((materialsCharge * 0.09).toFixed(2));
    const totalMaterialsTax = cgstMaterials + sgstMaterials;

    // 3. Totals
    const totalTax = totalServiceTax + totalMaterialsTax;
    const grandTotal = Math.round(subtotalService + materialsCharge + totalTax + travelAllowance);

    // 4. Split Distribution
    // Technician receives 85% of labor, 100% of materials, and 100% of travel allowance
    const technicianShareRupees = Number(((laborCharge * 0.85) + materialsCharge + travelAllowance).toFixed(2));
    const platformShareRupees = Number((grandTotal - technicianShareRupees).toFixed(2));

    return {
        laborCharge,
        platformFee,
        materialsCharge,
        travelAllowance,
        subtotalService,
        cgstService,
        sgstService,
        cgstMaterials,
        sgstMaterials,
        totalTax,
        grandTotal,
        technicianShareRupees,
        platformShareRupees,
        grandTotalPaise: rupeesToPaise(grandTotal),
        technicianSharePaise: rupeesToPaise(technicianShareRupees),
        platformSharePaise: rupeesToPaise(platformShareRupees),
    };
}

/**
 * Generates official Razorpay Route / Cashfree split order payload
 * @param {Object} params
 * @param {string} params.orderId - Internal Booking / Order ID
 * @param {string} params.technicianAccountId - Razorpay linked account (e.g. acc_TechRajesh_7731)
 * @param {string} params.corporateAccountId - Corporate settlement account (e.g. acc_VoltFix_Corporate_Main)
 * @param {boolean} params.isHighRiskJob - If true, holds technician payout in escrow until signoff
 * @param {Object} params.breakdown - Output from calculateSplitBreakdown
 */
export function buildSplitOrderPayload({
    orderId = 'order_VF_2026_89102',
    technicianAccountId = 'acc_TechRajesh_7731',
    corporateAccountId = 'acc_VoltFix_Corporate_Main',
    isHighRiskJob = false,
    breakdown,
}) {
    const data = breakdown || calculateSplitBreakdown({});

    return {
        amount: data.grandTotalPaise,
        currency: 'INR',
        order_id: orderId,
        transfers: [
            {
                account: technicianAccountId,
                amount: data.technicianSharePaise,
                currency: 'INR',
                notes: {
                    type: 'technician_labor_and_materials',
                    breakdown: `Labor: ₹${data.laborCharge}, Materials: ₹${data.materialsCharge}`,
                },
                on_hold: isHighRiskJob,
                on_hold_until: isHighRiskJob ? null : undefined, // Released upon customer OTP
            },
            {
                account: corporateAccountId,
                amount: data.platformSharePaise,
                currency: 'INR',
                notes: {
                    type: 'platform_commission_and_gst',
                    breakdown: `Commission: 15%, GST SAC 9987: ₹${data.totalTax}`,
                },
                on_hold: false,
            },
        ],
    };
}
