import './globals.css'
import Script from 'next/script';
import { Metadata } from 'next'
import { websiteSchema, organizationSchema, serviceSchema } from '../utils/schema'

export const metadata: Metadata = {
  metadataBase: new URL('https://tempfreeemail.com'),
  title: {
    default: 'Temp-emails | Secure 20-Minute Temporary Email Service',
    template: '%s | Temp-emails'
  },
  description: 'Get instant, secure temporary email addresses that last 20 minutes. Protect your privacy, avoid spam, and sign up for services safely with our disposable email service.',
  keywords: [
    'temporary email',
    'disposable email',
    'temp mail',
    'anonymous email',
    'privacy',
    'anti-spam',
    '20 minute email',
    'secure email',
    'temporary inbox',
    'email privacy'
  ],
  authors: [{ name: 'Temp-emails Team' }],
  creator: 'Temp-emails',
  publisher: 'Temp-emails',
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
  alternates: {
    canonical: 'https://tempfreeemail.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tempfreeemail.com',
    siteName: 'Temp-emails',
    title: 'Secure 20-Minute Temporary Email Service',
    description: 'Get instant, secure temporary email addresses. Protect your privacy and avoid spam with our 20-minute disposable email service.',
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
    title: 'Temp-emails - Secure 20-Minute Temporary Email Service',
    description: 'Get instant, secure temporary email addresses. Protect your privacy and avoid spam.',
    images: ['/twitter-image.jpg'],
    creator: '@temp_emails',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code'
  },
  category: 'Technology',
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
        {/* Preconnect to required origins */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        
        {/* Favicon and app icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [websiteSchema, organizationSchema, serviceSchema]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
