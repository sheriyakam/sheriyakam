import { ScrollViewStyleReset } from 'expo-router/html';
import React from 'react';

/**
 * Root HTML document template for Sheriyakam Web Export.
 * Configures font-display: swap, font preconnects, mobile responsive viewport,
 * and zero-layout-shift resets for optimal Core Web Vitals.
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

        {/* Preconnect to Google Fonts with font-display: swap */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
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
              html, body, #root {
                height: 100%;
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: #0A0F1C;
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
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
