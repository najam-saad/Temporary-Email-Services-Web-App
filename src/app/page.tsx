"use client";

import { useState, useCallback, useEffect } from "react";
import { ErrorBoundary } from './components/ErrorBoundary';

import EmailGenerator from "./blog/components/EmailGenerator";
import EmailInbox from "./blog/components/EmailInbox";
import Header from "./blog/components/Header";
import Footer from "./blog/components/Footer";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [expiresAt, setExpiresAt] = useState<number>(0);

  // Load saved email on initial render
  useEffect(() => {
    const savedEmail = localStorage.getItem('temp_email');
    const savedExpiry = localStorage.getItem('temp_email_expiry');
    
    if (savedEmail && savedExpiry) {
      const expiryTime = parseInt(savedExpiry);
      if (expiryTime > Date.now()) {
        setEmail(savedEmail);
        setExpiresAt(expiryTime);
      } else {
        // Clear expired email
        localStorage.removeItem('temp_email');
        localStorage.removeItem('temp_email_expiry');
      }
    }
  }, []);

  const handleGenerate = useCallback((newEmail: string, duration: number) => {
    setEmail(newEmail);
    const expiry = Date.now() + (duration * 60 * 1000);
    setExpiresAt(expiry);
    
    // Save to localStorage
    localStorage.setItem('temp_email', newEmail);
    localStorage.setItem('temp_email_expiry', expiry.toString());
  }, []);

  const handleExpire = useCallback(() => {
    setEmail('');
    setExpiresAt(0);
    localStorage.removeItem('temp_email');
    localStorage.removeItem('temp_email_expiry');
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
                Temp-emails
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                Email that expires in minutes
              </p>
              <div className="max-w-lg mx-auto mb-8">
                <Image
                  src="/hero-mail.svg"
                  alt="Secure Email"
                  width={400}
                  height={300}
                  className="mx-auto"
                  priority
                  style={{
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <ErrorBoundary>
                <EmailGenerator 
                  onGenerate={handleGenerate} 
                  currentEmail={email}
                />
                {email && (
                  <ErrorBoundary>
                    <EmailInbox 
                      email={email} 
                      expiresAt={expiresAt}
                      onExpire={handleExpire}
                    />
                  </ErrorBoundary>
                )}
              </ErrorBoundary>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
