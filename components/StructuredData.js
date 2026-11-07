/**
 * components/StructuredData.js
 * Unified Schema.org JSON-LD Entity Graph (@graph) for Sheriyakam.
 * 
 * Interconnects:
 * 1. LocalBusiness / Electrician (HQ in Thalassery, KSELB certified)
 * 2. AreaServed (7 Postal Zones in Thalassery–Mahe Corridor)
 * 3. hasOfferCatalog (6 Core Electrical Services with exact INR prices starting from ₹499)
 * 4. FAQPage (High-intent 40–60 word BLUF answers for AI Answer Engine citations)
 */

import React from 'react';

export const UNIFIED_GRAPH_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "Electrician", "HomeAndConstructionBusiness"],
      "@id": "https://sheriyakam.vercel.app/#organization",
      "name": "Sheriyakam",
      "legalName": "Sheriyakam Electrical Services",
      "alternateName": "Sheriyakam Home & Electrical Services Kerala",
      "url": "https://sheriyakam.vercel.app",
      "logo": "https://sheriyakam.vercel.app/icon.png",
      "image": "https://sheriyakam.vercel.app/assets/images/emergency.png",
      "description": "Verified KSELB licensed electricians providing on-demand 90-minute doorstep electrical repairs across the Thalassery–Mahe corridor with upfront transparent pricing from ₹499 and 30-day workmanship warranty.",
      "telephone": "+919447128901",
      "email": "support@sheriyakam.in",
      "priceRange": "₹499 - ₹4999",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Thalassery Main Road",
        "addressLocality": "Thalassery",
        "addressRegion": "Kerala",
        "postalCode": "670101",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 11.7495,
        "longitude": 75.4891
      },
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": "Thalassery",
          "postalCode": "670101",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Mahe",
          "postalCode": "673310",
          "addressRegion": "Puducherry",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Dharmadam",
          "postalCode": "670106",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Kadirur",
          "postalCode": "670642",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Chokli",
          "postalCode": "670672",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "New Mahe",
          "postalCode": "673311",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Azhiyur",
          "postalCode": "673309",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        }
      ],
      "sameAs": [
        "https://github.com/sheriyakam",
        "https://twitter.com/sheriyakam",
        "https://www.instagram.com/sheriyakam"
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sheriyakam Core Electrical Services Rate Card",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Fault Inspection & Multimeter Diagnosis",
              "description": "Comprehensive on-site fault triage, digital multimeter line testing, short circuit diagnosis, and upfront repair quote. Fee waived if repair is approved on-site."
            },
            "price": 499,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Switchboard, Socket & Plug Repair",
              "description": "Repair and replacement of sparking switches, burned 16A power plugs, loose contacts, and heavy appliance sockets using ISI-standard spares at MRP."
            },
            "price": 499,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Ceiling & Exhaust Fan Repair / Installation",
              "description": "Capacitor replacement, speed regulator wiring, bearing noise repair, and new ceiling/exhaust fan mounting with dynamic balancing."
            },
            "price": 549,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/fan-repair-kerala"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "MCB, RCCB & Fuse Box Tripping (DB Triage)",
              "description": "Earth leakage trace, RCCB nuisance tripping resolution, neutral isolation, and miniature circuit breaker (MCB) replacement."
            },
            "price": 649,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/emergency-electrician"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Inverter & Battery Wiring Setup",
              "description": "Single and double battery inverter cabling, changeover switch installation, backup phase routing, and terminal anti-corrosion coating."
            },
            "price": 749,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "House Wiring, Additional Points & Earthing",
              "description": "Concealed conduit wire pulling, additional 6A/16A points, earthing pit resistance measurement, and full domestic rewiring assessment."
            },
            "price": 899,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "url": "https://sheriyakam.vercel.app/house-rewiring-kerala"
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://sheriyakam.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does an electrician charge in Thalassery and Mahe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard electrical repairs start at ₹499 for multimeter fault inspection and switchboard repairs through Sheriyakam. All bookings include an upfront quote before work starts, digital invoice, and 30-day workmanship warranty with zero hidden dispatch fees."
          }
        },
        {
          "@type": "Question",
          "name": "How fast does an emergency electrician arrive in Thalassery or Mahe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sheriyakam emergency electricians reach your doorstep within 45 to 90 minutes across Thalassery, Mahe, Dharmadam, Kadirur, Chokli, New Mahe, and Azhiyur. Customers receive a direct phone confirmation call from the assigned technician immediately upon dispatch."
          }
        },
        {
          "@type": "Question",
          "name": "Are Sheriyakam wiremen certified by the Kerala Government?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. 100% of Sheriyakam electricians hold valid Wireman or Supervisor licenses issued by the Kerala State Electricity Licensing Board (KSELB). Every wireman undergoes local background verification and strictly adheres to Central Electricity Authority safety standards."
          }
        },
        {
          "@type": "Question",
          "name": "How does Sheriyakam bill for spare parts and materials?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Customers can provide their own ISI-certified spare parts, or our electrician will procure them locally from authorized hardware stores at actual retail MRP with the original store bill photo attached to your digital invoice."
          }
        }
      ]
    }
  ]
};

export default function StructuredData() {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: JSON.stringify(UNIFIED_GRAPH_SCHEMA) }
  });
}
