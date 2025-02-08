import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="relative">
          {/* Desktop Menu */}
          <div className="hidden sm:flex justify-between items-center">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex justify-between items-center">
            <a href="/" className="text-gray-900 font-semibold">
              Temp-emails
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg mt-2 py-2">
              <a href="/blog" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Blog
              </a>
              <a href="/how-it-works" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                How it Works
              </a>
              <a href="/faq" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                FAQ
              </a>
              <a href="/privacy" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Privacy
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
} 