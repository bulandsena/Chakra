'use client';

import React from 'react';
import { useChakra } from '@/context/ChakraContext';
import { calculateCommission, formatINR, rupeesToPaise } from '@/lib/commission';
import { ShieldCheck, ArrowRight, Check, Users, Sparkles, Store, IndianRupee } from 'lucide-react';

export const CommissionExplainer: React.FC = () => {
  const { setCurrentView } = useChakra();

  // Prompt's exact ₹1,000 benchmark product with fixed 20% CHAKRA commission
  const sampleBreakdown = calculateCommission({
    productPricePaise: rupeesToPaise(1000), // 100,000 paise
    platformCommissionRatePercent: 20, // FIXED 20%
    affiliateCommissionRatePercent: 3,
    hasAffiliate: true,
  });

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-[#132C28] transition-colors border-b border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Sovereign Creator Revenue Contract</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory leading-tight">
              Fixed 20% Marketplace Split.{' '}
              <span className="text-chakra-gold-dark dark:text-chakra-gold block mt-1">
                Creators Keep 80% Net Share.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              CHAKRA establishes a predictable, transparent commerce model for Indian creators.
              Every order snapshot records immutable accounting entries in integer minor units (paise),
              powering instant Razorpay UPI payouts and permitted Route split settlements.
            </p>

            <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>80% Creator Share:</strong> Sellers receive ₹800 on a standard ₹1,000 product sale.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>20% CHAKRA Commission:</strong> Powers encrypted storage, bandwidth, and platform security.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>3% Optional Affiliate:</strong> Funded transparently without extra tolls on creators.
                </span>
              </li>
            </ul>

            {/* Official Legal Financial Disclaimer */}
            <div className="p-3.5 bg-stone-50 dark:bg-[#1a2e2b] rounded-xl border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 font-mono leading-relaxed">
              &ldquo;CHAKRA commission: 20% before applicable payment gateway charges, taxes, refunds, chargebacks and other applicable adjustments.&rdquo;
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCurrentView('pricing')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all shadow-xs cursor-pointer"
              >
                <span>Launch Interactive Commission Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual Breakdown Card (₹1,000 Benchmark) */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[11px] font-mono uppercase text-stone-500">Benchmark Sale</span>
                  <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                    ₹1,000.00 Digital Product Sale
                  </div>
                </div>
                <div className="px-3 py-1 bg-stone-200 dark:bg-stone-800 rounded-lg text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                  100,000 Paise
                </div>
              </div>

              {/* Step Breakdown Blocks */}
              <div className="space-y-3">
                {/* Seller Share (80%) */}
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                        Creator / Seller Share (80%)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        80% direct Route transfer / UPI settlement
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-600 tabular-nums">
                      {formatINR(sampleBreakdown.seller_gross_amount_paise)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                      80,000 paise
                    </div>
                  </div>
                </div>

                {/* CHAKRA Commission (20%) */}
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 text-chakra-gold flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                        CHAKRA Owner Commission (20%)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Marketplace gross fee snapshot
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-chakra-green dark:text-chakra-gold tabular-nums">
                      {formatINR(sampleBreakdown.platform_gross_fee_paise)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                      20,000 paise
                    </div>
                  </div>
                </div>

                {/* Payment Gateway Fee & Taxes (approx 2.36%) */}
                <div className="p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-500">
                    <IndianRupee className="w-4 h-4 text-stone-400" />
                    <span>Estimated Razorpay MDR (~2% + GST):</span>
                  </div>
                  <div className="text-right font-mono font-bold text-red-500 tabular-nums">
                    {formatINR(sampleBreakdown.estimated_payment_gateway_fee_paise)}
                  </div>
                </div>
              </div>

              {/* Exact Invariant verification footnote */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-mono border-t border-stone-200 dark:border-stone-800">
                <span>Conservation check: 800 + 200</span>
                <span className="font-bold text-stone-900 dark:text-chakra-ivory">
                  = ₹1,000.00 Exact (Zero Leaks)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
