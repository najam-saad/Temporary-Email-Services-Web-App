"use client";

import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import EmailCard from "./EmailCard";
import EmailGenerator from "./EmailGenerator";
import Header from "../app/components/Header";
import Footer from "../app/components/Footer";
import Image from "next/image";
import CountdownTimer from "./components/CountdownTimer";

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
        </div>
      </main>

      <Footer />
    </div>
  );
}