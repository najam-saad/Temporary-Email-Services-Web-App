"use client";
import Header from "../blog/components/Header";
import Footer from "../blog/components/Footer";
import { Mail, Github, Twitter } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-b from-blue-50 to-blue-100 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
          
          <div className="space-y-8 bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600">support@20minutemail.com</p>
              </div>

              <div className="text-center">
                <Github className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">GitHub</h3>
                <a href="https://github.com" className="text-blue-600 hover:text-blue-800">
                  @20minutemail
                </a>
              </div>

              <div className="text-center">
                <Twitter className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Twitter</h3>
                <a href="https://twitter.com" className="text-blue-600 hover:text-blue-800">
                  @20minutemail
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 