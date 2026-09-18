'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Pricing & Billing',
      question: 'How are your electrical service charges calculated?',
      answer: 'We follow a standardized upfront rate card starting at ₹149 for minor repairs (e.g. switch replacement) and ₹199 for fan repairs. The rate includes labor, safety inspection, and 18% GST invoice. If replacement spare parts (wires, MCB, capacitors) are required, they are billed strictly at retail MRP with a store purchase receipt, or you may provide your own materials.'
    },
    {
      category: 'Wiremen & Licensing',
      question: 'Are your electricians licensed by the Kerala Government?',
      answer: 'Yes. All Sheriyakam technicians hold valid wireman competency certificates issued by the Kerala State Electricity Board (KSEB) / Electrical Inspectorate. Every technician undergoes background verification, carries official photo ID, and adheres to IS:732 Indian standard wiring codes.'
    },
    {
      category: 'Warranty & Protection',
      question: 'What is included in the 30-Day Service Warranty?',
      answer: 'If the specific fixture, switch, or wiring section repaired by our technician fails or develops a glitch within 30 days of service, we will dispatch a senior wireman to inspect and fix it at zero additional labor cost.'
    },
    {
      category: 'Spare Parts & Materials',
      question: 'Can I purchase the spare parts myself, or does the technician provide them?',
      answer: 'You have complete freedom. You can either supply your own ISI-grade materials (Havells, Legrand, Finolex, Anchor, etc.) or request the technician to procure them from authorized electrical distributors in Kozhikode at actual MRP with a retail receipt.'
    },
    {
      category: 'Emergency Tripping',
      question: 'What should I do if my MCB trips continuously or I smell burning plastic?',
      answer: 'Immediately switch off the main isolator or RCCB/ELCB to prevent fire hazards. Do not attempt to touch burnt switchboards. Book an urgent Fault & Short Circuit Inspection on Sheriyakam or call our direct helpline (0495 280 0000) for expedited technician dispatch.'
    },
    {
      category: 'Coverage Areas',
      question: 'Which areas in Kozhikode do you serve?',
      answer: 'We cover 15 prime zones in Kozhikode including Mavoor Road (673004), Nadakkavu (673011), Palayam (673001), Thondayad, Medical College (673008), West Hill (673005), Feroke (673631), Pantheeramkavu (673019), Ramanattukara (673633), Beypore, Elathur, and Kakkodi.'
    },
    {
      category: 'Payment Modes',
      question: 'What payment methods do you accept?',
      answer: 'You can pay after the service is completed and tested. We accept Google Pay, PhonePe, Paytm, BHIM UPI, Netbanking, Debit/Credit Cards, and direct Cash. A digital tax invoice will be sent to your mobile number.'
    }
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-950/80 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-400">
            Clear, honest answers about our pricing, licensing, spare parts policy, and warranties.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-white">
                      {faq.question}
                    </span>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <h4 className="text-sm font-bold text-white">Have a specific electrical requirement?</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Our Kozhikode technical desk is available from 8:00 AM to 8:30 PM to answer project queries and provide custom commercial estimates.
          </p>
          <a
            href="tel:+914952800000"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            Call 0495 280 0000 for Technical Assistance
          </a>
        </div>

      </div>
    </section>
  );
}
