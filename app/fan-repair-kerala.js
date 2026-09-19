import React from 'react';
import ServiceLandingView from '../components/ServiceLandingView';

export default function FanRepairKeralaScreen() {
    return (
        <ServiceLandingView
            serviceSlug="ceiling-fan-repair-kerala"
            title="Ceiling Fan Repair & Installation in Kerala"
            metaTitle="Fan Repair in Kerala — Ceiling Fan, BLDC & Exhaust Service | Sheriyakam"
            metaDescription="Book licensed electricians for ceiling fan repair, capacitor replacement, bearing noise fix, BLDC remote pairing & regulator replacement across all 14 Kerala districts. Starts ₹249."
            h1="Ceiling Fan Repair, Capacitor & BLDC Service Across Kerala"
            tagline="Capacitor, Bearing Noise, Speed Regulator & BLDC Experts"
            startingPrice={249}
            duration="30–45 mins"
            canonical="https://sheriyakam.vercel.app/fan-repair-kerala"
            intro="Is your ceiling fan running slow, wobbling, or making a humming or screeching noise? Sheriyakam provides certified wiremen for doorstep fan diagnosis, high-grade 2.5/3.15 µF EPCOS capacitor replacements, bearing lubrication, and smart BLDC motor troubleshooting across all 14 districts of Kerala within 90 minutes."
            problems={[
                'Fan rotating very slowly even at top regulator speed (weak capacitor)',
                'Grinding, clicking, or screeching noise due to worn ball bearings',
                'Ceiling fan wobbling violently on rod or loose ceiling hook fastener',
                'Smart BLDC fan not responding to remote control or RF frequency issue',
                'Step regulator burned or sparking inside the switchboard'
            ]}
            faqs={[
                {
                    q: 'How much does ceiling fan capacitor replacement cost in Kerala?',
                    a: 'Capacitor replacement starts at ₹249 including diagnosis, a high-grade heavy-duty 2.5 µF / 3.15 µF ISI capacitor, and complete load testing with a 30-day warranty.'
                },
                {
                    q: 'Can your electricians repair BLDC fans like Atomberg, Havells, or Crompton?',
                    a: 'Yes, our certified technicians are trained on BLDC PCB driver testing, RF remote re-pairing, and motor coil resistance troubleshooting.'
                },
                {
                    q: 'How fast can a technician arrive for fan repair in my Kerala town?',
                    a: 'We have active mobile wiremen across all 14 districts with average doorstep arrival times between 45 and 90 minutes.'
                }
            ]}
        />
    );
}
