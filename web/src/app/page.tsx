'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, ShieldCheck, Clock, MapPin, Phone, 
  Award, CheckCircle2, ArrowRight, Star, 
  Sparkles, Wrench, FileText, AlertTriangle 
} from 'lucide-react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import EmergencyBanner from '@/components/EmergencyBanner';
import WhyChooseUs from '@/components/WhyChooseUs';
import HowItWorks from '@/components/HowItWorks';
import FaqSection from '@/components/FaqSection';
import LocationValidator from '@/components/LocationValidator';
import ServiceCard from '@/components/ServiceCard';
import ServiceModal from '@/components/ServiceModal';
import BookingFlowModal from '@/components/BookingFlowModal';

import { SERVICES, CATEGORIES } from '@/data/services';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { Service, PincodeArea } from '@/types';
import { trackEvent } from '@/lib/analytics';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeServiceForModal, setActiveServiceForModal] = useState<Service | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingInitialServiceId, setBookingInitialServiceId] = useState<string | undefined>(undefined);
  const [detectedArea, setDetectedArea] = useState<PincodeArea | null>(null);

  // Open booking modal
  const handleOpenBooking = (serviceId?: string) => {
    setBookingInitialServiceId(serviceId);
    setBookingModalOpen(true);
    trackEvent('open_booking_flow', { serviceId });
  };

  // Open service details modal
  const handleOpenServiceDetails = (service: Service) => {
    setActiveServiceForModal(service);
    trackEvent('view_service_details', { serviceId: service.id, serviceTitle: service.title });
  };

  // Handle location check success
  const handleLocationVerified = (area: PincodeArea) => {
    setDetectedArea(area);
  };

  // Filter services
  const filteredServices = selectedCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.categorySlug === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#070A11]">
      {/* Top Navbar */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Emergency Alert Banner */}
      <EmergencyBanner onOpenBooking={handleOpenBooking} />

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-800/80">
        {/* Glow Accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_-10%,rgba(245,158,11,0.12),rgba(0,0,0,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Value Prop & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400">
                <Award className="w-3.5 h-3.5" />
                <span>Kerala Electrical Inspectorate Certified Wiremen</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Kozhikode&apos;s Verified{' '}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-200 bg-clip-text text-transparent">
                  Electrician & Home Services
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Upfront rate card starting at <strong className="text-amber-400 font-bold">₹149</strong>. 
                No bargaining, no surprise surge fees. 1000V VDE-insulated safety tools, 
                IS:732 compliance, and a guaranteed <strong className="text-white">30-day service warranty</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Book an Electrician Now</span>
                </button>

                <a
                  href="tel:+914952800000"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call 0495 280 0000</span>
                </a>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 border-t border-slate-800/80">
                <div className="text-left">
                  <div className="text-sm sm:text-base font-extrabold text-white">13+ Zones</div>
                  <div className="text-[11px] text-slate-400">Kozhikode City & Malabar</div>
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-base font-extrabold text-white">30 Days</div>
                  <div className="text-[11px] text-slate-400">Free Revisit Warranty</div>
                </div>
                <div className="text-left">
                  <div className="text-sm sm:text-base font-extrabold text-white">100%</div>
                  <div className="text-[11px] text-slate-400">Govt. Licensed Wiremen</div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Pincode Checker Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Check Service in Your Area
                  </h3>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Live Status
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Enter your 6-digit Kozhikode PIN code to check serviceability and typical arrival time.
                </p>

                <LocationValidator onLocationVerified={handleLocationVerified} />

                {detectedArea && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-white">{detectedArea.areaName} ({detectedArea.pincode})</span>
                      <span className="text-[11px] text-amber-400">Wiremen active in this zone</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking()}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
                    >
                      Book Here
                    </button>
                  </div>
                )}

                {/* Popular Quick Categories */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-2">
                    Popular Services
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking('srv-fan-repair')}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 text-left truncate transition-colors"
                    >
                      • Fan Repair (₹199)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking('srv-switch-replace')}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 text-left truncate transition-colors"
                    >
                      • Switch Replacement (₹149)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking('srv-mcb-replace')}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 text-left truncate transition-colors"
                    >
                      • MCB Replacement (₹299)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking('srv-inverter-wiring')}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 text-left truncate transition-colors"
                    >
                      • Inverter Wiring (₹499)
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES CATALOG SECTION */}
      <section id="services-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Standardized Labor Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Electrical Services & Standard Rates
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Transparent starting rates. Spares billed strictly at retail MRP after your consent.
            </p>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Includes 18% GST Invoice & 30-Day Guarantee</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            All Services ({SERVICES.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = SERVICES.filter(s => s.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onBook={(svc) => handleOpenBooking(svc.id)}
              onViewDetails={handleOpenServiceDetails}
            />
          ))}
        </div>

      </section>

      {/* WHY CHOOSE SHERIYAKAM */}
      <WhyChooseUs />

      {/* HOW IT WORKS */}
      <HowItWorks onOpenBooking={handleOpenBooking} />

      {/* LOCAL SERVICE AREAS MAP & PINCODE DIRECTORY */}
      <section className="py-16 sm:py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kozhikode & Malabar Operations</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Service Areas in Kozhikode
            </h2>
            <p className="text-sm text-slate-400">
              Our licensed wiremen operate across 13 central and suburban Kozhikode zones with standard arrival windows.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {SERVICEABLE_AREAS.map(area => (
              <div
                key={area.pincode}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-1"
              >
                <div className="text-amber-400 font-mono font-bold text-xs">PIN {area.pincode}</div>
                <div className="text-white text-sm font-semibold truncate">{area.areaName}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>~{area.estimatedLeadTimeHours || 2}h window</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FaqSection />

      {/* FINAL CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Need an Electrician in Kozhikode Today?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Book online in 60 seconds with mobile OTP verification, or speak directly with our Calicut helpdesk for emergency bookings.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
            >
              Book Service Online (From ₹149)
            </button>
            <a
              href="tel:+914952800000"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Helpline: 0495 280 0000</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <MobileStickyCTA onOpenBooking={() => handleOpenBooking()} />

      {/* SERVICE DETAILS MODAL */}
      <ServiceModal
        service={activeServiceForModal}
        isOpen={!!activeServiceForModal}
        onClose={() => setActiveServiceForModal(null)}
        onBookNow={(svc) => {
          setActiveServiceForModal(null);
          handleOpenBooking(svc.id);
        }}
      />

      {/* BOOKING FLOW MODAL */}
      <BookingFlowModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        initialServiceId={bookingInitialServiceId}
      />
    </div>
  );
}
