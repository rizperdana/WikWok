import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us - Wikwok',
  description: 'Learn about Wikwok - revolutionary Wikipedia discovery engine. Our mission, team, and vision for making knowledge accessible to everyone through innovative technology.',
  keywords: ['about wikwok', 'wikipedia discovery', 'education platform', 'knowledge engine', 'team information', 'company mission'],
  robots: 'index, follow',
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-cerulean-500 hover:text-cerulean-400 transition-colors"
          >
            ← Back to Wikwok
          </Link>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-white mb-6">About Wikwok</h1>
          
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-20 h-20">
                <img src="/icon.png" alt="Wikwok" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Discovery Engine</h2>
                <p className="text-cerulean-500 font-bold uppercase tracking-widest text-sm">Making Knowledge Accessible</p>
              </div>
            </div>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg mb-4">
              Wikwok transforms how people discover and engage with Wikipedia content. We believe that knowledge should be accessible, engaging, and enjoyable to explore.
            </p>
            <p className="text-gray-300 text-lg">
              Our innovative discovery engine brings Wikipedia's vast repository of information to life through an intuitive, mobile-first experience that makes learning feel natural and effortless.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">What We Do</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-cerulean-500 mb-3">Content Discovery</h3>
                <p className="text-gray-300">
                  Our intelligent algorithm helps you discover Wikipedia articles you might never find through traditional search, opening doors to new interests and knowledge areas.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-cerulean-500 mb-3">TikTok-Style Experience</h3>
                <p className="text-gray-300">
                  We've reimagined content consumption with a vertical, swipeable interface that makes browsing Wikipedia as engaging as social media.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-cerulean-500 mb-3">Multi-Language Support</h3>
                <p className="text-gray-300">
                  Access Wikipedia content in multiple languages, breaking down barriers to knowledge and promoting cross-cultural understanding.
                </p>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-cerulean-500 mb-3">Educational Value</h3>
                <p className="text-gray-300">
                  We add educational context and insights to enhance understanding, making complex topics accessible to learners of all levels.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">How Wikwok Works</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cerulean-500 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <h4 className="font-medium text-white mb-1">Intelligent Curation</h4>
                    <p className="text-gray-300">Our algorithm selects interesting Wikipedia articles based on trending topics, educational value, and user engagement patterns.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cerulean-500 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <h4 className="font-medium text-white mb-1">Enhanced Presentation</h4>
                    <p className="text-gray-300">We optimize content for mobile viewing, adding images, formatting, and educational context to improve readability.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-cerulean-500 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <h4 className="font-medium text-white mb-1">Interactive Discovery</h4>
                    <p className="text-gray-300">Users can explore topics through our intuitive interface, with features like search, language switching, and related content suggestions.</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Our Commitment to Open Knowledge</h2>
            <p className="text-gray-300 text-lg mb-4">
              Wikwok is built on the foundation of open knowledge and free access to information. We are committed to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <span className="text-cerulean-500">✓</span>
                <span className="text-gray-300">Proper attribution of Wikipedia content under CC BY-SA license</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cerulean-500">✓</span>
                <span className="text-gray-300">Maintaining transparency about our algorithms and curation process</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cerulean-500">✓</span>
                <span className="text-gray-300">Ensuring educational value over entertainment</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cerulean-500">✓</span>
                <span className="text-gray-300">Supporting multiple languages and diverse perspectives</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-cerulean-500">✓</span>
                <span className="text-gray-300">Protecting user privacy and data security</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Technology & Innovation</h2>
            <p className="text-gray-300 text-lg mb-4">
              Wikwok leverages cutting-edge web technologies to deliver a seamless experience:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-cerulean-500 mb-2">Next.js</div>
                <p className="text-gray-400 text-sm">Modern React Framework</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-cerulean-500 mb-2">TypeScript</div>
                <p className="text-gray-400 text-sm">Type-Safe Development</p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-cerulean-500 mb-2">Responsive</div>
                <p className="text-gray-400 text-sm">Mobile-First Design</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Our Story</h2>
            <p className="text-gray-300 text-lg mb-4">
              Wikwok was founded with a simple observation: Wikipedia contains an incredible wealth of knowledge, but the traditional browsing experience hasn't kept pace with modern user expectations.
            </p>
            <p className="text-gray-300 text-lg mb-4">
              We saw an opportunity to transform how people engage with educational content by applying principles from social media and mobile apps to make learning more accessible and enjoyable.
            </p>
            <p className="text-gray-300 text-lg">
              Today, Wikwok serves curious learners worldwide, helping them discover new interests and expand their knowledge in an intuitive, engaging format.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Contact Us</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">
                We'd love to hear from you! Whether you have feedback, questions, or just want to share your experience with Wikwok:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-cerulean-500 text-white rounded-lg hover:bg-cerulean-600 transition-colors"
                >
                  Contact Form
                </Link>
                <Link 
                  href="mailto:hello@wikwok.com" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Email Us
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Legal & Privacy</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/privacy" 
                className="text-cerulean-500 hover:text-cerulean-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-cerulean-500 hover:text-cerulean-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}