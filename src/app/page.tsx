"use client";

import { useState, useCallback, useEffect } from "react";
import { ErrorBoundary } from './components/ErrorBoundary';
import EmailGenerator from "./blog/components/EmailGenerator";
import EmailInbox from "./blog/components/EmailInbox";
import Header from "./blog/components/Header";
import Footer from "./blog/components/Footer";
import Image from "next/image";
import Advertisement from '@/components/Advertisement';

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
        
        <main className="flex-grow bg-white">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left Sidebar Ad */}
              <div className="hidden lg:block w-[160px]">
                <Advertisement
                  slot="2345678901"
                  format="vertical"
                  className="sticky top-4"
                />
              </div>

              {/* Main Content */}
              <div className="flex-grow">
                <div className="text-center mb-4">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                    Temp-emails
                  </h1>
                  <p className="text-base sm:text-lg text-gray-700 mb-3">
                    Email that expires in minutes
                  </p>
                  <div className="max-w-lg mx-auto mb-4">
                    <Image
                      src="/hero-mail.svg"
                      alt="Secure Email"
                      width={300}
                      height={200}
                      className="mx-auto w-1/2 sm:w-2/3"
                      priority
                      style={{
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                    />
                  </div>
                </div>

                {/* In-Content Ad */}
                <Advertisement
                  slot="3456789012"
                  format="rectangle"
                  className="my-4"
                />

                <EmailGenerator 
                  onGenerate={handleGenerate} 
                  currentEmail={email}
                />

                {email && (
                  <div className="mt-4">
                    <EmailInbox 
                      email={email} 
                      expiresAt={expiresAt}
                      onExpire={handleExpire}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
}
