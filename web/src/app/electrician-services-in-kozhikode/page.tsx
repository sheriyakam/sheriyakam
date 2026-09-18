import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Zap, MapPin, ShieldCheck, Phone, 
  Award, Clock, CheckCircle2, ArrowRight, Wrench 
} from 'lucide-react';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { SERVICES, CATEGORIES } from '@/data/services';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Licensed Electricians in Kozhikode (Calicut) — Standard Rates from ₹149',
  description: 'Find verified, licensed electricians across Kozhikode. Kerala Electrical Inspectorate certified wiremen for fan repair, switchboard replacement, MCB tripping, and house wiring. 30-day warranty.',
  alternates: {
    canonical: 'https://sheriyakam.in/electrician-services-in-kozhikode',
  },
  openGraph: {
    title: 'Licensed Electricians in Kozhikode | Sheriyakam',
    description: 'Upfront rates from ₹149, 30-day warranty, 13+ Kozhikode zones covered by certified wiremen.',
    url: 'https://sheriyakam.in/electrician-services-in-kozhikode',
  },
};

export default function KozhikodeCityPage() {
  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-bold text-lg text-white">
              Sheriyakam<span className="text-amber-400">.</span>
            </span>
          </Link>
          <a
            href="tel:+914952800000"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>0495 280 0000</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-14 sm:py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kozhikode District Electrical Service Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Verified Electrical Services in Kozhikode
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting homeowners and businesses in Kozhikode with licensed wiremen certified by the Kerala Electrical Inspectorate. Standard labor rates, 30-day warranty, and 100% genuine ISI materials.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              Book Service Online (From ₹149)
            </Link>
            <a
              href="tel:+914952800000"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700"
            >
              Call Calicut Desk: 0495 280 0000
            </a>
          </div>
        </div>
      </section>

      {/* Services List for Kozhikode */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-amber-400" />
          Electrical Services Offered in Kozhikode
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(svc => (
            <div
              key={svc.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">{svc.title}</h3>
                <span className="text-xs font-bold text-amber-400">
                  {svc.price ? `₹${svc.price}` : 'Quote'}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{svc.shortDescription}</p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Est. Duration: {svc.durationMinutes || 30}m</span>
                <Link href="/" className="text-amber-400 hover:underline">Book Now →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Kozhikode Local Area Hubs */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            Kozhikode Local Area Landing Pages
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8">
            Click on any locality below for area-specific electrician dispatch schedules and nearby technician hubs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SERVICEABLE_AREAS.map(area => {
              const slug = area.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
                <Link
                  key={area.pincode}
                  href={`/electrician-services-in-kozhikode/${slug}`}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 transition-all block group"
                >
                  <div className="text-amber-400 font-mono font-bold text-xs">PIN {area.pincode}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {area.areaName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    ~{area.estimatedLeadTimeHours || 2}h window
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
