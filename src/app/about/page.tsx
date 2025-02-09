import type { Metadata } from 'next'
import Header from "../blog/components/Header"
import Footer from "../blog/components/Footer"
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Temp-emails | Leading 20-Minute Temporary Email Service',
  description: 'Learn about our mission to provide secure, private temporary email addresses. Our 20-minute email service helps protect your privacy and reduce spam while maintaining security.',
  openGraph: {
    title: 'About Temp-emails - Secure Temporary Email Service',
    description: 'Discover how our 20-minute temporary email service protects your privacy and reduces spam.',
    url: 'https://tempfreeemail.com/about',
    siteName: 'Temp-emails',
    type: 'website',
  },
}

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <article className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">About Temp-emails</h1>
          <div className="prose prose-lg">
            <div className="mb-8">
              <Image
                src="/about-hero.jpg"
                alt="Temp-emails Service"
                width={800}
                height={400}
                className="rounded-lg"
                priority
              />
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                At Temp-emails, we're committed to protecting your privacy in the digital age. 
                Our service provides secure, temporary email addresses that help you avoid spam 
                and maintain control over your personal information. We believe privacy should be 
                accessible to everyone, which is why we offer our service completely free.
              </p>
              <p>
                Our 20-minute email duration is carefully chosen to provide the perfect balance 
                between security and usability, giving you enough time to complete sign-ups and 
                verifications while ensuring your temporary email doesn't persist longer than necessary.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Security First</h3>
                  <ul className="list-disc pl-5">
                    <li>SSL encryption throughout</li>
                    <li>No data retention</li>
                    <li>Automatic deletion</li>
                    <li>Privacy-focused design</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">User Experience</h3>
                  <ul className="list-disc pl-5">
                    <li>Instant email generation</li>
                    <li>No registration needed</li>
                    <li>Mobile-friendly design</li>
                    <li>24/7 availability</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    <strong>Generate Email:</strong> Click the generate button to instantly create 
                    your temporary email address.
                  </li>
                  <li>
                    <strong>Use Anywhere:</strong> Use your temporary email for signups, 
                    verifications, or any other purpose.
                  </li>
                  <li>
                    <strong>Receive Messages:</strong> Messages appear instantly in your inbox, 
                    with automatic refresh every 30 seconds.
                  </li>
                  <li>
                    <strong>Automatic Cleanup:</strong> After 20 minutes, your email and all its 
                    contents are permanently deleted for your privacy.
                  </li>
                </ol>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Technology</h2>
              <p className="mb-4">
                Built with cutting-edge technologies including Next.js 13, React, and TailwindCSS, 
                our platform delivers a fast, reliable, and secure experience. We employ:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Modern, serverless architecture</li>
                <li>Real-time email processing</li>
                <li>Advanced spam filtering</li>
                <li>Automated security protocols</li>
                <li>Responsive design principles</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Privacy Commitment</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="mb-4">
                  We take your privacy seriously. Our service:
                </p>
                <ul className="list-disc pl-6">
                  <li>Never stores emails longer than necessary</li>
                  <li>Doesn't track user behavior</li>
                  <li>Doesn't require personal information</li>
                  <li>Uses secure, encrypted connections</li>
                  <li>Automatically deletes all data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                Have questions or suggestions? We'd love to hear from you. Reach out to us at{' '}
                <a href="mailto:najam.saad99@gmail.com" className="text-blue-600 hover:underline">
                  najam.saad99@gmail.com
                </a>
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
} 