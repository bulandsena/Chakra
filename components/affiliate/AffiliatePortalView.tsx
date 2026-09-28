'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { formatINR } from '@/lib/commission';
import {
  Sparkles,
  Link2,
  Copy,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const AffiliatePortalView: React.FC = () => {
  const {
    user,
    products,
    affiliateLinks,
    generateAffiliateLink,
    t,
  } = useChakra();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);

  const eligibleProducts = products.filter((p) => p.affiliate_eligible);

  const totalClicks = affiliateLinks.reduce((a, b) => a + b.clicks, 0);
  const totalConversions = affiliateLinks.reduce((a, b) => a + b.conversions, 0);
  const totalPendingPaise = affiliateLinks.reduce((a, b) => a + b.pending_commission_paise, 0);
  const totalPaidPaise = affiliateLinks.reduce((a, b) => a + b.paid_earnings_paise, 0);

  const handleGenerate = () => {
    if (!selectedProductId) return;
    const link = generateAffiliateLink(selectedProductId);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-chakra-gold" />
          <span>Growth Partner Ecosystem</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          {t.affiliate.portalTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
          {t.affiliate.tagline}. Every genuine referred purchase earns you direct UPI settlements,
          tracked with 30-day attribution cookies and zero leakages.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            {t.affiliate.totalClicks}
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {totalClicks}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Unique referrals tracked</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            {t.affiliate.validConversions}
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {totalConversions}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Verified completed orders</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            {t.affiliate.pendingEarnings}
          </div>
          <div className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
            {formatINR(totalPendingPaise)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Clears after 7-day refund period</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            {t.affiliate.paidEarnings}
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {formatINR(totalPaidPaise)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Disbursed via UPI</div>
        </div>
      </div>

      {/* Link Generator Box */}
      <div className="p-6 sm:p-8 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs my-8 space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory flex items-center gap-2">
            <Link2 className="w-5 h-5 text-chakra-gold" />
            Generate Tracked Referral Link
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Your unique partner code is <strong className="font-mono text-chakra-gold">{user.affiliate_profile?.affiliate_code}</strong>.
            Select any eligible product to generate an instant attribution link.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:border-chakra-gold"
          >
            {eligibleProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({formatINR(p.price_paise)} - 3% Commission = ~₹
                {((p.price_paise * 0.03) / 100).toFixed(0)})
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            className="px-6 py-2.5 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Generate & Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Links Table */}
      <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
            Active Referral Campaigns & Attributions
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Product</th>
                <th className="py-3.5 px-4 font-semibold">Attributed Clicks</th>
                <th className="py-3.5 px-4 font-semibold">Conversions</th>
                <th className="py-3.5 px-4 font-semibold">Pending Commission</th>
                <th className="py-3.5 px-4 font-semibold">Paid to Bank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
              {affiliateLinks.map((link) => (
                <tr key={link.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                  <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-chakra-ivory">
                    {link.product_title}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-stone-600 dark:text-stone-300">
                    {link.clicks}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-emerald-600">
                    {link.conversions}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-amber-600 font-medium">
                    {formatINR(link.pending_commission_paise)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-emerald-600 font-bold">
                    {formatINR(link.paid_earnings_paise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Affiliate Integrity Guidelines */}
      <div className="mt-8 p-5 bg-stone-50 dark:bg-[#132C28]/40 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-600 dark:text-stone-300 space-y-2">
        <h4 className="font-semibold text-stone-900 dark:text-chakra-ivory flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-chakra-gold" />
          Affiliate Program Rules & Anti-Fraud Governance
        </h4>
        <p className="leading-relaxed">
          Self-referrals (buying through your own link) are prohibited and flagged automatically by the ledger.
          Commissions are awarded upon successful server-side payment verification and undergo a 7-day refund clearing window.
          We never guarantee arbitrary income; earnings depend strictly on genuine value creation and real audience engagement.
        </p>
      </div>
    </div>
  );
};
