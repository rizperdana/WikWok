'use client';

import { useState } from 'react';
import Link from 'next/link';
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
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Form */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-gray-300 text-lg mb-8">
              We'd love to hear from you! Whether you have feedback, questions, or just want to say hello, feel free to reach out.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cerulean-500 transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cerulean-500 text-white rounded-lg hover:bg-cerulean-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <div className="text-green-400">
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you as soon as possible.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <a 
                  href="mailto:hello@wikwok.com" 
                  className="flex items-center gap-3 text-gray-300 hover:text-cerulean-400 transition-colors"
                >
                  <Mail size={20} />
                  hello@wikwok.com
                </a>
                
                <a 
                  href="mailto:support@wikwok.com" 
                  className="flex items-center gap-3 text-gray-300 hover:text-cerulean-400 transition-colors"
                >
                  <Mail size={20} />
                  support@wikwok.com
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a 
                  href="https://github.com/wikwok" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://twitter.com/wikwok" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-700 rounded-lg text-gray-300 hover:text-white hover:bg-gray-600 transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* Common Topics */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Common Topics</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-cerulean-500">•</span>
                  General feedback and suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cerulean-500">•</span>
                  Bug reports and technical issues
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cerulean-500">•</span>
                  Partnership opportunities
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cerulean-500">•</span>
                  Media inquiries
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cerulean-500">•</span>
                  Educational partnerships
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}