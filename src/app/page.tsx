"use client";

import { useState } from "react";

import EmailGenerator from "./blog/components/EmailGenerator";
import Header from "./blog/components/Header";
import Footer from "./blog/components/Footer";
import Image from "next/image";

export default function Home() {
  const [emailAddress, setEmailAddress] = useState<string>("");

  const handleEmailGenerate = (newEmail: string) => {
    setEmailAddress(newEmail);
    // You can add functionality here to use the email address
    console.log('Generated email:', newEmail);
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
