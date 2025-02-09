"use client";
import type { Metadata } from 'next'
import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";

export const metadata: Metadata = {
  title: 'Privacy Policy - Temp-emails | Secure Temporary Email Service',
  description: 'Our privacy policy explains how we protect your data and maintain your privacy while using our temporary email service.',
  openGraph: {
    title: 'Privacy Policy - Temp-emails',
    description: 'Learn how we protect your privacy and handle your data.',
    url: 'https://tempfreeemail.com/privacy',
    siteName: 'Temp-emails',
    type: 'website',
  },
}

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <article className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-lg">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Information Collection</h2>
            <p>At Temp-emails, we prioritize your privacy. We collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Temporary email addresses (automatically deleted after expiration)</li>
              <li>Email messages during active periods only</li>
              <li>Anonymous usage statistics</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Data Usage & Protection</h2>
            <p>Your data is:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Encrypted in transit and at rest</li>
              <li>Never sold to third parties</li>
              <li>Automatically deleted after expiration</li>
              <li>Only used to provide the temporary email service</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Cookies & Technologies</h2>
            <p>We use:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Essential cookies for service functionality</li>
              <li>Google Analytics (anonymized) for usage statistics</li>
              <li>Google AdSense for advertisement delivery</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Google AdSense</h2>
            <p>We use Google AdSense to display advertisements:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Third-party vendors, including Google, use cookies to serve ads based on prior visits</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site</li>
              <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline">Ads Settings</a></li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Data Retention</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Temporary emails are deleted after their expiration period (10-30 minutes)</li>
              <li>No backups are maintained after deletion</li>
              <li>Analytics data is anonymized after 14 days</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your data</li>
              <li>Request early deletion</li>
              <li>Opt-out of analytics</li>
              <li>Object to processing</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Information</h2>
            <p>For privacy inquiries:</p>
            <ul className="list-none pl-0">
              <li>Email: najam.saad99@gmail.com</li>
              <li>Response time: 24-48 hours</li>
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
} 