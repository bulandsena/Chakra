'use client';

import React, { useState } from 'react';
import { ShieldCheck, HelpCircle, FileText, Lock, AlertCircle, ChevronDown } from 'lucide-react';

interface LegalPagesViewProps {
  initialTab?: 'terms' | 'privacy' | 'refund' | 'copyright' | 'help';
}

export const LegalPagesView: React.FC<LegalPagesViewProps> = ({ initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund' | 'copyright' | 'help'>(initialTab);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does digital download delivery work on CHAKRA?',
      a: 'When an order is confirmed via Razorpay, our server generates a secure, tokenized download ticket. You can download the DRM-free PDF, eBook, code archive, or template immediately from your order confirmation screen or the "My Downloads" library. Download links are protected by single-user licensing and maximum download counters.',
    },
    {
      q: 'What is the marketplace commission split?',
      a: 'CHAKRA operates on a sovereign 10% marketplace commission. Creators keep 90% of their gross earnings. If an approved affiliate refers the sale, the 3% affiliate commission is deducted directly from CHAKRA’s 10% share, meaning the seller always retains their full 90%.',
    },
    {
      q: 'How and when do sellers receive payouts?',
      a: 'Sellers can withdraw their earnings once they accumulate at least ₹1,000. Payouts are transferred directly into verified Indian bank accounts via IMPS/NEFT or instantly through UPI VPAs (Google Pay, PhonePe, Paytm).',
    },
    {
      q: 'Can physical goods also be sold alongside digital files?',
      a: 'Yes! CHAKRA supports physical handcrafted products, books, stationery, and heritage items. Sellers configure shipping inventory, packaging weight, and delivery tracking numbers.',
    },
    {
      q: 'What happens if a digital file is corrupt or defective?',
      a: 'Under our Fair Digital Refund Policy, if a downloaded file is corrupted or materially differs from its stated description, buyers may request a refund or replacement within 7 days of purchase.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'terms'
              ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'privacy'
              ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveTab('refund')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'refund'
              ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Refund & Cancellation
        </button>
        <button
          onClick={() => setActiveTab('copyright')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'copyright'
              ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Copyright & Takedown
        </button>
        <button
          onClick={() => setActiveTab('help')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'help'
              ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Help Center & FAQ
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
        {activeTab === 'terms' && (
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              CHAKRA Marketplace Terms and Conditions
            </h2>
            <p className="text-stone-500 text-xs">Last updated: February 2026</p>
            <p>
              Welcome to CHAKRA (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;platform&rdquo;), a multi-vendor marketplace connecting
              independent authors, educators, engineers, and artisans with global buyers. By registering, buying, or selling on CHAKRA,
              you agree to these Terms.
            </p>
            <h4 className="font-bold text-stone-900 dark:text-chakra-ivory">1. Seller Ownership & Declarations</h4>
            <p>
              Sellers warrant that all digital files, eBooks, code repos, and audio uploaded to CHAKRA are original works or licensed with
              full commercial distribution rights. Plagiarism, piracy, or distribution of scraped materials results in permanent account
              termination and forfeiture of unsettled balances.
            </p>
            <h4 className="font-bold text-stone-900 dark:text-chakra-ivory">2. Marketplace Split & Payouts</h4>
            <p>
              CHAKRA retains a standard 10% platform fee on completed sales. Sellers receive 90% net earnings minus applicable regulatory TDS.
              Payouts are disbursed upon request once the minimum withdrawal threshold of ₹1,000 is met.
            </p>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Privacy Policy (DPDP Act Compliance)
            </h2>
            <p className="text-stone-500 text-xs">Governed by India’s Digital Personal Data Protection Act</p>
            <p>
              We collect minimal personal data required strictly to process transactions, deliver digital files, and prevent affiliate fraud.
              We never sell or rent your personal information to third-party data brokers.
            </p>
            <h4 className="font-bold text-stone-900 dark:text-chakra-ivory">Data We Collect</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact Details: Name, email address, phone number for digital token delivery.</li>
              <li>Transaction Records: Razorpay payment identifiers (card details are never stored on CHAKRA servers).</li>
              <li>Seller KYC: Bank account numbers, IFSC codes, and PAN numbers for statutory tax reporting.</li>
            </ul>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Refund & Cancellation Policy
            </h2>
            <p>
              Due to the immediate access nature of digital goods (eBooks, PDF notes, code packages), digital purchases are generally final.
              However, CHAKRA upholds a <strong>7-Day Fair Digital Protection Guarantee</strong> under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>The downloaded file is corrupt, unreadable, or missing critical promised assets.</li>
              <li>The content materially contradicts the published storefront description.</li>
              <li>Duplicate accidental transactions for the same digital product within 24 hours.</li>
            </ul>
            <p>
              For physical handcrafted goods, returns are accepted within 7 days of delivery for damaged or defective items in original packaging.
            </p>
          </div>
        )}

        {activeTab === 'copyright' && (
          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 space-y-4">
            <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Copyright & Takedown Policy (Indian Copyright Act & DMCA)
            </h2>
            <p>
              CHAKRA respects intellectual property rights. If you believe your copyrighted work has been improperly distributed on CHAKRA
              without authorization, submit an expedited takedown notice to <strong>dmca@chakra-marketplace.in</strong> with:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>The specific CHAKRA product URL containing the infringing material.</li>
              <li>Your contact information (name, address, telephone, email).</li>
              <li>A declaration that you hold good faith belief of unauthorized use.</li>
            </ol>
            <p>
              Infringing items are removed within 24 business hours pending seller response.
            </p>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Everything you need to know about purchasing, selling, and earning on CHAKRA.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-900 dark:text-chakra-ivory hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        expandedFaq === i ? 'rotate-180 text-chakra-gold' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === i && (
                    <div className="p-4 pt-0 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
