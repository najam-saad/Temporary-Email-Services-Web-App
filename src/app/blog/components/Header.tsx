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
              <a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms
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
              <a href="/about" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                About
              </a>
              <a href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Contact
              </a>
              <a href="/privacy" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Privacy
              </a>
              <a href="/terms" className="block px-4 py-2 text-gray-600 hover:bg-gray-50">
                Terms
              </a>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
} 