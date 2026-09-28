'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { Store, CheckCircle2, ArrowRight, ShieldCheck, IndianRupee, Sparkles } from 'lucide-react';

export const BecomeSellerView: React.FC = () => {
  const { updateUserProfile, setActiveRole, setCurrentView, t } = useChakra();

  const [storeName, setStoreName] = useState('');
  const [storeBio, setStoreBio] = useState('');
  const [category, setCategory] = useState('ebooks');
  const [upiId, setUpiId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName) return;

    const slug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    updateUserProfile({
      seller_profile: {
        store_name: storeName,
        store_slug: slug,
        store_description: storeBio || 'Creator storefront on CHAKRA.',
        verified: true,
        verification_status: 'approved',
        payout_account: {
          account_holder_name: 'Store Owner',
          bank_name: 'HDFC Bank',
          account_number: '•••• •••• 4120',
          ifsc_code: 'HDFC0001245',
          upi_id: upiId || 'creator@upi',
          kyc_approved: true,
        },
      },
    });

    setSubmitted(true);
    setTimeout(() => {
      setActiveRole('seller');
      setCurrentView('seller-dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full mb-3">
          <Store className="w-3.5 h-3.5" />
          <span>Launch in 5 Minutes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          Open Your Sovereign Creator Store
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
          Sell eBooks, PDF notes, code packages, design systems, and handcrafted arts with direct Indian UPI payouts.
          Keep 90% of every rupee you generate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left 5 Columns: Benefits */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
              Why Creators Choose CHAKRA
            </h3>

            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>90% Creator Take-Home:</strong> Fixed 10% platform fee. Zero foreign currency conversion losses.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Instant UPI Payouts:</strong> Direct bank and UPI withdrawals with statutory tax receipts.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tokenized DRM Delivery:</strong> Authenticated download links that prevent unauthorized sharing.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Built-in Affiliate Army:</strong> Partners promote your product for 3% without cutting into your 90%.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 7 Columns: Instant Onboarding Form */}
        <div className="md:col-span-7 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-chakra-ivory">
                Storefront Initialized!
              </h3>
              <p className="text-xs text-stone-500">
                Redirecting to your Creator Studio where you can publish your first product...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Creator Store Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sahyadri Literature & Notes"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Primary Product Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                >
                  <option value="ebooks">eBooks & PDF Notes</option>
                  <option value="storybooks">Story Books & Literature</option>
                  <option value="education">Exam Prep & Handouts</option>
                  <option value="templates">Templates & UI Systems</option>
                  <option value="courses">Online Courses & Tutorials</option>
                  <option value="artisan_crafts">Heritage Brass & Handcrafts</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Store Bio / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="What makes your digital guides or crafts unique?"
                  value={storeBio}
                  onChange={(e) => setStoreBio(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                  Settlement UPI ID (Google Pay / PhonePe) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono text-stone-900 dark:text-white"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Used for verified earnings payouts
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Create My Store & Open Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
