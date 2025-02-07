"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h1>
          
          <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                How long does the temporary email last?
              </h2>
              <p className="text-gray-600">
                Each email address expires after exactly 20 minutes from creation. After this time, 
                the address and all its contents are permanently deleted.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Can I send emails from this temporary address?
              </h2>
              <p className="text-gray-600">
                No, this service is for receiving emails only. This helps maintain security and 
                prevent abuse of the service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Is there a limit to how many emails I can receive?
              </h2>
              <p className="text-gray-600">
                No, you can receive unlimited emails within the 20-minute period.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Are the emails secure?
              </h2>
              <p className="text-gray-600">
                Yes, all emails are transmitted securely. However, remember that this is a temporary 
                service - don't use it for sensitive or important communications.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Can I extend the 20-minute period?
              </h2>
              <p className="text-gray-600">
                No, the 20-minute limit is fixed to ensure privacy and security. You can always 
                generate a new temporary email if needed.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 