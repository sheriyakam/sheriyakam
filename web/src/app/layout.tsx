import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sheriyakam.in'),
  title: 'Sheriyakam — Licensed Electricians & Home Services in Kozhikode',
  description: 'Book verified Kerala Electrical Inspectorate certified wiremen across Kozhikode & Malabar. Standard rate card starting at ₹149, 30-day service warranty, and IS:732 electrical safety compliance.',
  keywords: [
    'electrician in Kozhikode',
    'electrician Calicut',
    'emergency electrician Kozhikode',
    'fan repair Kozhikode',
    'switchboard repair Calicut',
    'short circuit diagnosis Kozhikode',
    'Mavoor road electrician',
    'Nadakkavu electrician',
    'licensed wireman Kerala',
    'Sheriyakam'
  ],
  authors: [{ name: 'Sheriyakam Services Pvt. Ltd.' }],
  creator: 'Sheriyakam',
  publisher: 'Sheriyakam',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sheriyakam.in',
    title: 'Sheriyakam — Licensed Electricians & Home Services in Kozhikode',
    description: 'Book verified Kerala Electrical Inspectorate certified wiremen across Kozhikode. Upfront rates from ₹149, 30-day warranty, and IS:732 compliance.',
    siteName: 'Sheriyakam',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sheriyakam — Licensed Electricians in Kozhikode',
    description: 'Standard pricing from ₹149, 30-day warranty, verified wiremen in Kozhikode & Malabar.',
  },
  alternates: {
    canonical: 'https://sheriyakam.in',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'HomeAndConstructionBusiness',
              name: 'Sheriyakam — Licensed Electrician Services',
              image: 'https://sheriyakam.in/og-image.png',
              url: 'https://sheriyakam.in',
              telephone: '+914952800000',
              priceRange: '₹149 - ₹1999',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Mavoor Road',
                addressLocality: 'Kozhikode',
                addressRegion: 'Kerala',
                postalCode: '673004',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 11.2588,
                longitude: 75.7804,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                  opens: '08:00',
                  closes: '20:30',
                },
              ],
              areaServed: [
                'Kozhikode',
                'Mavoor Road',
                'Nadakkavu',
                'Palayam',
                'Thondayad',
                'West Hill',
                'Medical College',
                'Feroke',
                'Pantheeramkavu',
                'Ramanattukara',
                'Beypore',
                'Elathur',
                'Kakkodi',
                'Kunnamangalam',
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                reviewCount: '184',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#070A11] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-200">
        {children}
      </body>
    </html>
  );
}
