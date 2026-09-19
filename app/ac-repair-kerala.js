import React from 'react';
import ServiceLandingView from '../components/ServiceLandingView';

export default function AcRepairKeralaScreen() {
    return (
        <ServiceLandingView
            serviceSlug="ac-foam-jet-wash"
            title="AC Service & Foam Jet Repair in Kerala"
            metaTitle="AC Service & Repair in Kerala — Foam Jet Deep Cleaning | Sheriyakam"
            metaDescription="Book certified AC technicians in Kerala. Deep indoor coil foam jet wash, outdoor condenser cleaning, R32/R410A gas top-up, PCB & capacitor repair. Starts ₹599."
            h1="Split AC Deep Foam Jet Wash & Repair Services Across Kerala"
            tagline="Daikin, Voltas, LG, Mitsubishi & Panasonic AC Specialists"
            startingPrice={599}
            duration="45–60 mins"
            canonical="https://sheriyakam.vercel.app/ac-repair-kerala"
            intro="Keep your air conditioner running at peak cooling efficiency during Kerala’s high heat and humidity. Sheriyakam provides high-pressure indoor jacket foam jet cleaning, outdoor fin wash, drain pipe de-clogging, refrigerant gas leak detection, and compressor capacitor repairs with upfront rates and zero mess."
            problems={[
                'AC blowing normal air / not cooling the room',
                'Water dripping from indoor unit onto the floor or wall',
                'Foul musty smell or black mold on blower wheel and cooling fins',
                'Outdoor compressor unit making loud vibrating noise or tripping MCB',
                'AC remote unresponsive or PCB error code (E1, E6, F3) flashing on display'
            ]}
            faqs={[
                {
                    q: 'What is included in the AC Foam Jet Service?',
                    a: 'Our AC Foam Jet service includes high-pressure coil wash using antibacterial foam, indoor blower wheel deep de-scaling, 2x pressure outdoor condenser fin wash, drain tray flushing, and refrigerant gas pressure check.'
                },
                {
                    q: 'How often should I service my AC in Kerala’s climate?',
                    a: 'Due to Kerala’s coastal humidity and dust, we recommend deep servicing every 4 to 6 months to maintain high energy efficiency and prevent compressor breakdown.'
                }
            ]}
        />
    );
}
