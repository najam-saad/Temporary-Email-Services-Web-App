"use client";
import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-lg">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Service Description</h2>
            <p>Temp-emails provides temporary email addresses that expire after a set duration.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Acceptable Use</h2>
            <p>You agree not to use our service for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Spam, phishing, or malicious activities</li>
              <li>Illegal activities</li>
              <li>Harassment or abuse</li>
              <li>Automated or bot access without permission</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Service Limitations</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Emails expire after the selected duration</li>
              <li>No guarantee of service availability</li>
              <li>No data recovery after expiration</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Disclaimer</h2>
            <p>The service is provided "as is" without warranties of any kind.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Contact</h2>
            <p>For questions about these terms, contact: najam.saad99@gmail.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
