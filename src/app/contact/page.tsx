import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";
import { Mail, MessageCircle, AlertTriangle, Briefcase } from 'lucide-react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Temp-emails | Secure Temporary Email Service',
  description: 'Get in touch with our team for support, feedback, or business inquiries. We typically respond within 24-48 hours.',
  openGraph: {
    title: 'Contact Temp-emails',
    description: 'Reach out to our team for support or inquiries.',
    url: 'https://tempfreeemail.com/contact',
    siteName: 'Temp-emails',
    type: 'website',
  },
}

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="prose prose-lg">
            <p className="mb-6">
              We're here to help with any questions or concerns about our temporary email service.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold">Support</h2>
                </div>
                <p className="text-gray-600">
                  Need help with our service? Contact our support team.
                </p>
                <a href="mailto:najam.saad99@gmail.com" className="text-blue-600 hover:underline mt-2 block">
                  najam.saad99@gmail.com
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                  <h2 className="text-xl font-semibold">Report Abuse</h2>
                </div>
                <p className="text-gray-600">
                  Report any abuse or suspicious activity.
                </p>
                <a href="mailto:najam.saad99@gmail.com" className="text-blue-600 hover:underline mt-2 block">
                  najam.saad99@gmail.com
                </a>
              </div>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Response Time</h2>
            <p>We typically respond to all inquiries within 24-48 hours.</p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Common Topics</h2>
            <ul className="list-disc pl-6 mb-8">
              <li>Service functionality</li>
              <li>Technical issues</li>
              <li>Privacy concerns</li>
              <li>Business partnerships</li>
              <li>Advertising inquiries</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 