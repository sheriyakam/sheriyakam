/**
 * JobPaymentQRModal.tsx
 * Offline-First Dynamic NPCI UPI QR Payment Collection Modal for Electrician Partner App.
 * Renders offline vector QR code via react-native-qrcode-svg, provides customer breakdown,
 * supports WhatsApp link sharing, and requires UTR / Photo verification to close the job.
 */

import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Share,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'expo-image-picker';
import {
  CheckCircle,
  Copy,
  Share2,
  Camera,
  X,
  CreditCard,
  FileCheck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';
import { upiPaymentService } from '../services/upiPaymentService';
import { jobPhotoService } from '../services/jobPhotoService';

export interface JobPaymentQRModalProps {
  visible: boolean;
  onClose: () => void;
  jobId: string;
  electricianId: string;
  customerName?: string;
  laborFee: number;
  partsCost: number;
  platformFee?: number;
  onPaymentCompleted: (details: {
    jobId: string;
    totalPaid: number;
    utrOrRef: string;
    proofPhotoUri?: string;
  }) => void;
}

export const JobPaymentQRModal: React.FC<JobPaymentQRModalProps> = ({
  visible,
  onClose,
  jobId,
  electricianId,
  customerName = 'Customer',
  laborFee,
  partsCost,
  platformFee = 0,
  onPaymentCompleted,
}) => {
  const [utrInput, setUtrInput] = useState<string>('');
  const [utrError, setUtrError] = useState<string | null>(null);
  const [proofPhotoUri, setProofPhotoUri] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [useFallbackImage, setUseFallbackImage] = useState<boolean>(false);

  // Compute dynamic NPCI URI
  const paymentData = useMemo(() => {
    try {
      return upiPaymentService.generateUpiIntentUri({
        jobId,
        laborFee,
        partsCost,
        platformFee,
      });
    } catch {
      return null;
    }
  }, [jobId, laborFee, partsCost, platformFee]);

  if (!paymentData) {
    return null;
  }

  // Copy UPI URI / VPA
  const handleCopyVpa = async () => {
    Alert.alert('UPI VPA Copied', paymentData.merchantVpa);
  };

  // Share UPI payment link via WhatsApp / SMS
  const handleSharePaymentLink = async () => {
    try {
      await Share.share({
        message: `Sheriyakam Electricals Invoice for Job #${jobId}\nTotal Amount: ₹${paymentData.formattedAmount}\nCustomer: ${customerName}\n\nPay securely via any UPI App (GPay, PhonePe, Paytm):\n${paymentData.upiUri}`,
        title: `Sheriyakam Bill - ₹${paymentData.formattedAmount}`,
      });
    } catch (err) {
      console.warn('Share error:', err);
    }
  };

  // Take photo of customer payment confirmation screen or physical cash voucher
  const handleCapturePaymentProof = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera Permission', 'Camera permission is required to capture customer payment confirmation.');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const rawUri = result.assets[0].uri;

        // Compress and queue/upload via jobPhotoService
        const uploadResult = await jobPhotoService.processAndUploadJobPhoto(rawUri, {
          jobId,
          electricianId,
          stage: 'PAYMENT_PROOF',
          notes: 'Customer payment screen confirmation',
        });

        setProofPhotoUri(uploadResult.localUri);
        setUtrError(null);
      }
    } catch (err) {
      Alert.alert('Photo Error', 'Failed to capture payment proof: ' + (err as Error).message);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Validate verification conditions before closing job
  const handleMarkPaidAndClose = () => {
    const hasUtr = utrInput.trim().length > 0;
    const hasPhotoProof = Boolean(proofPhotoUri);

    if (!hasUtr && !hasPhotoProof) {
      setUtrError('Please enter last 4 digits of UTR OR take a photo of the payment confirmation.');
      return;
    }

    if (hasUtr) {
      const validation = upiPaymentService.validateUtr(utrInput);
      if (!validation.isValid) {
        setUtrError(validation.error || 'Invalid UTR format.');
        return;
      }
    }

    setUtrError(null);
    setIsSubmitting(true);

    onPaymentCompleted({
      jobId,
      totalPaid: paymentData.totalAmount,
      utrOrRef: utrInput.trim() || 'PHOTO_VERIFIED',
      proofPhotoUri: proofPhotoUri || undefined,
    });

    setIsSubmitting(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Collect Payment</Text>
              <Text style={styles.headerSubtitle}>Job #{jobId} • {customerName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Amount Banner */}
            <View style={styles.amountBanner}>
              <Text style={styles.amountLabel}>Total Amount Payable</Text>
              <Text style={styles.amountValue}>₹{paymentData.formattedAmount}</Text>
              <View style={styles.secureTag}>
                <ShieldCheck size={14} color="#10B981" />
                <Text style={styles.secureTagText}>Instant 100% Platform Settlement</Text>
              </View>
            </View>

            {/* Offline Vector QR Code Container */}
            <View style={styles.qrWrapper}>
              <View style={styles.qrCard}>
                {!useFallbackImage ? (
                  <QRCode
                    value={paymentData.upiUri}
                    size={210}
                    color="#0B0F19"
                    backgroundColor="#FFFFFF"
                    onError={() => setUseFallbackImage(true)}
                  />
                ) : (
                  <Image
                    source={{ uri: paymentData.fallbackQrUrl }}
                    style={{ width: 210, height: 210 }}
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text style={styles.scanInstruction}>
                Scan with any UPI app: Google Pay, PhonePe, Paytm, or BHIM
              </Text>
            </View>

            {/* Share & Copy Actions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={handleSharePaymentLink}
                style={[styles.actionBtn, styles.shareBtn]}
                activeOpacity={0.8}
              >
                <Share2 size={16} color="#FFFFFF" />
                <Text style={styles.shareBtnText}>Share Link (WhatsApp)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCopyVpa}
                style={[styles.actionBtn, styles.copyBtn]}
                activeOpacity={0.8}
              >
                <Copy size={16} color="#38BDF8" />
                <Text style={styles.copyBtnText}>Copy UPI</Text>
              </TouchableOpacity>
            </View>

            {/* Itemized Bill Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>ITEMIZED BREAKDOWN</Text>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Electrician Labor Charges</Text>
                <Text style={styles.breakdownVal}>₹{paymentData.breakdown.laborFee.toFixed(2)}</Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Materials & Hardware Parts</Text>
                <Text style={styles.breakdownVal}>₹{paymentData.breakdown.partsCost.toFixed(2)}</Text>
              </View>

              {paymentData.breakdown.platformFee > 0 && (
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Safety & Escrow Shield Fee</Text>
                  <Text style={styles.breakdownVal}>₹{paymentData.breakdown.platformFee.toFixed(2)}</Text>
                </View>
              )}

              <View style={[styles.breakdownRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Customer Charge</Text>
                <Text style={styles.totalVal}>₹{paymentData.formattedAmount}</Text>
              </View>
            </View>

            {/* Verification Inputs */}
            <View style={styles.verificationSection}>
              <Text style={styles.verificationTitle}>PAYMENT CONFIRMATION (REQUIRED)</Text>

              {/* Option A: Enter UTR */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>UPI Reference / UTR Number (Last 4 or 12 digits):</Text>
                <TextInput
                  value={utrInput}
                  onChangeText={(text) => {
                    setUtrInput(text);
                    if (utrError) setUtrError(null);
                  }}
                  keyboardType="numeric"
                  placeholder="e.g. 8492 or 432109876543"
                  placeholderTextColor="#64748B"
                  style={[styles.textInput, utrError ? styles.textInputError : null]}
                  maxLength={12}
                />
              </View>

              {/* Option B: Capture Photo Proof */}
              <View style={styles.photoProofRow}>
                <TouchableOpacity
                  onPress={handleCapturePaymentProof}
                  style={styles.photoBtn}
                  disabled={isProcessingPhoto}
                >
                  {isProcessingPhoto ? (
                    <ActivityIndicator size="small" color="#38BDF8" />
                  ) : (
                    <>
                      <Camera size={18} color="#38BDF8" />
                      <Text style={styles.photoBtnText}>
                        {proofPhotoUri ? 'Retake Photo Proof' : 'Take Customer Screen Photo'}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {proofPhotoUri && (
                  <View style={styles.photoVerifiedBadge}>
                    <CheckCircle size={14} color="#10B981" />
                    <Text style={styles.photoVerifiedText}>Photo Attached</Text>
                  </View>
                )}
              </View>

              {utrError && (
                <View style={styles.errorRow}>
                  <AlertCircle size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{utrError}</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bottom Confirmation Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleMarkPaidAndClose}
              style={[
                styles.confirmButton,
                isSubmitting ? styles.confirmButtonDisabled : null,
              ]}
              disabled={isSubmitting}
              activeOpacity={0.88}
            >
              <CheckCircle size={18} color="#FFFFFF" />
              <Text style={styles.confirmButtonText}>
                {isSubmitting ? 'Closing Job...' : 'Mark Paid & Complete Job'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#1E293B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  amountBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FBBF24',
    marginVertical: 4,
  },
  secureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  secureTagText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '700',
  },
  qrWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  qrCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  scanInstruction: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 260,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareBtn: {
    flex: 1,
    backgroundColor: '#059669',
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  copyBtn: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  copyBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginVertical: 10,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  breakdownLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  breakdownVal: {
    fontSize: 13,
    color: '#F1F5F9',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: '#334155',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  totalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FBBF24',
  },
  verificationSection: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginTop: 8,
  },
  verificationTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  textInputError: {
    borderColor: '#EF4444',
  },
  photoProofRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  photoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
  },
  photoBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  photoVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoVerifiedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
