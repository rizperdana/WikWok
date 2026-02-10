import { Metadata } from 'next';
import ContactPage from './page';

export const metadata: Metadata = {
  title: 'Contact Us - Wikwok',
  description: 'Contact Wikwok - Wikipedia Discovery Engine. Get in touch with our team for support, feedback, partnerships, or general inquiries.',
  keywords: ['contact wikwok', 'support', 'feedback', 'partnerships', 'customer service', 'help'],
  robots: 'index, follow',
};

export default function ContactLayout() {
  return <ContactPage />;
}