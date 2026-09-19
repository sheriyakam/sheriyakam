import React from 'react';
import ServiceLandingView from '../components/ServiceLandingView';

export default function HouseRewiringKeralaScreen() {
    return (
        <ServiceLandingView
            serviceSlug="house-rewiring-kerala"
            title="House Rewiring & DB Overhaul in Kerala"
            metaTitle="House Rewiring Contractors in Kerala — KSELB Licensed Wiremen | Sheriyakam"
            metaDescription="Certified house rewiring contractors in Kerala. Complete residential rewiring, conduit cable pulling, DB distribution board overhaul & chemical copper earthing. Starts ₹550."
            h1="Complete House Rewiring, DB Overhaul & Earthing in Kerala"
            tagline="Empire Electricals Est. 1998 • KSELB Class-A Licensed Wiremen"
            startingPrice={550}
            duration="1–3 days"
            canonical="https://sheriyakam.vercel.app/house-rewiring-kerala"
            intro="Outdated, degraded wiring is the #1 cause of electrical fires and high electricity bills in Kerala homes. Sheriyakam provides turnkey house rewiring, concealed PVC conduit cable pulling with FRLS (Flame Retardant Low Smoke) copper wires (Finolex, Polycab, Havells), 3-phase distribution board modernization, and low-resistance chemical earthing pits certified by KSELB supervisors."
            problems={[
                'House wiring is more than 15–20 years old with degraded insulation',
                'Electric shocks felt on water taps, refrigerator body, or metal switches',
                'Frequent breaker tripping when multiple high-power appliances run together',
                'Renovating home and needing concealed conduit wiring for modern modular switchboards',
                'High electricity bills caused by hidden leakage currents in damp walls'
            ]}
            faqs={[
                {
                    q: 'Can rewiring be done without damaging existing walls or floor tiles?',
                    a: 'Yes, wherever possible our electricians pull fresh FRLS cables through existing conduit pipes using specialized nylon fish tape, minimizing wall cutting and dust.'
                },
                {
                    q: 'Do you provide a safety certificate after rewiring?',
                    a: 'Yes, every complete rewiring job is tested with high-precision digital insulation testers and digital earth testers, followed by a formal workmanship guarantee certificate from Empire Electricals (Class-A Licence #KSELB/CA-7821/KL).'
                }
            ]}
        />
    );
}
