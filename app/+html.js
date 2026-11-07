import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';
import { UNIFIED_GRAPH_SCHEMA } from '../components/StructuredData';

/**
 * Root HTML document template for Sheriyakam Web Export.
 * Configures font-display: swap, font preconnects, mobile responsive viewport,
 * geo-meta tags, canonical link, OpenGraph protocols, and Unified Schema.org JSON-LD @graph.
 */
export default function Root({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0A0F1C" />
        <meta name="application-name" content="Sheriyakam" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sheriyakam" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Canonical & Core SEO Metadata */}
        <link rel="canonical" href="https://sheriyakam.vercel.app/" />
        <meta
          name="description"
          content="Book verified KSELB-licensed electricians in Thalassery and Mahe. Upfront rates starting from ₹499, 90-minute doorstep dispatch, and 30-day workmanship warranty."
        />

        {/* Geo-Targeting Metadata for Local GEO / AEO */}
        <meta name="geo.region" content="IN-KL" />
        <meta name="geo.placename" content="Thalassery, Kannur, Kerala" />
        <meta name="geo.position" content="11.7495;75.4891" />
        <meta name="ICBM" content="11.7495, 75.4891" />

        {/* OpenGraph Protocols */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Book Verified Electricians in Thalassery & Mahe | Sheriyakam" />
        <meta
          property="og:description"
          content="Doorstep electrical repairs across Thalassery, Mahe & Dharmadam by KSELB certified wiremen. Upfront pricing from ₹499, 90-min dispatch & 30-day warranty."
        />
        <meta property="og:url" content="https://sheriyakam.vercel.app/" />
        <meta property="og:image" content="https://sheriyakam.vercel.app/assets/images/emergency.png" />
        <meta property="og:site_name" content="Sheriyakam" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Book Verified Electricians in Thalassery & Mahe | Sheriyakam" />
        <meta
          name="twitter:description"
          content="Doorstep electrical repairs across Thalassery, Mahe & Dharmadam by KSELB certified wiremen. Upfront pricing from ₹499, 90-min dispatch & 30-day warranty."
        />
        <meta name="twitter:image" content="https://sheriyakam.vercel.app/assets/images/emergency.png" />

        {/* Unified Schema.org JSON-LD Entity Graph (@graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(UNIFIED_GRAPH_SCHEMA) }}
        />

        {/* PWA Manifest & App Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preconnect to Google Fonts with font-display: swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('[SW] Registration note:', err.message);
                  });
                });
              }
            `,
          }}
        />

        {/* Critical Performance & Anti-CLS Inline CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Plus Jakarta Sans';
                font-display: swap;
              }
              *, *::before, *::after {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
              }
              html, body {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: #0B0F19;
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              #root {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: transparent;
                position: relative;
                z-index: 1;
              }
              img {
                content-visibility: auto;
              }
              /* Ensure 44px min touch targets on interactive web elements */
              button, a, [role="button"] {
                touch-action: manipulation;
              }
            `,
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
