import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <img src="/icon.png" alt="Wikwok" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-lg">Wikwok</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making Wikipedia content accessible and engaging through innovative discovery.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://creativecommons.org/licenses/by-sa/3.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  CC BY-SA License
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Wikipedia
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Wikwok. All rights reserved.
            </div>
            <div className="text-gray-500 text-xs">
              <p>
                Wikipedia content is licensed under{' '}
                <a 
                  href="https://creativecommons.org/licenses/by-sa/3.0/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cerulean-500 hover:text-cerulean-400 transition-colors"
                >
                  CC BY-SA 3.0
                </a>
                {' '}by the Wikimedia Foundation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}