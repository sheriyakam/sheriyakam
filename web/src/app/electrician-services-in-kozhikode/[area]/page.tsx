import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Zap, MapPin, Phone, ShieldCheck, 
  Award, Clock, CheckCircle2, ChevronRight, Wrench 
} from 'lucide-react';
import { SERVICEABLE_AREAS } from '@/data/service-areas';
import { SERVICES } from '@/data/services';
import Footer from '@/components/Footer';

interface Props {
  params: { area: string };
}

// Generate static params for all Kozhikode areas
export async function generateStaticParams() {
  return SERVICEABLE_AREAS.map(area => ({
    area: area.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }));
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const areaObj = SERVICEABLE_AREAS.find(
    a => a.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.area
  );

  if (!areaObj) {
    return {
      title: 'Service Area | Sheriyakam Electricians',
    };
  }

  const title = `Licensed Electrician in ${areaObj.areaName}, Kozhikode (${areaObj.pincode}) | Standard Rates`;
  const description = `Book Kerala certified licensed electricians in ${areaObj.areaName}, Kozhikode (${areaObj.pincode}). Fan repair, switchboards, MCB tripping, 30-day warranty.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://sheriyakam.in/electrician-services-in-kozhikode/${params.area}`,
    },
    openGraph: {
      title,
      description,
      url: `https://sheriyakam.in/electrician-services-in-kozhikode/${params.area}`,
    },
  };
}

export default function LocalAreaPage({ params }: Props) {
  const areaObj = SERVICEABLE_AREAS.find(
    a => a.areaName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === params.area
  );

  if (!areaObj) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col">
      {/* Header */}
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

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-800/60 bg-slate-950/40 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200">Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <Link href="/electrician-services-in-kozhikode" className="hover:text-slate-200">Kozhikode</Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-amber-400 font-semibold">{areaObj.areaName}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 border-b border-slate-800/80 bg-slate-950/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Pincode {areaObj.pincode} · Standard Lead Time: {areaObj.estimatedLeadTimeHours || 2} Hours</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Electrician Services in {areaObj.areaName}, Kozhikode
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Need a certified electrician in {areaObj.areaName} (PIN {areaObj.pincode})? 
            Sheriyakam provides licensed wiremen for fan installations, light fittings, switchboard rewiring, and short circuit diagnostics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              Book Service in {areaObj.areaName}
            </Link>
            <a
              href="tel:+914952800000"
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700"
            >
              Call 0495 280 0000
            </a>
          </div>
        </div>
      </section>

      {/* Area Highlights */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Quick Dispatch in {areaObj.areaName}</h3>
          <p className="text-xs text-slate-400">
            Our local wiremen in {areaObj.areaName} arrive within standard windows with SMS confirmation.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Kerala Inspectorate Certified</h3>
          <p className="text-xs text-slate-400">
            All technicians operating in PIN {areaObj.pincode} are fully licensed with police background verification and ID cards.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">30-Day Free Revisit Guarantee</h3>
          <p className="text-xs text-slate-400">
            Full peace of mind on all repair work in {areaObj.areaName}. Free revisit if the issue recurs within 30 days.
          </p>
        </div>
      </section>

      {/* Popular Services Available in Area */}
      <section className="py-12 bg-slate-950/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Available Services in {areaObj.areaName} ({areaObj.pincode})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.slice(0, 6).map(svc => (
              <div
                key={svc.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{svc.title}</h4>
                  <span className="text-xs font-bold text-amber-400">
                    {svc.price ? `₹${svc.price}` : 'Quote'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{svc.shortDescription}</p>
                <Link
                  href="/"
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold inline-block pt-1"
                >
                  Book for {areaObj.areaName} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
