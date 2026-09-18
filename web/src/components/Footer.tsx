'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Zap, ShieldCheck, MapPin, Phone, Mail, 
  Clock, Award, FileCheck, CheckCircle2 
} from 'lucide-react';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { CATEGORIES } from '@/data/services';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060910] text-slate-400 text-xs">
      {/* Top Value Assurance Banner */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Certified Wiremen</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Govt. of Kerala Electrical Inspectorate licensed electricians with ID verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">30-Day Service Warranty</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Free revisit & fix for any recurrence on completed repair work within 30 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transparent Rate Card</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Upfront labor prices. Spare parts billed strictly at retail MRP with invoice.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Punctual Arrival</h4>
              <p className="text-slate-400 text-xs mt-0.5">
                Fixed 2-hour arrival windows with 30-min pre-arrival technician notification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-lg text-white">
                Sheriyakam<span className="text-amber-400">.</span>
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              Sheriyakam is Kozhikode&apos;s verified electrical repair & installation platform. 
              We connect residential and commercial properties across Kozhikode district with 
              licensed wiremen for safe, compliant, and standard-rated electrical services.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Central Operations Hub: Mavoor Road, Kozhikode, Kerala 673004</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Customer Helpdesk: +91 495 280 0000 (8:00 AM – 8:30 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Support & Inquiries: care@sheriyakam.in</span>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Electrical Services
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <a
                    href="#services-section"
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="#services-section" className="hover:text-amber-400 transition-colors">
                  Commercial Wiring & 3-Phase Work
                </a>
              </li>
            </ul>
          </div>

          {/* Service Areas (Kozhikode & Malabar) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Serviceable Pincodes in Kozhikode
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1.5 text-[11px] text-slate-400">
              {SERVICEABLE_AREAS.map(area => (
                <div key={area.pincode} className="flex items-center gap-1 hover:text-slate-200">
                  <span className="font-mono text-amber-400/80">{area.pincode}</span>
                  <span className="truncate">{area.areaName}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Expanding shortly to additional northern Kerala districts.
            </p>
          </div>

        </div>

        {/* Legal & Compliance Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 Sheriyakam Services Pvt. Ltd.</span>
            <span>•</span>
            <span>IS:732 Indian Standard Wiring Compliant</span>
            <span>•</span>
            <span>18% Statutory GST Invoicing</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#safety" className="hover:text-slate-300 transition-colors">Safety Standards</a>
            <a href="#rate-card" className="hover:text-slate-300 transition-colors">Rate Card</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
