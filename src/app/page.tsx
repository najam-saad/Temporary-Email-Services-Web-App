"use client";

import { useState, useCallback, useEffect } from "react";
import { ErrorBoundary } from './components/ErrorBoundary';

import EmailGenerator from "./blog/components/EmailGenerator";
import EmailInbox from "./blog/components/EmailInbox";
import Header from "./blog/components/Header";
import Footer from "./blog/components/Footer";
import Image from "next/image";
import Advertisement from '@/components/Advertisement';
import PlaceholderAd from '@/components/MonetizationStarter';
import DonationButton from '@/components/DonationButton';

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
          {/* Top Leaderboard */}
          <Advertisement 
            slot="1234567890" // Replace with your actual ad unit ID
            format="horizontal"
            className="hidden md:block max-w-4xl mx-auto pt-4"
          />
          
          {/* Auto ads will be placed automatically */}
          
          {/* In-page format */}
          <Advertisement 
            slot="in_content_1"
            format="rectangle"
            className="my-6 mx-auto max-w-[336px]"
          />
          
          {/* Overlay formats */}
          <div className="sticky top-0 z-50">
            <Advertisement
              slot="overlay_top"
              format="horizontal"
              className="w-full"
            />
          </div>
          
          <div className="max-w-4xl mx-auto px-4 py-6 sm:py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar Ad */}
              <div className="hidden lg:block w-[160px]">
                <Advertisement
                  slot="2345678901" // Replace with your actual ad unit ID
                  format="vertical"
                  className="sticky top-4"
                />
              </div>

              {/* Main Content */}
              <div className="flex-grow">
                <div className="text-center mb-8">
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-3">
                    Temp-emails
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6">
                    Email that expires in minutes
                  </p>
                  <div className="max-w-lg mx-auto mb-6 sm:mb-8">
                    <Image
                      src="/hero-mail.svg"
                      alt="Secure Email"
                      width={400}
                      height={300}
                      className="mx-auto w-3/4 sm:w-full"
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
                  slot="3456789012" // Replace with your actual ad unit ID
                  format="rectangle"
                  className="my-6"
                />

                <EmailGenerator 
                  onGenerate={handleGenerate} 
                  currentEmail={email}
                />

                {email && (
                  <>
                    {/* Pre-Inbox Ad */}
                    <Advertisement
                      slot="pre_inbox"
                      format="rectangle"
                      className="my-6"
                    />
                    <EmailInbox 
                      email={email} 
                      expiresAt={expiresAt}
                      onExpire={handleExpire}
                    />
                  </>
                )}

                {/* Support button */}
                <DonationButton />
              </div>

              {/* Right Sidebar Ad */}
              <div className="hidden lg:block w-[300px]">
                <Advertisement
                  slot="right_sidebar"
                  format="vertical"
                  className="sticky top-4"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Footer Ad */}
        <Advertisement
          slot="footer_banner"
          format="horizontal"
          className="max-w-4xl mx-auto py-4"
        />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
