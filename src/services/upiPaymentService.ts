/**
 * upiPaymentService.ts
 * Offline-First Dynamic NPCI UPI QR Generator
 * Generates strict NPCI-compliant payment intent URIs and fallback QR images for job closeout.
 */

export interface UpiPaymentParams {
  jobId: string;
  laborFee: number;
  partsCost: number;
  platformFee?: number;
  merchantVpa?: string;
  merchantName?: string;
}

export interface UpiPaymentIntentResult {
  upiUri: string;
  totalAmount: number;
  formattedAmount: string;
  transactionRef: string;
  transactionNote: string;
  merchantVpa: string;
  merchantName: string;
  fallbackQrUrl: string;
  breakdown: {
    laborFee: number;
    partsCost: number;
    platformFee: number;
    totalAmount: number;
  };
}

const DEFAULT_MERCHANT_VPA = process.env.EXPO_PUBLIC_MERCHANT_UPI_VPA || 'sheriyakam@icici';
const DEFAULT_MERCHANT_NAME = 'Sheriyakam Electricals';

export const upiPaymentService = {
  /**
   * TASK 2.1: Construct strict NPCI-compliant `upi://pay` URI.
   * Enforces positive amount, 2 decimal places, and unique transaction reference.
   */
  generateUpiIntentUri(params: UpiPaymentParams): UpiPaymentIntentResult {
    const labor = Math.max(0, Number(params.laborFee) || 0);
    const parts = Math.max(0, Number(params.partsCost) || 0);
    const platform = Math.max(0, Number(params.platformFee) || 0);

    const sum = labor + parts + platform;
    if (sum <= 0) {
      throw new Error('Total payment amount must be strictly greater than zero.');
    }

    const formattedAmount = sum.toFixed(2);
    const merchantVpa = params.merchantVpa || DEFAULT_MERCHANT_VPA;
    const merchantName = params.merchantName || DEFAULT_MERCHANT_NAME;

    // Unique transaction reference per attempt to prevent duplicate reconciliations
    const transactionRef = `SHK_${params.jobId}_${Date.now()}`;
    const transactionNote = `Job_${params.jobId}`;

    // NPCI standard specification parameters
    const queryParams = new URLSearchParams({
      pa: merchantVpa,
      pn: merchantName,
      am: formattedAmount,
      cu: 'INR',
      tn: transactionNote,
      tr: transactionRef,
      mode: '02', // Static/Dynamic QR Code flow
      orgid: '159014', // Generic verified business aggregator
    });

    const upiUri = `upi://pay?${queryParams.toString()}`;
    const fallbackQrUrl = this.getFallbackQrImageUrl(upiUri);

    return {
      upiUri,
      totalAmount: sum,
      formattedAmount,
      transactionRef,
      transactionNote,
      merchantVpa,
      merchantName,
      fallbackQrUrl,
      breakdown: {
        laborFee: labor,
        partsCost: parts,
        platformFee: platform,
        totalAmount: sum,
      },
    };
  },

  /**
   * TASK 2.2: Generates an HTTPS raster QR image URL via qrserver for
   * secondary image fallback, WhatsApp receipts, or PDF invoices.
   */
  getFallbackQrImageUrl(upiUri: string, size: number = 300): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=M&data=${encodeURIComponent(upiUri)}`;
  },

  /**
   * Validates UPI UTR (Unique Transaction Reference) / Ref number entered by the electrician.
   * Accepts either the last 4 digits (quick check) or the full 12-digit standard banking UTR.
   */
  validateUtr(utr: string): { isValid: boolean; error?: string } {
    const clean = (utr || '').trim();
    if (!clean) {
      return { isValid: false, error: 'Please enter the UPI transaction reference or last 4 digits.' };
    }

    // Accepts 4 digits or full 12-digit UTR
    if (/^\d{4}$/.test(clean) || /^\d{12}$/.test(clean)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: 'Invalid UTR format. Enter either the last 4 digits or the full 12-digit UPI reference.',
    };
  },
};
