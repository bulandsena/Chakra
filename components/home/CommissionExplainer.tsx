'use client';

import React from 'react';
import { useChakra } from '@/context/ChakraContext';
import { calculateCommission, formatINR, rupeesToPaise } from '@/lib/commission';
import { ShieldCheck, ArrowRight, Check, Users, Sparkles, Store } from 'lucide-react';

export const CommissionExplainer: React.FC = () => {
  const { setCurrentView } = useChakra();

  // Prompt's exact ₹500 product example
  const sampleBreakdown = calculateCommission({
    productPricePaise: rupeesToPaise(500), // 50000 paise
    platformCommissionRatePercent: 10,
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
              <span>Transparent Creator Economics</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory leading-tight">
              Fair 10% Platform Cut.{' '}
              <span className="text-chakra-gold-dark dark:text-chakra-gold block mt-1">
                Zero Foreign Exchange Tolls.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Western digital platforms charge upwards of 30% plus 3.5% foreign currency conversion fees.
              CHAKRA runs natively on Indian banking rails with instant UPI payouts, transparent integer-minor unit accounting,
              and genuine affiliate incentives funded directly out of the platform’s share.
            </p>

            <ul className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>90% Creator Share:</strong> Sellers receive ₹450 on every ₹500 product sale.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>3% Affiliate Partner Share:</strong> Genuine promoters receive ₹15 from the marketplace’s cut.
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>
                  <strong>7% Sustainable Infrastructure:</strong> CHAKRA retains ₹35 to power servers, bandwidth, and security.
                </span>
              </li>
            </ul>

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

          {/* Right Visual Breakdown Card */}
          <div className="lg:col-span-6">
            <div className="p-6 sm:p-8 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-[11px] font-mono uppercase text-stone-500">Benchmark Transaction</span>
                  <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                    ₹500.00 Digital Product Sale
                  </div>
                </div>
                <div className="px-3 py-1 bg-stone-200 dark:bg-stone-800 rounded-lg text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                  50,000 Paise
                </div>
              </div>

              {/* 3 Step Breakdown Blocks */}
              <div className="space-y-3">
                {/* Seller Share */}
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                        Creator / Seller Receives
                      </div>
                      <div className="text-[11px] text-stone-500">
                        90% direct payout into Indian bank
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-600 tabular-nums">
                      {formatINR(sampleBreakdown.seller_net_paise)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                      45,000 paise
                    </div>
                  </div>
                </div>

                {/* Affiliate Share */}
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                        Affiliate Promoter Earns
                      </div>
                      <div className="text-[11px] text-stone-500">
                        3% commission (paid from platform cut)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-amber-600 tabular-nums">
                      {formatINR(sampleBreakdown.affiliate_fee_paise)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                      1,500 paise
                    </div>
                  </div>
                </div>

                {/* Marketplace Net */}
                <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 text-chakra-gold flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                        CHAKRA Marketplace
                      </div>
                      <div className="text-[11px] text-stone-500">
                        7% net operating & hosting share
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold text-chakra-green dark:text-chakra-gold tabular-nums">
                      {formatINR(sampleBreakdown.platform_net_fee_paise)}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                      3,500 paise
                    </div>
                  </div>
                </div>
              </div>

              {/* Exact Invariant verification footnote */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500 font-mono border-t border-stone-200 dark:border-stone-800">
                <span>Conservation check: 450 + 15 + 35</span>
                <span className="font-bold text-stone-900 dark:text-chakra-ivory">
                  = ₹500.00 Exact (Zero Leaks)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
