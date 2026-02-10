'use client';

import { useState } from 'react';
import { LegalLayout } from '@/components/legal-layout';
import { Mail, Send, Github, Twitter } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission - replace with actual endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <LegalLayout title="Get in Touch" description="We'd love to hear from you!">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Contact Form */}
        <div>
          <p className="text-gray-300 leading-relaxed mb-6">
            Whether you have feedback, questions, or just want to say hello, feel free to reach out.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2 text-sm">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors text-sm"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2 text-sm">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors text-sm"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2 text-sm">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors text-sm"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2 text-sm">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors resize-none text-sm"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-cerulean-500 text-white rounded-lg hover:bg-cerulean-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400">
                <h3 className="font-semibold mb-1">Message Sent!</h3>
                <p className="text-sm">Thank you for reaching out. We'll get back to you as soon as possible.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Quick Contact</h3>
            <div className="space-y-3">
              <a 
                href="mailto:rizperdana16@proton.me" 
                className="flex items-center gap-3 text-gray-300 hover:text-cerulean-400 transition-colors"
              >
                <Mail size={16} />
                <span className="text-sm">rizperdana16@proton.me</span>
              </a>
              
              <a 
                href="mailto:rizperdana16@proton.me" 
                className="flex items-center gap-3 text-gray-300 hover:text-cerulean-400 transition-colors"
              >
                <Mail size={16} />
                <span className="text-sm">support@wik-wok.vercel.app</span>
              </a>
            </div>
          </div>

          {/* Social */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Follow Us</h3>
            <div className="flex gap-3">
              <a 
                href="https://github.com/wikwok" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
              >
                <Github size={16} />
              </a>
              <a 
                href="https://twitter.com/wikwok" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Common Topics */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-3">Common Topics</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-cerulean-500">•</span>
                <span>General feedback and suggestions</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cerulean-500">•</span>
                <span>Bug reports and technical issues</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cerulean-500">•</span>
                <span>Partnership opportunities</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cerulean-500">•</span>
                <span>Media inquiries</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cerulean-500">•</span>
                <span>Educational partnerships</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
}