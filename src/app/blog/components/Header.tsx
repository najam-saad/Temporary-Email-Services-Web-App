import Link from 'next/link';
import { Mail } from 'lucide-react';


export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-gray-900 font-semibold">
              Temp-emails
            </a>
            <a href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </a>
            <a href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </a>
            <a href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </a>
          </div>
          <div>
            <a href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
} 