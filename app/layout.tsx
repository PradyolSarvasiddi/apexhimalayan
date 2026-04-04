import type { Metadata } from 'next'
import { Inter, DM_Mono, Cormorant_Garamond, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: true,
})

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  preload: true,
})

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['600'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://apexhimalayanrides.com'),
  title: {
    default: 'Apex Himalayan Rides — Ride Where Roads End',
    template: '%s | Apex Himalayan Rides'
  },
  description: 'Premium adventure travel experiences in the Himalayas. Specialist motorcycle tours, high-altitude trekking, and luxury camping expeditions.',
  keywords: ['Himalayan motorcycle tours', 'Leh Ladakh expeditions', 'Spiti Valley bike tours', 'Adventure travel India', 'Luxury camping Himalayas', 'Motorcycling the Himalayas'],
  authors: [{ name: 'Apex Himalayan Rides' }],
  creator: 'Apex Himalayan Rides',
  publisher: 'Apex Himalayan Rides',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://apexhimalayanrides.com',
    siteName: 'Apex Himalayan Rides',
    title: 'Apex Himalayan Rides — Premium Himalayan Expeditions',
    description: 'Specialist motorcycle tours and high-altitude adventures across the Himalayas.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apex Himalayan Rides - Adventure Expedition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Himalayan Rides — Premium Himalayan Expeditions',
    description: 'Join us for life-changing motorcycle expeditions across the highest motorable passes in the world.',
    images: ['/og-image.jpg'],
  },
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
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Apex Himalayan Rides",
  "image": "https://apexhimalayanrides.com/logo.png",
  "@id": "https://apexhimalayanrides.com",
  "url": "https://apexhimalayanrides.com",
  "telephone": "+91 98052 06007",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near Vashishth",
    "addressLocality": "Manali",
    "addressRegion": "Himachal Pradesh",
    "postalCode": "175131",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 32.2432,
    "longitude": 77.1892
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "20:00"
  },
  "sameAs": [
    "https://instagram.com/apex_himalayan_rides"
  ]
};

import MaintenancePage from '@/components/common/MaintenancePage';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isConfigured = 
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isConfigured) {
    return (
      <html lang="en">
        <body>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${inter.variable} ${dmMono.variable} ${cormorantGaramond.variable} ${playfairDisplay.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
