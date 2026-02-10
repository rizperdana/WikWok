import { Metadata } from 'next';
import { LegalLayout } from '@/components/legal-layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - Wikwok',
  description: 'Privacy Policy for Wikwok - Wikipedia Discovery Engine. Learn how we collect, use, and protect your data in compliance with GDPR and CCPA.',
  keywords: ['privacy policy', 'data protection', 'GDPR', 'CCPA', 'user privacy', 'data security', 'cookies policy'],
  robots: 'index, follow',
};

export default function PrivacyPolicy() {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return (
    <LegalLayout title="Privacy Policy" description={`Effective: ${currentDate}`}>
      <div className="mb-4 text-gray-300 text-sm">
        <strong>Effective Date:</strong> {currentDate}<br />
        <strong>Last Updated:</strong> {currentDate}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          Wikwok ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our Wikipedia discovery engine and related services.
        </p>
        <p className="text-gray-300 leading-relaxed">
          By using Wikwok, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>
        
        <h3 className="font-medium text-white mb-2">2.1 Information You Provide</h3>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li>Email address (when contacting us or using certain features)</li>
          <li>Feedback and communications you send to us</li>
          <li>Account preferences and settings</li>
        </ul>

        <h3 className="font-medium text-white mb-2">2.2 Automatically Collected Information</h3>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li>IP address and geolocation data (approximate)</li>
          <li>Device information and browser type</li>
          <li>Usage data and interaction patterns</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h3 className="font-medium text-white mb-2">2.3 Wikipedia Content Data</h3>
        <p className="text-gray-300 text-sm">
          We aggregate and display Wikipedia articles under their Creative Commons Attribution-ShareAlike License. We do not claim ownership of Wikipedia content.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
          <li>To provide and maintain our discovery engine service</li>
          <li>To personalize content and improve user experience</li>
          <li>To analyze usage patterns and optimize performance</li>
          <li>To display relevant advertisements (when applicable)</li>
          <li>To respond to inquiries and provide customer support</li>
          <li>To ensure security and prevent fraud</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">4. Cookies and Tracking Technologies</h2>
        
        <h3 className="font-medium text-white mb-2">4.1 Essential Cookies</h3>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li>Session management and authentication</li>
          <li>Security and fraud prevention</li>
          <li>Remembering user preferences</li>
        </ul>

        <h3 className="font-medium text-white mb-2">4.2 Analytics Cookies</h3>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li>Google Analytics for website performance analysis</li>
          <li>Vercel Analytics for service optimization</li>
        </ul>

        <h3 className="font-medium text-white mb-2">4.3 Advertising Cookies</h3>
        <p className="text-gray-300 text-sm">
          Google AdSense may use cookies to display relevant advertisements based on your interests and browsing behavior across websites.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">5. Third-Party Services</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          We use the following third-party services that may collect and process information:
        </p>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li><strong>Wikipedia:</strong> Source of article content under CC BY-SA license</li>
          <li><strong>Google Analytics:</strong> Website analytics and performance monitoring</li>
          <li><strong>Vercel Analytics:</strong> Service performance and uptime monitoring</li>
          <li><strong>Google AdSense:</strong> Advertisement display and management</li>
        </ul>
        <p className="text-gray-300 text-sm">
          These third-party services have their own privacy policies and data handling practices.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          We retain your information only as long as necessary to:
        </p>
        <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
          <li>Fulfill the purposes outlined in this privacy policy</li>
          <li>Comply with legal requirements</li>
          <li>Resolve disputes and enforce our agreements</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights (GDPR)</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          If you are located in the European Union, you have the right to:
        </p>
        <ul className="list-disc pl-5 text-gray-300 text-sm mb-3 space-y-1">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Object to processing of your information</li>
          <li>Data portability</li>
          <li>Restrict processing</li>
        </ul>
        <p className="text-gray-300 text-sm">
          To exercise these rights, please contact us using the information provided below.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">8. Data Security</h2>
        <p className="text-gray-300 text-sm">
          We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">9. Children's Privacy</h2>
        <p className="text-gray-300 text-sm">
          Wikwok is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete it immediately.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">10. Changes to This Policy</h2>
        <p className="text-gray-300 text-sm">
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Changes will be effective immediately upon posting.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">11. Contact Information</h2>
        <p className="text-gray-300 leading-relaxed mb-3">
          If you have questions, concerns, or requests regarding this privacy policy, please contact us:
        </p>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-300 text-sm">
            <strong>Email:</strong> rizperdana16@proton.me<br />
            <strong>Website:</strong> <Link href="https://wik-wok.vercel.app/contact" className="text-cerulean-500 hover:text-cerulean-400">Contact Form</Link>
          </p>
        </div>
      </section>
    </LegalLayout>
  );
}