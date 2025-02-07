"use client";

import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">How It Works</h1>
          
          <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Generate Your Temporary Email</h2>
              <p className="text-gray-600">
                Click the &quot;Generate Email&quot; button to instantly create your disposable email address. 
                No registration or personal information required.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Use Your Temporary Email</h2>
              <p className="text-gray-600">
                Use this email address wherever you need it. Perfect for:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 ml-4">
                <li>Signing up for trials</li>
                <li>Downloading resources</li>
                <li>Protecting your privacy</li>
                <li>Avoiding spam in your main inbox</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Receive Messages</h2>
              <p className="text-gray-600">
                Messages appear instantly in your temporary inbox. No refresh needed - 
                we automatically check for new messages every few seconds.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Auto-Expiry</h2>
              <p className="text-gray-600">
                After 20 minutes, your temporary email and all its contents are automatically deleted. 
                This ensures your privacy and keeps your digital footprint minimal.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
