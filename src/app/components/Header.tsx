import Link from 'next/link';
import { Mail } from 'lucide-react';


export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Mail className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Temp-emails</span>
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
              How it Works
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 