import type { Metadata } from 'next'
import Header from "../blog/components/Header"
import Footer from "../blog/components/Footer"
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Temp-emails | Secure Temporary Email Service',
  description: 'Learn about our mission to provide secure, private temporary email addresses. Discover how we protect your privacy and reduce spam.',
  openGraph: {
    title: 'About Temp-emails',
    description: 'Secure, private temporary email service.',
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
              />
            </div>

            <h2 className="text-xl font-semibold mt-6 mb-3">Our Mission</h2>
            <p>
              At Temp-emails, we're committed to protecting your privacy in the digital age. 
              Our service provides secure, temporary email addresses that help you avoid spam 
              and maintain control over your personal information.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Why Choose Us?</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Instant email generation</li>
              <li>No registration required</li>
              <li>Automatic deletion</li>
              <li>SSL encryption</li>
              <li>Mobile-friendly design</li>
              <li>24/7 availability</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">How It Works</h2>
            <ol className="list-decimal pl-6 mb-4">
              <li>Generate a temporary email address</li>
              <li>Use it for signups or verifications</li>
              <li>Receive emails instantly</li>
              <li>All data is automatically deleted after expiration</li>
            </ol>

            <h2 className="text-xl font-semibold mt-6 mb-3">Our Technology</h2>
            <p>
              Built with modern technologies including Next.js, React, and TailwindCSS. 
              We use industry-standard security practices and reliable email infrastructure.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p>Email: najam.saad99@gmail.com</p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
} 