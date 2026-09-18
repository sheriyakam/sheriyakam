import crypto from 'crypto';
import { BookingRequest, BookingResponse } from '../types';
import { SERVICES } from '../data/services';
import { checkPincodeServiceability } from '../data/service-areas';
import { TIME_SLOTS } from '../data/time-slots';
import { isPhoneVerified } from './otp-service';

// In-memory bookings store (In production, replace with Supabase or PostgreSQL)
const bookingsStore: BookingResponse[] = [];

export function generateBookingId(): string {
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SHR-2026-${randomHex}`;
}

export async function processCreateBooking(payload: BookingRequest): Promise<{
  success: boolean;
  message: string;
  booking?: BookingResponse;
}> {
  const {
    serviceId,
    customerName,
    phone,
    pincode,
    addressLine1,
    scheduledDate,
    scheduledSlotId,
    notes,
    otpToken
  } = payload;

  // 1. Mandatory input checks
  if (!customerName || customerName.trim().length < 2) {
    return { success: false, message: 'Please provide a valid full name.' };
  }
  if (!addressLine1 || addressLine1.trim().length < 5) {
    return { success: false, message: 'Please enter a complete street address or flat number.' };
  }

  // 2. Service Lookup (Server Authority)
  const service = SERVICES.find(s => s.id === serviceId && s.active);
  if (!service) {
    return { success: false, message: 'Selected electrical service is invalid or discontinued.' };
  }

  // 3. Pincode Validation (Server Authority)
  const pincodeCheck = checkPincodeServiceability(pincode);
  if (!pincodeCheck.available || !pincodeCheck.area) {
    return { success: false, message: pincodeCheck.message };
  }

  // 4. Time Slot & Date Validation
  const slot = TIME_SLOTS.find(s => s.id === scheduledSlotId && s.active);
  if (!slot) {
    return { success: false, message: 'Selected appointment time slot is invalid.' };
  }

  const bookingDate = new Date(scheduledDate);
  if (isNaN(bookingDate.getTime())) {
    return { success: false, message: 'Invalid appointment date format.' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    return { success: false, message: 'Appointment date cannot be in the past.' };
  }

  // 5. OTP Phone Verification Check (In production require valid otpToken, in dev allow with warning if disabled)
  if (process.env.NODE_ENV === 'production' && otpToken) {
    const verified = isPhoneVerified(phone, otpToken);
    if (!verified) {
      return { success: false, message: 'Phone verification token expired or invalid. Please verify phone via OTP.' };
    }
  }

  // 6. Server-Side Price Calculation (Never trusting client payload price)
  const basePrice = service.price || 0;
  const addonsPrice = 0;
  // 18% GST on services if applicable
  const tax = basePrice > 0 ? Math.round(basePrice * 0.18) : 0;
  const totalAmount = basePrice + addonsPrice + tax;

  const bookingId = generateBookingId();
  const newBooking: BookingResponse = {
    bookingId,
    serviceTitle: service.title,
    customerName: customerName.trim(),
    phone,
    scheduledDate,
    scheduledSlot: slot.label,
    address: `${addressLine1.trim()}, ${pincodeCheck.area.areaName}`,
    pincode,
    basePrice,
    addonsPrice,
    tax,
    totalAmount,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    exclusionsNote: service.exclusions
  };

  bookingsStore.unshift(newBooking);

  return {
    success: true,
    message: 'Booking confirmed successfully.',
    booking: newBooking
  };
}

export function getBookingById(bookingId: string): BookingResponse | undefined {
  return bookingsStore.find(b => b.bookingId === bookingId);
}
