"use client";
import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

          <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Usage</h2>
              <p className="text-gray-600">
                20MinuteMail provides temporary email services for legitimate purposes only. Users agree not to use the service for spam, harassment, or any illegal activities.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Email Expiration</h2>
              <p className="text-gray-600">
                All emails and addresses automatically expire after 20 minutes. We make no guarantees about email delivery or storage beyond this timeframe.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitations</h2>
              <p className="text-gray-600">
                The service is provided &quot;as is&quot; without warranties. We reserve the right to modify or terminate the service at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
