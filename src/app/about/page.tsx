import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal-layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Wikwok',
  description: 'Learn about Wikwok - revolutionary Wikipedia discovery engine. Our mission, team, and vision for making knowledge accessible to everyone through innovative technology.',
  keywords: ['about wikwok', 'wikipedia discovery', 'education platform', 'knowledge engine', 'team information', 'company mission'],
  robots: 'index, follow',
};

export default function About() {
  return (
    <LegalLayout title="About Wikwok" description="Making knowledge accessible through innovative technology">
      <section className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12">
            <img src="/icon.png" alt="Wikwok" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Discovery Engine</h2>
            <p className="text-cerulean-500 font-bold uppercase tracking-widest text-xs">Making Knowledge Accessible</p>
          </div>
        </div>
        
        <p className="text-gray-300 leading-relaxed mb-3">
          Wikwok transforms how people discover and engage with Wikipedia content. We believe that knowledge should be accessible, engaging, and enjoyable to explore.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Our innovative discovery engine brings Wikipedia's vast repository of information to life through an intuitive, mobile-first experience that makes learning feel natural and effortless.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">What We Do</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-medium text-cerulean-500 mb-1">Content Discovery</h3>
            <p className="text-gray-300 text-sm">
              Intelligent algorithm helps you discover Wikipedia articles you might never find through traditional search.
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-medium text-cerulean-500 mb-1">TikTok-Style Experience</h3>
            <p className="text-gray-300 text-sm">
              Reimagined content consumption with a vertical, swipeable interface that makes browsing Wikipedia engaging.
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-medium text-cerulean-500 mb-1">Multi-Language Support</h3>
            <p className="text-gray-300 text-sm">
              Access Wikipedia content in multiple languages, breaking down barriers to knowledge.
            </p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-medium text-cerulean-500 mb-1">Educational Value</h3>
            <p className="text-gray-300 text-sm">
              Enhanced context and insights to make complex topics accessible to learners of all levels.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">How Wikwok Works</h2>
        <div className="bg-gray-800 p-3 rounded-lg space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-cerulean-500 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <h4 className="font-medium text-white mb-1">Intelligent Curation</h4>
              <p className="text-gray-300 text-sm">Algorithm selects interesting articles based on trending topics and educational value.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-cerulean-500 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <div>
              <h4 className="font-medium text-white mb-1">Enhanced Presentation</h4>
              <p className="text-gray-300 text-sm">Content optimized for mobile viewing with images and educational context.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-cerulean-500 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <div>
              <h4 className="font-medium text-white mb-1">Interactive Discovery</h4>
              <p className="text-gray-300 text-sm">Explore topics through intuitive interface with search and language switching.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Our Commitment</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          Wikwok is built on the foundation of open knowledge and free access to information. We are committed to:
        </p>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-cerulean-500">✓</span>
            <span>Proper attribution of Wikipedia content under CC BY-SA license</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cerulean-500">✓</span>
            <span>Maintaining transparency about our algorithms and curation process</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cerulean-500">✓</span>
            <span>Ensuring educational value over entertainment</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cerulean-500">✓</span>
            <span>Supporting multiple languages and diverse perspectives</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-cerulean-500">✓</span>
            <span>Protecting user privacy and data security</span>
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Technology</h2>
        <div className="grid md:grid-cols-3 gap-3 text-center">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-xl font-bold text-cerulean-500 mb-1">Next.js</div>
            <p className="text-gray-400 text-xs">Modern React Framework</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-xl font-bold text-cerulean-500 mb-1">TypeScript</div>
            <p className="text-gray-400 text-xs">Type-Safe Development</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-xl font-bold text-cerulean-500 mb-1">Responsive</div>
            <p className="text-gray-400 text-xs">Mobile-First Design</p>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-3">Contact Us</h2>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-300 text-sm mb-3">
            We'd love to hear from you! Whether you have feedback, questions, or just want to share your experience with Wikwok:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-3 py-2 bg-cerulean-500 text-white rounded hover:bg-cerulean-600 transition-colors text-sm"
            >
              Contact Form
            </Link>
            <Link 
              href="mailto:rizperdana16@proton.me" 
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Email Us
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Legal & Privacy</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link 
            href="/privacy" 
            className="text-cerulean-500 hover:text-cerulean-400 transition-colors text-sm"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/terms" 
            className="text-cerulean-500 hover:text-cerulean-400 transition-colors text-sm"
          >
            Terms of Service
          </Link>
        </div>
      </section>
    </LegalLayout>
  );
}