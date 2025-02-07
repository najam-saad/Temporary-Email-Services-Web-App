"use client";
import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Temp-emails Privacy Policy</h1>
          
          <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Collection</h2>
              <p className="text-gray-600">
                Temp-emails is committed to minimal data collection. We do not store any personal 
                information. Temporary email addresses and their contents are automatically deleted 
                after 20 minutes.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Email Content</h2>
              <p className="text-gray-600">
                All email contents are stored temporarily in memory and are completely purged after 
                the 20-minute period. We do not maintain any backups or archives of emails.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies & Tracking</h2>
              <p className="text-gray-600">
                We use minimal essential cookies required for the service to function. We do not use 
                any tracking cookies or analytics services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Security</h2>
              <p className="text-gray-600">
                While we implement security best practices, this service is intended for temporary, 
                non-sensitive communications. Do not use it for confidential or important messages.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact</h2>
              <p className="text-gray-600">
                For privacy concerns or questions, please contact us through our support channels.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 