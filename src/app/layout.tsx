import './globals.css'
import Script from 'next/script';
import { Metadata } from 'next'
import { websiteSchema, organizationSchema, serviceSchema } from '../utils/schema'

export const metadata: Metadata = {
  metadataBase: new URL('https://tempfreeemail.com'),
  title: {
    default: 'Temp-emails | Secure Temporary Email Service',
    template: '%s | Temp-emails'
  },
  description: 'Get instant, secure temporary email addresses with Temp-emails. Protect your privacy and avoid spam with our disposable email service.',
  keywords: ['temporary email', 'disposable email', 'temp mail', 'anonymous email', 'privacy', 'anti-spam'],
  authors: [{ name: 'Temp-emails Team' }],
  creator: 'Temp-emails',
  publisher: 'Temp-emails',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: 'your-google-site-verification',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tempfreeemail.com',
    siteName: 'Temp-emails',
    title: 'Secure Temporary Email Service',
    description: 'Get instant, secure temporary email addresses. Protect your privacy and avoid spam.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Temp-emails Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Temp-emails - Secure Temporary Email Service',
    description: 'Get instant, secure temporary email addresses. Protect your privacy and avoid spam.',
    images: ['/twitter-image.jpg'],
  },
}

export const generateSchemaMarkup = () => {
  return {
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [websiteSchema, organizationSchema, serviceSchema]
    })
  };
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9262259592522097"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Add this meta tag for AdSense verification */}
        <meta name="google-adsense-account" content="ca-pub-9262259592522097" />

        {/* Media.net */}
        <Script
          async
          src="//contextual.media.net/dmedianet.js?cid=YOUR_MEDIANET_ID"
          strategy="lazyOnload"
        />

        {/* Carbon Ads */}
        <Script
          async
          src="//cdn.carbonads.com/carbon.js?serve=YOUR_CARBON_ZONE_ID"
          id="_carbonads_js"
          strategy="lazyOnload"
        />

        {/* BuySellAds */}
        <Script
          async
          src="//m.servedby-buysellads.com/monetization.js"
          strategy="lazyOnload"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={generateSchemaMarkup()}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
