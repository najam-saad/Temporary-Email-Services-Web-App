"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Mail, Shield, Clock, Ban } from "lucide-react";
import EmailCard from "./EmailCard";
import EmailGenerator from './EmailGenerator';
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import Image from "next/image";
import CountdownTimer from './components/CountdownTimer';

interface Email {
  id: string;
  subject: string;
  sender: string;
  time: string;
  preview: string;
  content: string;
  read: boolean;
}

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [duration, setDuration] = useState<number>(20);
  const [inbox, setInbox] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInbox = async () => {
    if (!email) return;
    setRefreshing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/emails/${email}`);
      const data = await response.json();
      setInbox(data);
    } catch (error) {
      console.error("Error fetching inbox:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (email) {
      const interval = setInterval(fetchInbox, 5000);
      return () => clearInterval(interval);
    }
  }, [email]);

  const handleEmailGenerate = (newEmail: string, newDuration: number) => {
    setEmail(newEmail);
    setDuration(newDuration);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
              Temp-emails
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Secure, anonymous email that expires in minutes
            </p>
            <div className="max-w-lg mx-auto mb-8">
              <Image
                src="/hero-mail.svg"
                alt="Secure Email"
                width={400}
                height={300}
                className="mx-auto"
              />
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <EmailGenerator onGenerate={handleEmailGenerate} />
          </div>

          {/* Features Section */}
          {!email && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Image
                  src="/images/security.svg"
                  alt="Security"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Your temporary email is completely anonymous and secure.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Image
                  src="/images/timer.svg"
                  alt="20 Minute Timer"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">20-Minute Expiry</h3>
                <p className="text-gray-600">
                  Emails automatically expire after 20 minutes for your privacy.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Image
                  src="/images/privacy.svg"
                  alt="No Registration"
                  width={150}
                  height={150}
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">No Registration</h3>
                <p className="text-gray-600">
                  No sign-up required. Generate and use instantly.
                </p>
              </div>
            </div>
          )}

          {/* Inbox Section */}
          {email && (
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-semibold text-gray-900">Inbox</h2>
                <div className="flex items-center gap-4">
                  <CountdownTimer initialMinutes={duration} />
                  <button
                    onClick={fetchInbox}
                    disabled={refreshing}
                    className="p-3 hover:bg-blue-200 rounded-full transition-all duration-300 ease-in-out"
                  >
                    <RefreshCw className={`w-6 h-6 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {inbox.length === 0 ? (
                <div className="text-center py-16">
                  <Mail className="w-14 h-14 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600">Your inbox is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {inbox.map((mail) => (
                    <EmailCard 
                      key={mail.id} 
                      email={mail} 
                      onClick={setSelectedEmail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Email Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedEmail.subject}
                </h2>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <span className="text-2xl font-bold">×</span>
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                From: <span className="font-medium">{selectedEmail.sender}</span>
                <br />
                Time: {selectedEmail.time}
              </p>
              <div className="prose prose-lg text-gray-800">
                {selectedEmail.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
