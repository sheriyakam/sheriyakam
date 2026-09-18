import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Zap, MapPin, Phone, ShieldCheck, 
  Award, Clock, Check, X, ChevronRight, Wrench, AlertCircle 
} from 'lucide-react';
import { SERVICES, CATEGORIES } from '@/data/services';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import Footer from '@/components/Footer';

interface Props {
  params: { service: string };
}

// Generate static params for all services
export async function generateStaticParams() {
  return SERVICES.map(svc => ({
    service: svc.slug || svc.id
  }));
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = SERVICES.find(s => s.slug === params.service || s.id === params.service);

  if (!service) {
    return {
      title: 'Electrical Service | Sheriyakam Kozhikode',
    };
  }

  const title = `${service.title} in Kozhikode — Starting ₹${service.price || 149} | Sheriyakam`;
  const description = `Book professional ${service.title} in Kozhikode. ${service.shortDescription} Kerala certified wiremen, upfront rates from ₹${service.price || 149}, and 30-day warranty.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sheriyakam.in/electrician-services/${params.service}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sheriyakam.in/electrician-services/${params.service}`,
    },
  };
}

export default function ServiceLandingPage({ params }: Props) {
  const service = SERVICES.find(s => s.slug === params.service || s.id === params.service);

  if (!service) {
    notFound();
  }

  const basePrice = service.price || 149;
  const gst = Math.round(basePrice * 0.18);
  const total = basePrice + gst;

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

      {/* Breadcrumbs */}
      <div className="border-b border-slate-800/60 bg-slate-950/40 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href="/electrician-services-in-kozhikode" className="hover:text-slate-200">Services</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-semibold">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 border-b border-slate-800/80 bg-slate-950/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400">
            <Award className="w-3.5 h-3.5" />
            <span>Licensed Kozhikode Wiremen · {service.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {service.title} in Kozhikode
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {service.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              Book {service.title} (₹{service.price || 149})
            </Link>
            <a
              href="tel:+914952800000"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700"
            >
              Call 0495 280 0000
            </a>
          </div>
        </div>
      </section>

      {/* In-Depth Scope Grid */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: What is Included & Excluded */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              What is Included in This Service
            </h3>
            <ul className="space-y-2.5">
              {service.included.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <X className="w-5 h-5 text-rose-400" />
              What is Excluded (Spare Parts Policy)
            </h3>
            <ul className="space-y-2.5">
              {service.exclusions.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Transparent Price & Trust Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Transparent Cost Breakdown
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Standard Labor Charge:</span>
                <span className="font-semibold text-white">₹{basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Statutory Invoice):</span>
                <span className="font-semibold text-white">₹{gst}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Pre-Service Safety Inspection:</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold text-amber-400">
                <span>Total Estimated Labor:</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p>• Estimated Duration: <strong>{service.durationMinutes || 30} minutes</strong></p>
              <p>• Warranty: <strong>30-Day Free Revisit</strong></p>
              <p>• Payment: <strong>Pay after service via Cash or UPI</strong></p>
            </div>

            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors block text-center"
            >
              Book {service.title} Now
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Safety Guarantee</span>
            </div>
            <p>
              Our electricians use 1000V VDE-tested insulated tools and test earthing resistance before completing service.
            </p>
          </div>
        </div>

      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
