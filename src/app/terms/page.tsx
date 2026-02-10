import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - Wikwok',
  description: 'Terms of Service for Wikwok - Wikipedia Discovery Engine. Learn about your rights and responsibilities, copyright notices for Wikipedia content, and user guidelines.',
  keywords: ['terms of service', 'terms of use', 'copyright', 'user agreement', 'Wikipedia license', 'CC BY-SA', 'legal terms'],
  robots: 'index, follow',
};

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-white mb-6">Terms of Service</h1>
          
          <p className="text-gray-300 mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br />
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-300 mb-4">
              Welcome to Wikwok! These Terms of Service ("Terms") govern your access to and use of our Wikipedia discovery engine and related services (the "Service"). By accessing or using Wikwok, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-300">
              If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">2. About Wikwok</h2>
            <p className="text-gray-300 mb-4">
              Wikwok is a discovery engine that aggregates and presents Wikipedia content in an innovative, user-friendly format. We do not create or own the Wikipedia articles displayed on our platform.
            </p>
            <p className="text-gray-300">
              All Wikipedia content is subject to the Creative Commons Attribution-ShareAlike License (CC BY-SA 3.0) and other applicable licenses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">3. Content and Copyright</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">3.1 Wikipedia Content</h3>
            <p className="text-gray-300 mb-4">
              All Wikipedia articles displayed on Wikwok are licensed under:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-cerulean-400">
                <strong>Creative Commons Attribution-ShareAlike 3.0 Unported License (CC BY-SA 3.0)</strong>
              </p>
            </div>
            <p className="text-gray-300 mb-4">
              This means you are free to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li><strong>Share:</strong> Copy and redistribute the material in any medium or format</li>
              <li><strong>Adapt:</strong> Remix, transform, and build upon the material</li>
            </ul>
            <p className="text-gray-300 mb-4">
              Under the following terms:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li><strong>Attribution:</strong> You must give appropriate credit to Wikipedia and provide a link to the original article</li>
              <li><strong>ShareAlike:</strong> If you remix, transform, or build upon the material, you must distribute your contributions under the same license</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.2 Attribution Requirements</h3>
            <p className="text-gray-300 mb-4">
              We provide proper attribution to Wikipedia for all content displayed on our platform, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Clear indication that content is from Wikipedia</li>
              <li>Direct links to original Wikipedia articles</li>
              <li>License information and copyright notices</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">3.3 User-Generated Content</h3>
            <p className="text-gray-300">
              If you provide feedback, comments, or other content to Wikwok, you grant us a non-exclusive, royalty-free license to use, modify, and display such content for the purpose of improving our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">4. Acceptable Use</h2>
            <p className="text-gray-300 mb-4">
              You agree to use Wikwok only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Use the service for fraudulent or deceptive purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use automated bots or scrapers without permission</li>
              <li>Spam, harass, or abuse other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">5. Privacy and Data</h2>
            <p className="text-gray-300 mb-4">
              Your privacy is important to us. Our use of your information is governed by our Privacy Policy, which can be found at <Link href="/privacy" className="text-cerulean-500 hover:text-cerulean-400">/privacy</Link>.
            </p>
            <p className="text-gray-300">
              By using Wikwok, you consent to the collection and use of information as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">6.1 Our Intellectual Property</h3>
            <p className="text-gray-300 mb-4">
              Wikwok owns or licenses all intellectual property rights in the Service, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Website design and user interface</li>
              <li>Discovery algorithms and software</li>
              <li>Brand names, logos, and trademarks</li>
              <li>Original content and features</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">6.2 Third-Party Intellectual Property</h3>
            <p className="text-gray-300">
              We respect the intellectual property rights of Wikipedia contributors and other third parties. All Wikipedia content remains the property of its respective authors and is licensed under CC BY-SA 3.0.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">7. Disclaimers</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">7.1 Service Availability</h3>
            <p className="text-gray-300 mb-4">
              Wikwok is provided on an "as is" and "as available" basis. We do not guarantee that the service will be:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Uninterrupted or error-free</li>
              <li>Secure or free from viruses</li>
              <li>Accurate, complete, or reliable</li>
              <li>Suitable for your specific needs</li>
            </ul>

            <h3 className="text-xl font-medium text-white mb-3">7.2 Content Accuracy</h3>
            <p className="text-gray-300">
              Wikipedia articles may contain inaccuracies, outdated information, or bias. We encourage users to verify important information by consulting primary sources and the original Wikipedia articles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              To the maximum extent permitted by law, Wikwok shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Loss of data or information</li>
              <li>Damage to your computer or device</li>
              <li>Business interruption or loss of profits</li>
              <li>Reliance on inaccurate Wikipedia content</li>
            </ul>
            <p className="text-gray-300">
              Our total liability to you shall not exceed the amount paid by you (if any) for using the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">9. Service Modifications</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify, suspend, or discontinue the service at any time, with or without notice. We may also update these Terms from time to time.
            </p>
            <p className="text-gray-300">
              Continued use of the service after any changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
            <p className="text-gray-300 mb-4">
              We may terminate or suspend your access to the service immediately, without prior notice, for any reason, including:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li>Breach of these Terms</li>
              <li>Violation of applicable laws</li>
              <li>Engagement in fraudulent or harmful activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">11. Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-300">
                <strong>Email:</strong> legal@wikwok.com<br />
                <strong>Website:</strong> <Link href="/contact" className="text-cerulean-500 hover:text-cerulean-400">Contact Form</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}