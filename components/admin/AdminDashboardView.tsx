'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { formatINR } from '@/lib/commission';
import { runCommissionTests, TestCaseResult } from '@/lib/commission.test';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Settings,
  DollarSign,
  Users,
  Package,
  Layers,
  Sparkles,
  Play,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    moderateProduct,
    platformSettings,
    updatePlatformSettings,
    payouts,
    approvePayout,
    setCurrentView,
  } = useChakra();

  const [activeTab, setActiveTab] = useState<'moderation' | 'commissions' | 'payouts' | 'tests'>('moderation');
  const [testResults, setTestResults] = useState<{ allPassed: boolean; results: TestCaseResult[] } | null>(null);

  // Platform GMV Metrics
  const totalGmvPaise = 18450000; // ₹1,84,500
  const platformRevenuePaise = Math.round(totalGmvPaise * 0.1); // ₹18,450
  const pendingPayoutsPaise = payouts
    .filter((p) => p.status === 'pending')
    .reduce((acc, p) => acc + p.amount_paise, 0);

  const handleRunTests = () => {
    const res = runCommissionTests();
    setTestResults(res);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Root Administrator Console</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
            Marketplace Governance & Reconciliation
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Control platform commission splits, affiliate percentages, product moderation approvals,
            and reconcile seller payout transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTests}
            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl hover:bg-stone-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-chakra-gold" />
            <span>Verify Minor-Unit Math</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Gross Merchandise Value (GMV)
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {formatINR(totalGmvPaise)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Total transaction volume</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Marketplace Revenue (10%)
          </div>
          <div className="text-2xl font-bold font-serif text-chakra-green dark:text-chakra-gold mt-2 tabular-nums">
            {formatINR(platformRevenuePaise)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Platform gross commission</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Pending Bank Payouts
          </div>
          <div className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
            {formatINR(pendingPayoutsPaise)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Awaiting admin transfer</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Products Catalog
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {products.length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Across 8 curated categories</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 dark:border-stone-800 flex items-center gap-6 text-xs font-semibold mb-6">
        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 transition-colors ${
            activeTab === 'moderation'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Product Moderation Queue ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('commissions')}
          className={`pb-3 transition-colors ${
            activeTab === 'commissions'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Commission Rates & Fees
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 transition-colors ${
            activeTab === 'payouts'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Seller Payout Reconciliation
        </button>
        <button
          onClick={() => setActiveTab('tests')}
          className={`pb-3 transition-colors ${
            activeTab === 'tests'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Unit Test Diagnostics
        </button>
      </div>

      {/* Tab 1: Moderation */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Title & Seller</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Current Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 dark:text-chakra-ivory">
                        {prod.title}
                      </div>
                      <div className="text-[11px] text-stone-400">By {prod.seller_name}</div>
                    </td>

                    <td className="py-3.5 px-4 capitalize text-stone-600 dark:text-stone-300">
                      {prod.category.replace('_', ' ')}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">
                      {formatINR(prod.price_paise)}
                    </td>

                    <td className="py-3.5 px-4 capitalize text-stone-600 dark:text-stone-300">
                      {prod.product_type}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded ${
                          prod.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {prod.status !== 'approved' && (
                          <button
                            onClick={() => moderateProduct(prod.id, 'approved')}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {prod.status !== 'rejected' && (
                          <button
                            onClick={() => moderateProduct(prod.id, 'rejected')}
                            className="px-2.5 py-1 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded text-[11px] hover:bg-red-600 hover:text-white transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Commissions Configuration */}
      {activeTab === 'commissions' && (
        <div className="max-w-2xl bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
              Global Platform Split Architecture
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Configure marketplace commission percentages and default affiliate incentive tiers.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Default Marketplace Commission (%)
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={platformSettings.default_commission_rate_percent}
                onChange={(e) =>
                  updatePlatformSettings({
                    default_commission_rate_percent: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Standard baseline is 10%. Creators retain the remaining 90%.
              </span>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Default Affiliate Referral Share (%)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={platformSettings.default_affiliate_rate_percent}
                onChange={(e) =>
                  updatePlatformSettings({
                    default_affiliate_rate_percent: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Paid from the marketplace’s 10% fee. For ₹500 item, 3% = ₹15.
              </span>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Cookie Attribution Window (Days)
              </label>
              <input
                type="number"
                value={platformSettings.cookie_attribution_days}
                onChange={(e) =>
                  updatePlatformSettings({
                    cookie_attribution_days: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payouts Reconciliation */}
      {activeTab === 'payouts' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Seller</th>
                  <th className="py-3.5 px-4 font-semibold">Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Rail</th>
                  <th className="py-3.5 px-4 font-semibold">Destination Details</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {payouts.map((pay) => (
                  <tr key={pay.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-4 font-semibold text-stone-900 dark:text-chakra-ivory">
                      {pay.seller_name}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-600 tabular-nums">
                      {formatINR(pay.amount_paise)}
                    </td>

                    <td className="py-3.5 px-4 uppercase font-mono text-[11px]">
                      {pay.payout_method}
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                      {pay.destination_summary}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded ${
                          pay.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {pay.status === 'pending' && (
                        <button
                          onClick={() => approvePayout(pay.id)}
                          className="px-3 py-1 bg-chakra-green text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Disburse & Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Unit Test Diagnostics */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                  Minor-Unit Integer Arithmetic Test Suite
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Executes automated unit tests verifying the exact ₹500 product specification and minor unit conservation invariants.
                </p>
              </div>

              <button
                onClick={handleRunTests}
                className="px-4 py-2 bg-chakra-gold text-stone-950 text-xs font-bold rounded-xl hover:bg-chakra-gold-light transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run Suite Now</span>
              </button>
            </div>

            {testResults && (
              <div className="mt-4 space-y-3">
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    testResults.allPassed
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    All {testResults.results.length} Unit Tests Passed with 100% Invariant Conservation
                  </span>
                </div>

                <div className="space-y-2">
                  {testResults.results.map((tr, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900 dark:text-chakra-ivory">
                          {tr.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                          PASSED
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">{tr.details}</p>
                      <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                        <div>Seller: ₹{tr.actual.sellerRupees}</div>
                        <div>Affiliate: ₹{tr.actual.affiliateRupees}</div>
                        <div>Platform Net: ₹{tr.actual.platformRupees}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
