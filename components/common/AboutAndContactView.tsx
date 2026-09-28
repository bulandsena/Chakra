'use client';

import React, { useState } from 'react';
import { ChakraLogo } from '@/components/common/ChakraLogo';
import { Mail, MapPin, Phone, Send, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

interface AboutAndContactViewProps {
  initialMode?: 'about' | 'contact';
}

export const AboutAndContactView: React.FC<AboutAndContactViewProps> = ({ initialMode = 'about' }) => {
  const [mode, setMode] = useState<'about' | 'contact'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Mode switch */}
      <div className="flex justify-center mb-10">
        <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1 border border-stone-200 dark:border-stone-700">
          <button
            onClick={() => setMode('about')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'about'
                ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            About CHAKRA
          </button>
          <button
            onClick={() => setMode('contact')}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              mode === 'contact'
                ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Contact & Support
          </button>
        </div>
      </div>

      {mode === 'about' ? (
        <div className="space-y-12">
          {/* Hero Story */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <ChakraLogo size={64} showWordmark={false} className="mx-auto" />
            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Reimagining Indian Creator Sovereignty
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              CHAKRA (&ldquo;चक्र&rdquo;) symbolizes the eternal wheel of value creation, distribution, and fair prosperity.
              We were founded on a simple principle: Indian creators should not have to surrender 30% of their life&rsquo;s work
              to foreign middlemen simply to sell a PDF book or design system.
            </p>
          </div>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-chakra-ivory dark:bg-stone-800 text-chakra-gold flex items-center justify-center font-bold">
                90%
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                The Sovereign Split
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Creators retain 90% of every sale. We take only 10% to sustain secure download servers,
                Razorpay banking fees, and automated affiliate tracking.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-chakra-ivory dark:bg-stone-800 text-chakra-gold flex items-center justify-center font-bold">
                UPI
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Native Indian Banking
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Built from day one for Indian UPI (Google Pay, PhonePe, Paytm), RuPay, and direct NEFT/IMPS bank settlements.
                Zero foreign currency markups.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-chakra-ivory dark:bg-stone-800 text-chakra-gold flex items-center justify-center font-bold">
                DRM
              </div>
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Protected Token Delivery
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Digital files are hosted in private encrypted storage. Links expire and download limits prevent unauthorized sharing.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 space-y-6">
            <div>
              <h2 className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Get in Touch with CHAKRA
              </h2>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Whether you are an author wanting to migrate thousands of readers, an affiliate wanting partnership,
                or a buyer needing download assistance — we respond within 12 hours.
              </p>
            </div>

            <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-chakra-gold shrink-0" />
                <span>support@chakra-marketplace.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-chakra-gold shrink-0" />
                <span>+91 20 6712 9000 (Mon - Sat, 10 AM - 6 PM IST)</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-chakra-gold shrink-0 mt-0.5" />
                <span>
                  CHAKRA Technologies Pvt Ltd, Senapati Bapat Road, Shivaji Nagar, Pune, Maharashtra 411016
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            {sent ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                  Message Dispatched!
                </h4>
                <p className="text-xs text-stone-500">
                  Our creator support team has received your ticket and will reply via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sathe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Creator store migration inquiry"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist your creator journey today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Support Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
