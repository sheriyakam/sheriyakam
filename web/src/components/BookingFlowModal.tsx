'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertCircle, Calendar, Clock, MapPin, Phone, 
  User, ShieldCheck, ChevronRight, ArrowLeft, Loader2, 
  CreditCard, Banknote, Sparkles, CheckCircle2, Info, Receipt
} from 'lucide-react';
import { Service, PincodeArea, TimeSlot, BookingRequest, BookingResponse } from '@/types';
import { SERVICES, CATEGORIES } from '@/data/services';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { TIME_SLOTS } from '@/data/time-slots';
import { trackEvent } from '@/lib/analytics';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

type Step = 'service' | 'location' | 'datetime' | 'contact' | 'review' | 'confirmed';

export default function BookingFlowModal({
  isOpen,
  onClose,
  initialServiceId
}: BookingFlowModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>('service');
  
  // Selection States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Location States
  const [pincode, setPincode] = useState<string>('');
  const [pincodeArea, setPincodeArea] = useState<PincodeArea | null>(null);
  const [pincodeStatus, setPincodeStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');
  const [pincodeMessage, setPincodeMessage] = useState<string>('');
  const [addressLine, setAddressLine] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  
  // Schedule States
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [availableDates, setAvailableDates] = useState<{ label: string; value: string; isToday: boolean }[]>([]);
  
  // Contact & Verification States
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pay_after_service' | 'online'>('pay_after_service');
  
  // OTP States
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSessionId, setOtpSessionId] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>('');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string>('');
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  // Submission States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingResponse | null>(null);

  // Initialize available dates (Next 7 days)
  useEffect(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const isToday = i === 0;
      const isTomorrow = i === 1;
      
      let label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      if (isToday) label = `Today (${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
      if (isTomorrow) label = `Tomorrow (${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})`;
      
      const value = d.toISOString().split('T')[0];
      dates.push({ label, value, isToday });
    }
    
    setAvailableDates(dates);
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].value);
    }
  }, []);

  // Set initial service
  useEffect(() => {
    if (initialServiceId) {
      const svc = SERVICES.find(s => s.id === initialServiceId);
      if (svc) {
        setSelectedService(svc);
        setCurrentStep('location');
      }
    }
  }, [initialServiceId, isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  if (!isOpen) return null;

  // Handle Pincode Check
  const handlePincodeCheck = async (pin: string) => {
    setPincode(pin);
    setPincodeArea(null);
    setPincodeMessage('');
    
    const cleanPin = pin.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setPincodeStatus('idle');
      return;
    }

    setPincodeStatus('checking');
    try {
      const res = await fetch(`/api/service-areas/check?pincode=${cleanPin}`);
      const data = await res.json();

      if (data.serviceable) {
        setPincodeStatus('available');
        setPincodeArea(data.area);
        setPincodeMessage(`Service available in ${data.area.areaName}`);
      } else {
        setPincodeStatus('unavailable');
        setPincodeMessage(data.message || 'We do not currently serve this pincode in Kozhikode.');
      }
    } catch {
      setPincodeStatus('error');
      setPincodeMessage('Failed to verify pincode. Please try again.');
    }
  };

  // Handle Send OTP
  const handleSendOtp = async () => {
    setOtpError('');
    setOtpSuccessMessage('');
    
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setOtpError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setOtpSent(true);
        setOtpSessionId(data.sessionId);
        setResendCountdown(45);
        setOtpSuccessMessage(data.message || 'Verification code sent.');
        if (data.devCode) {
          setOtpCode(data.devCode);
          setOtpSuccessMessage(`[Demo Mode] OTP is ${data.devCode}`);
        }
      } else {
        setOtpError(data.error || 'Failed to send OTP. Please retry.');
      }
    } catch {
      setOtpError('Network error while requesting OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async () => {
    setOtpError('');
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone.replace(/\D/g, ''),
          code: otpCode,
          sessionId: otpSessionId
        })
      });
      const data = await res.json();

      if (res.ok && data.verified) {
        setOtpVerified(true);
        setOtpSuccessMessage('Phone number verified successfully.');
        setCurrentStep('review');
      } else {
        setOtpError(data.error || 'Invalid verification code.');
      }
    } catch {
      setOtpError('Network error while verifying OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Final Booking Submission
  const handleConfirmBooking = async () => {
    if (!selectedService || !pincodeArea || !selectedSlot) {
      setSubmitError('Missing booking details. Please review your selection.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const bookingPayload: BookingRequest = {
        serviceId: selectedService.id,
        customerName: customerName.trim(),
        phone: customerPhone.replace(/\D/g, ''),
        pincode: pincode.replace(/\D/g, ''),
        addressLine1: addressLine.trim(),
        landmark: landmark.trim() || undefined,
        scheduledDate: selectedDate,
        scheduledSlotId: selectedSlot.id,
        notes: notes.trim() || undefined
      };

      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBookingConfirmation(data);
        setCurrentStep('confirmed');
        trackEvent('booking_completed', { 
          bookingId: data.bookingId, 
          service: selectedService.title,
          pincode: pincode
        });
      } else {
        setSubmitError(data.error || 'Unable to place booking. Please try again.');
      }
    } catch {
      setSubmitError('Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate pricing preview
  const basePrice = selectedService?.price || 0;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPrice = basePrice + gstAmount;

  // Filtered services
  const filteredServices = selectedCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.categorySlug === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl my-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {currentStep !== 'service' && currentStep !== 'confirmed' && (
              <button
                onClick={() => {
                  if (currentStep === 'location') setCurrentStep('service');
                  else if (currentStep === 'datetime') setCurrentStep('location');
                  else if (currentStep === 'contact') setCurrentStep('datetime');
                  else if (currentStep === 'review') setCurrentStep('contact');
                }}
                className="p-1.5 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {currentStep === 'confirmed' ? 'Booking Confirmed' : 'Book an Electrician'}
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Kozhikode & Malabar
                </span>
              </h2>
              {currentStep !== 'confirmed' && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Step {currentStep === 'service' ? '1/5: Select Service' : currentStep === 'location' ? '2/5: Service Area' : currentStep === 'datetime' ? '3/5: Schedule Time' : currentStep === 'contact' ? '4/5: Customer Details' : '5/5: Bill & Confirmation'}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: SERVICE SELECTION */}
          {currentStep === 'service' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-200">
                  Select Electrical Task
                </label>
                <span className="text-xs text-slate-400">
                  Fixed base rates · No hidden fees
                </span>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All Services
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Services List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                {filteredServices.map(svc => {
                  const isSelected = selectedService?.id === svc.id;
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg shadow-amber-500/5'
                          : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                            {svc.title}
                            {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {svc.shortDescription}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          {svc.priceType === 'quote' || !svc.price ? (
                            <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                              Quote
                            </span>
                          ) : (
                            <div className="text-amber-400 font-bold text-sm">
                              ₹{svc.price}
                              <span className="text-[10px] text-slate-400 font-normal block">
                                {svc.priceType === 'starting' ? 'Starting' : 'Fixed'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & SERVICEABILITY */}
          {currentStep === 'location' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Selected Service</span>
                  <span className="text-sm font-bold text-white">{selectedService?.title}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Base Price</span>
                  <span className="text-sm font-bold text-amber-400">
                    {selectedService?.priceType === 'quote' || !selectedService?.price ? 'Quote after inspection' : `₹${selectedService?.price}`}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Service Pincode (Kozhikode & Malabar)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit PIN code (e.g. 673001)"
                    value={pincode}
                    onChange={(e) => handlePincodeCheck(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 font-mono text-base focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {pincodeStatus === 'checking' && (
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin absolute right-3.5 top-3.5" />
                  )}
                  {pincodeStatus === 'available' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 absolute right-3.5 top-3.5" />
                  )}
                  {pincodeStatus === 'unavailable' && (
                    <AlertCircle className="w-5 h-5 text-rose-400 absolute right-3.5 top-3.5" />
                  )}
                </div>

                {pincodeMessage && (
                  <p className={`text-xs flex items-center gap-1.5 ${
                    pincodeStatus === 'available' ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {pincodeStatus === 'available' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {pincodeMessage}
                  </p>
                )}
              </div>

              {pincodeStatus === 'available' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      House / Flat / Building & Street Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 4B, Emerald Heights, Wayanad Road"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Baby Memorial Hospital / Opposite Calicut Cyberpark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: SCHEDULE TIME */}
          {currentStep === 'datetime' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Select Preferred Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableDates.slice(0, 4).map(d => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDate === d.value
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300 font-bold'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-xs block">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {TIME_SLOTS.map(slot => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                            : 'border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{slot.label}</div>
                          <span className="text-[10px] text-slate-400 capitalize">{slot.startHour}:00 - {slot.endHour}:00</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Our licensed wireman will confirm the arrival window via SMS/Call 30 minutes prior to visit.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: CONTACT & PHONE OTP */}
          {currentStep === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Indian Mobile Number (for OTP & Booking SMS) *
                </label>
                <div className="flex gap-2">
                  <div className="px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm font-mono flex items-center">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    disabled={otpVerified}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-amber-500 disabled:opacity-60"
                  />
                  {!otpVerified && (
                    <button
                      type="button"
                      disabled={otpLoading || resendCountdown > 0 || customerPhone.length !== 10}
                      onClick={handleSendOtp}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap"
                    >
                      {otpLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : resendCountdown > 0 ? (
                        `Wait ${resendCountdown}s`
                      ) : otpSent ? (
                        'Resend OTP'
                      ) : (
                        'Get OTP'
                      )}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && !otpVerified && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Enter 6-Digit OTP Code
                    </label>
                    <span className="text-[11px] text-amber-400">Valid for 5 mins</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-center text-white placeholder-slate-600 font-mono tracking-widest text-lg focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      disabled={otpLoading || otpCode.length !== 6}
                      onClick={handleVerifyOtp}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                    >
                      {otpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {otpSuccessMessage && (
                <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {otpSuccessMessage}
                </p>
              )}

              {otpError && (
                <p className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {otpError}
                </p>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Additional Issue Notes / Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sparking in kitchen MCB switch, fan making humming sound"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & PRICE BREAKDOWN */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedService?.title}</h3>
                    <p className="text-xs text-slate-400">{selectedService?.shortDescription}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Est. Duration</span>
                    <span className="text-xs font-semibold text-slate-200">{selectedService?.durationMinutes} Mins</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Appointment Slot:</span>
                    <span className="font-semibold">{selectedDate} · {selectedSlot?.label}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Service Location:</span>
                    <span className="font-semibold">{pincodeArea?.areaName} ({pincode})</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[11px]">Address:</span>
                    <span className="font-semibold">{addressLine}{landmark ? ` (Near ${landmark})` : ''}</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Base Labor & Service Charge:</span>
                  <span className="font-semibold">₹{basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>GST (18% Statutory Invoice):</span>
                  <span className="font-semibold">₹{gstAmount}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400">
                  <span>Diagnostic & Safety Inspection:</span>
                  <span className="font-semibold">Included FREE</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-base font-bold text-white">
                  <span>Estimated Total:</span>
                  <span className="text-amber-400 text-lg">₹{totalPrice}</span>
                </div>
                <p className="text-[11px] text-slate-400 italic pt-1">
                  * Any replacement spare parts (MCB, wires, capacitors) will be billed at actual retail MRP after your approval.
                </p>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_after_service')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'pay_after_service'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Pay After Service</div>
                      <div className="text-[10px] text-slate-400">Cash or UPI after inspection</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('online')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      paymentMethod === 'online'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-sky-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">UPI / Card</div>
                      <div className="text-[10px] text-slate-400">Instant digital checkout</div>
                    </div>
                  </button>
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: CONFIRMATION RECEIPT */}
          {currentStep === 'confirmed' && bookingConfirmation && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Booking Scheduled Successfully!</h3>
                <p className="text-xs text-slate-400">
                  Confirmation SMS sent to +91 {bookingConfirmation.phone}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-3 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Booking Reference ID:</span>
                  <span className="font-mono font-bold text-amber-400">{bookingConfirmation.bookingId}</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold text-white">{bookingConfirmation.serviceTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Date & Slot:</span>
                    <span className="font-semibold text-white">{bookingConfirmation.scheduledDate} ({bookingConfirmation.scheduledSlot})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service Location:</span>
                    <span className="font-semibold text-white">{bookingConfirmation.pincode} ({bookingConfirmation.address})</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800">
                    <span className="text-slate-400">Estimated Total:</span>
                    <span className="font-bold text-amber-400 text-sm">₹{bookingConfirmation.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Done
                </button>
                <a
                  href={`tel:+914952800000`}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Call Helpdesk
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        {currentStep !== 'confirmed' && (
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              {currentStep === 'service' && selectedService && (
                <span className="text-slate-300 font-medium">Selected: {selectedService.title}</span>
              )}
              {currentStep === 'location' && pincodeArea && (
                <span className="text-emerald-400 font-medium">Area: {pincodeArea.areaName}</span>
              )}
              {currentStep === 'datetime' && selectedSlot && (
                <span className="text-slate-300 font-medium">{selectedDate} ({selectedSlot.label})</span>
              )}
              {currentStep === 'contact' && otpVerified && (
                <span className="text-emerald-400 font-medium">Phone Verified</span>
              )}
            </div>

            <div>
              {currentStep === 'service' && (
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setCurrentStep('location')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
                >
                  Continue to Area
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 'location' && (
                <button
                  type="button"
                  disabled={pincodeStatus !== 'available' || !addressLine.trim()}
                  onClick={() => setCurrentStep('datetime')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
                >
                  Continue to Slot
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 'datetime' && (
                <button
                  type="button"
                  disabled={!selectedDate || !selectedSlot}
                  onClick={() => setCurrentStep('contact')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
                >
                  Continue to Contact
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 'contact' && (
                <button
                  type="button"
                  disabled={!customerName.trim() || !otpVerified}
                  onClick={() => setCurrentStep('review')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/10"
                >
                  Review Booking
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 'review' && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
