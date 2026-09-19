import React from 'react';
import ServiceLandingView from '../components/ServiceLandingView';

export default function EmergencyElectricianKeralaScreen() {
    return (
        <ServiceLandingView
            serviceSlug="emergency-electrician-kerala"
            title="24/7 Emergency Electrician in Kerala"
            metaTitle="24/7 Emergency Electrician in Kerala — 90-Min Doorstep Dispatch | Sheriyakam"
            metaDescription="Urgent 24/7 emergency electrical service across Kerala. 90-min dispatch for sudden blackouts, MCB/RCCB tripping, burning smells, short circuits & live wire hazards. ₹550."
            h1="24/7 Emergency Electrician & Power Tripping Triage Across Kerala"
            tagline="Priority 90-Min Doorstep Dispatch • 24/7 Emergency Hotline"
            startingPrice={550}
            duration="45–60 mins"
            canonical="https://sheriyakam.vercel.app/emergency-electrician-kerala"
            intro="Experiencing sudden power outage, sparking switchboards, or non-stop MCB/ELCB tripping in your home or shop? Sheriyakam operates 24/7 emergency electrical rapid response teams across all 14 Kerala districts. A KSELB certified wireman reaches your doorstep within 90 minutes equipped with industrial digital multimeters and genuine replacement breakers to restore safety immediately."
            problems={[
                'Main MCB or RCCB trips continuously and won’t stay ON',
                'Pungent burning plastic smell or sparking from DB / switchboard',
                'Phase failure: some rooms have power while others are blacked out',
                'Water ingress into electrical switches during heavy Kerala rains',
                'Inverter UPS transfer relay failure leaving house with zero backup power'
            ]}
            faqs={[
                {
                    q: 'How fast can an emergency electrician reach my location?',
                    a: 'Our emergency priority triage ensures a KSELB licensed electrician arrives at your doorstep within 45 to 90 minutes anywhere in Kerala.'
                },
                {
                    q: 'What should I do while waiting for the emergency electrician?',
                    a: 'Immediately turn OFF the Main Isolator switch on your Distribution Board (DB) and unplug sensitive appliances like refrigerators, TVs, and computers. Never touch wet switchboards with bare hands.'
                },
                {
                    q: 'Is emergency service available at midnight or on holidays?',
                    a: 'Yes, Sheriyakam operates 24 hours a day, 365 days a year across all 14 Kerala districts.'
                }
            ]}
        />
    );
}
