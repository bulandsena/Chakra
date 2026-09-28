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
  const [productPriceRupees, setProductPriceRupees] = useState<number>(1000);
  const [platformRatePercent, setPlatformRatePercent] = useState<number>(20); // Fixed 20% default
  const [affiliateRatePercent, setAffiliateRatePercent] = useState<number>(3);
  const [hasAffiliate, setHasAffiliate] = useState<boolean>(false);

  const pricePaise = rupeesToPaise(Math.max(1, productPriceRupees || 0));
  const breakdown = calculateCommission({
    productPricePaise: pricePaise,
    platformCommissionRatePercent: platformRatePercent,
    affiliateCommissionRatePercent: affiliateRatePercent,
    hasAffiliate,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-stone-800 text-chakra-gold-dark dark:text-chakra-gold text-xs font-bold rounded-full mb-3">
          <IndianRupee className="w-3.5 h-3.5" />
          <span>CHAKRA 20% Owner Commission Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          Pricing & Real-Time Commission Calculator
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          The CHAKRA website owner/admin receives a fixed 20% marketplace commission from every successful eligible sale.
          Sellers receive the remaining 80%, subject to payment gateway fees, taxes, refunds, and adjustments.
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
              {[499, 1000, 1500, 2500, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setProductPriceRupees(amt)}
                  className="px-2.5 py-1 text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-lg hover:bg-stone-200 transition-colors font-medium"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Platform Commission Rate Slider */}
          <div>
            <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
              <span>CHAKRA Owner Commission:</span>
              <span className="font-bold text-chakra-gold-dark dark:text-chakra-gold tabular-nums">
                {platformRatePercent}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={1}
              value={platformRatePercent}
              onChange={(e) => setPlatformRatePercent(Number(e.target.value))}
              className="w-full accent-chakra-gold cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>10% (Promo)</span>
              <span>20% (Standard Fixed Model)</span>
              <span>30% (High Volume)</span>
            </div>
          </div>

          {/* Affiliate Toggle */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                  Attributed via Affiliate Referral?
                </div>
                <div className="text-[11px] text-stone-500">
                  Affiliate commission is deducted transparently from marketplace share.
                </div>
              </div>
              <input
                type="checkbox"
                checked={hasAffiliate}
                onChange={(e) => setHasAffiliate(e.target.checked)}
                className="w-5 h-5 accent-chakra-gold cursor-pointer"
              />
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl text-[11px] text-stone-500 leading-relaxed font-mono">
            &ldquo;CHAKRA commission: 20% before applicable payment gateway charges, taxes, refunds, chargebacks and other applicable adjustments.&rdquo;
          </div>
        </div>

        {/* Right 6 Columns: Real-Time Results Card */}
        <div className="lg:col-span-6 bg-stone-50 dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500">
                Order Split Breakdown
              </span>
              <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                {formatINR(pricePaise)} Gross Sale
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
            {/* Seller (80%) */}
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                    Seller Gross Share (80%)
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Route transfer to linked account
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-600 tabular-nums">
                  {formatINR(breakdown.seller_gross_amount_paise)}
                </div>
                <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                  {breakdown.seller_gross_amount_paise.toLocaleString()} paise
                </div>
              </div>
            </div>

            {/* Owner Commission (20%) */}
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
                    Retained in merchant settlement balance
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-chakra-green dark:text-chakra-gold tabular-nums">
                  {formatINR(breakdown.platform_gross_fee_paise)}
                </div>
                <div className="text-[10px] text-stone-400 font-mono tabular-nums">
                  {breakdown.platform_gross_fee_paise.toLocaleString()} paise
                </div>
              </div>
            </div>

            {/* Gateway Fee (estimated) */}
            <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-stone-500">Estimated Gateway Fee (~2.36% MDR + GST):</span>
              <span className="font-mono font-bold text-red-500 tabular-nums">
                {formatINR(breakdown.estimated_payment_gateway_fee_paise)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('become-seller')}
            className="w-full py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Start Selling Today (80% Seller Share)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
