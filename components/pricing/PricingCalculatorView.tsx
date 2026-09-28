'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { calculateCommission, formatINR, paiseToRupees, rupeesToPaise } from '@/lib/commission';
import {
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  Users,
  Info,
} from 'lucide-react';

export const PricingCalculatorView: React.FC = () => {
  const { setCurrentView } = useChakra();
  const [productPriceRupees, setProductPriceRupees] = useState<number>(500);
  const [platformRatePercent, setPlatformRatePercent] = useState<number>(10);
  const [affiliateRatePercent, setAffiliateRatePercent] = useState<number>(3);
  const [hasAffiliate, setHasAffiliate] = useState<boolean>(true);

  const pricePaise = rupeesToPaise(Math.max(1, productPriceRupees || 0));
  const breakdown = calculateCommission({
    productPricePaise: pricePaise,
    platformCommissionRatePercent: platformRatePercent,
    affiliateCommissionRatePercent: affiliateRatePercent,
    hasAffiliate,
  });

  // Calculate equivalent loss on typical international platforms (Gumroad/Etsy: ~10% platform + 3% card + 3.5% FX cross-border fee)
  const legacyLossRupees = Math.round(productPriceRupees * 0.22); // ~22% total loss
  const legacyTakeHomeRupees = productPriceRupees - legacyLossRupees;
  const chakraTakeHomeRupees = paiseToRupees(breakdown.seller_net_paise);
  const extraEarningsRupees = chakraTakeHomeRupees - legacyTakeHomeRupees;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-stone-800 text-chakra-gold-dark dark:text-chakra-gold text-xs font-bold rounded-full mb-3">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>Transparent 10% Math</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          Pricing & Real-Time Commission Calculator
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          No monthly subscription charges. No listing fees. No hidden foreign exchange deductions.
          Creators only pay when they make a sale.
        </p>
      </div>

      {/* Interactive Calculator Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Columns: Interactive Controls */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
              Product Retail Price in INR (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                min={49}
                max={100000}
                value={productPriceRupees}
                onChange={(e) => setProductPriceRupees(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono text-xl font-bold text-stone-900 dark:text-chakra-ivory focus:outline-none focus:border-chakra-gold"
              />
            </div>
            {/* Quick buttons */}
            <div className="flex items-center gap-2 mt-2.5">
              {[299, 499, 999, 1499, 2999].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setProductPriceRupees(amt)}
                  className="px-2.5 py-1 text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Commission Rate Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              <span>Platform Commission:</span>
              <span className="font-bold text-chakra-gold-dark dark:text-chakra-gold tabular-nums">
                {platformRatePercent}%
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={15}
              step={1}
              value={platformRatePercent}
              onChange={(e) => setPlatformRatePercent(Number(e.target.value))}
              className="w-full accent-chakra-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>5% (Volume Tier)</span>
              <span>10% (Default)</span>
              <span>15% (Managed)</span>
            </div>
          </div>

          {/* Affiliate Toggle & Rate */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                  Attributed via Affiliate Referral?
                </div>
                <div className="text-[11px] text-stone-500">
                  Affiliate cut is paid out of CHAKRA’s platform share.
                </div>
              </div>
              <input
                type="checkbox"
                checked={hasAffiliate}
                onChange={(e) => setHasAffiliate(e.target.checked)}
                className="w-5 h-5 accent-chakra-gold cursor-pointer"
              />
            </div>

            {hasAffiliate && (
              <div>
                <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  <span>Affiliate Share Rate:</span>
                  <span className="font-bold text-amber-600 tabular-nums">
                    {affiliateRatePercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={affiliateRatePercent}
                  onChange={(e) => setAffiliateRatePercent(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right 6 Columns: Real-Time Results Card */}
        <div className="lg:col-span-6 bg-stone-50 dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                Net Payout Breakdown
              </span>
              <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                {formatINR(pricePaise)} Total Sale
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-stone-400">Minor Units:</span>
              <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 tabular-nums">
                {pricePaise.toLocaleString()} paise
              </div>
            </div>
          </div>

          {/* Breakdown Items */}
          <div className="space-y-3.5">
            {/* Seller */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                    Seller Net Take-Home
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {100 - platformRatePercent}% direct bank transfer
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600 tabular-nums">
                  {formatINR(breakdown.seller_net_paise)}
                </div>
                <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                  {breakdown.seller_net_paise.toLocaleString()} paise
                </div>
              </div>
            </div>

            {/* Affiliate */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                    Affiliate Promoter
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {hasAffiliate ? `${affiliateRatePercent}% referral commission` : 'None (Organic sale)'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-amber-600 tabular-nums">
                  {formatINR(breakdown.affiliate_fee_paise)}
                </div>
                <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                  {breakdown.affiliate_fee_paise.toLocaleString()} paise
                </div>
              </div>
            </div>

            {/* Platform */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-stone-800 text-chakra-gold flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                    CHAKRA Platform Net
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Retained fee after affiliate payout
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">
                  {formatINR(breakdown.platform_net_fee_paise)}
                </div>
                <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                  {breakdown.platform_net_fee_paise.toLocaleString()} paise
                </div>
              </div>
            </div>
          </div>

          {/* Comparison box */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs space-y-1">
            <div className="font-bold text-emerald-900 dark:text-emerald-300">
              You keep ₹{extraEarningsRupees} MORE on CHAKRA per sale
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
              Compared to international platforms that charge ~22% in combined fees and currency conversion tolls.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('become-seller')}
            className="w-full py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Start Selling Today at 10% Fee</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
