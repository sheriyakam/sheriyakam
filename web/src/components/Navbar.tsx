'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Zap, Phone, MapPin, ShieldCheck, 
  Menu, X, ChevronDown, Clock, Sparkles 
} from 'lucide-react';
import { CATEGORIES } from '@/data/services';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
}

export default function Navbar({ onOpenBooking }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Sheriyakam<span className="text-amber-400">.</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 -mt-1">
                Licensed Electricians · Calicut
              </span>
            </div>
          </Link>

          {/* Quick Pincode Chip (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Kozhikode & Malabar</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-[11px] text-emerald-400 font-medium">Slots Open</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              onMouseEnter={() => setServicesDropdownOpen(true)}
              className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Services</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {servicesDropdownOpen && (
              <div 
                onMouseLeave={() => setServicesDropdownOpen(false)}
                className="absolute left-0 top-full mt-1 w-64 p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setServicesDropdownOpen(false);
                      const el = document.getElementById('services-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">View →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <a 
            href="#why-us" 
            className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
          >
            Why Sheriyakam
          </a>

          <a 
            href="#how-it-works" 
            className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
          >
            How It Works
          </a>

          <a 
            href="#faq" 
            className="px-3.5 py-2 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Helpline Call CTA */}
          <a
            href="tel:+914952800000"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>0495 280 0000</span>
          </a>

          {/* Book Electrician Button */}
          <button
            type="button"
            onClick={() => onOpenBooking()}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Book Electrician</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-6 space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Serving all 13 Kozhikode zones & Malabar region</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1">
              Services
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById('services-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left px-3 py-2 text-sm rounded-lg text-slate-300 hover:bg-slate-900 flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-amber-400">View →</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <a
              href="tel:+914952800000"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              Call Helpline: 0495 280 0000
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              Book Electrician Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
