"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Mail } from "lucide-react";
import EmailCard from "./EmailCard";
import EmailGenerator from "./EmailGenerator";

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

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl px-6 py-12 bg-white rounded-xl shadow-lg mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Temporary Email Service
          </h1>
          <p className="text-xl text-gray-700">
            Secure, anonymous communication at your fingertips
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <EmailGenerator onGenerate={setEmail} />
        </div>

        {email && (
          <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold text-gray-900">Inbox</h2>
              <button
                onClick={fetchInbox}
                disabled={refreshing}
                className="p-3 hover:bg-blue-200 rounded-full transition-all duration-300 ease-in-out"
              >
                <RefreshCw className={`w-6 h-6 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
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
      
    </main>
    
  );
}
