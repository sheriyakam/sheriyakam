import React from 'react';
import ServiceLandingView from '../components/ServiceLandingView';

export default function CctvInstallationKeralaScreen() {
    return (
        <ServiceLandingView
            serviceSlug="cctv-ip-camera-install"
            title="CCTV Camera Installation & Maintenance in Kerala"
            metaTitle="CCTV Installation & Service in Kerala — IP & HD Camera Setup | Sheriyakam"
            metaDescription="Professional CCTV installation across Kerala. Setup CP Plus, Hikvision, Dahua IP & HD dome/bullet cameras, NVR/DVR configuration & mobile phone live view. Starts ₹550."
            h1="CCTV Camera Installation & NVR/DVR Setup Across Kerala"
            tagline="Hikvision, CP Plus & Dahua Certified Security Technicians"
            startingPrice={550}
            duration="60–120 mins"
            canonical="https://sheriyakam.vercel.app/cctv-installation-kerala"
            intro="Secure your Kerala home, villa, plantation, or commercial property with professional CCTV installation by Sheriyakam. Our certified technicians handle high-definition HD and IP dome/bullet camera mounting, weatherproof CAT6 conduit cabling, NVR/DVR hard drive setup, and seamless mobile live streaming configuration."
            problems={[
                'CCTV cameras showing "No Video" or offline on mobile app',
                'Need new 4-channel or 8-channel CCTV setup for home or commercial shop',
                'Night vision infrared LEDs not working in the dark',
                'DVR/NVR hard drive beep error or recording loop full',
                'Damaged outdoor coaxial or CAT6 network cable due to weather'
            ]}
            faqs={[
                {
                    q: 'Can I view my CCTV cameras live on my mobile phone when away from Kerala?',
                    a: 'Yes, our technicians configure secure P2P cloud streaming on your iOS or Android smartphone so you can watch HD live video and playback recordings anywhere in the world.'
                },
                {
                    q: 'Which CCTV camera brands do you support?',
                    a: 'We install and service all leading brands including Hikvision, CP Plus, Dahua, Honeywell, and TP-Link Tapo with genuine manufacturer warranty.'
                }
            ]}
        />
    );
}
