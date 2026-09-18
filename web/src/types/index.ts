export type PriceType = 'fixed' | 'starting' | 'quote';

export interface Service {
  id: string;
  category: string;
  categorySlug: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price?: number;
  priceType: PriceType;
  durationMinutes?: number;
  included: string[];
  exclusions: string[];
  popular?: boolean;
  active: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
}

export interface PincodeArea {
  pincode: string;
  areaName: string;
  taluk: string;
  district: string;
  state: string;
  serviceable: boolean;
  estimatedLeadTimeHours?: number;
}

export interface TimeSlot {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  active: boolean;
}

export interface BookingAddon {
  id: string;
  name: string;
  price: number;
}

export interface BookingRequest {
  serviceId: string;
  addonIds?: string[];
  customerName: string;
  phone: string;
  email?: string;
  pincode: string;
  addressLine1: string;
  landmark?: string;
  scheduledDate: string;
  scheduledSlotId: string;
  notes?: string;
  otpToken?: string;
}

export interface BookingResponse {
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  phone: string;
  scheduledDate: string;
  scheduledSlot: string;
  address: string;
  pincode: string;
  basePrice: number;
  addonsPrice: number;
  tax: number;
  totalAmount: number;
  status: 'confirmed' | 'pending_verification' | 'cancelled';
  createdAt: string;
  exclusionsNote: string[];
}

export interface OtpSession {
  phone: string;
  otpHash: string;
  attempts: number;
  expiresAt: number;
  createdAt: number;
  verified: boolean;
}
