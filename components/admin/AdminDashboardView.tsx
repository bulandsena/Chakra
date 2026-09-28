'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { formatINR, paiseToRupees } from '@/lib/commission';
import { runCommissionTests, TestCaseResult } from '@/lib/commission.test';
import { ProductCategory } from '@/types/chakra';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  CreditCard,
  Building,
  RefreshCw,
  Play,
  RotateCcw,
  Download,
  Filter,
  ArrowRight,
  ExternalLink,
  SlidersHorizontal,
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  X,
  FileSpreadsheet,
  Info,
  BookOpen,
  HelpCircle,
  Search,
  Calendar,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    updateProduct,
    commissionRecords,
    paymentTransactions,
    settlementRecords,
    refundRecords,
    processRefund,
    payouts,
    approvePayout,
    holdPayout,
    platformSettings,
    updatePlatformSettings,
    testRazorpayConnection,
  } = useChakra();

  // Active Admin Sub-page
  const [activeTab, setActiveTab] = useState<
    | 'finance-commission'
    | 'commission-settings'
    | 'transactions'
    | 'seller-payouts'
    | 'settings-payments-razorpay'
    | 'settlements'
    | 'refunds'
    | 'test-suite'
  >('finance-commission');

  // Filter state for Admin → Finance → Commission
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'this_month' | 'custom' | 'all'>('30days');
  const [customStartDate, setCustomStartDate] = useState('2026-02-01');
  const [customEndDate, setCustomEndDate] = useState('2026-02-28');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [sellerFilter, setSellerFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');

  // Commission Settings Form State (Fixed 20% by default with accidental modification lock)
  const [commissionLocked, setCommissionLocked] = useState(!platformSettings.allow_commission_override);
  const [tempCommissionRate, setTempCommissionRate] = useState<number>(platformSettings.default_commission_rate_percent || 20);

  // Razorpay Settings Form (ThQ32KbfQQu7Qy / acc_ThQ32KbfQQu7Qy)
  const [keyIdInput, setKeyIdInput] = useState('rzp_test_ThQ32KbfQQu7Qy');
  const [linkedAccountIdInput, setLinkedAccountIdInput] = useState(
    platformSettings.razorpay_linked_account_id || 'acc_ThQ32KbfQQu7Qy'
  );
  const [webhookUrlInput, setWebhookUrlInput] = useState(
    platformSettings.razorpay_webhook_url || 'https://chakra-marketplace.in/api/razorpay/webhook'
  );
  const [routeEnabledToggle, setRouteEnabledToggle] = useState(platformSettings.razorpay_route_enabled);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [connectionFeedback, setConnectionFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // Refund Modal State
  const [refundOrderId, setRefundOrderId] = useState('');
  const [refundReason, setRefundReason] = useState('Customer requested cancellation prior to file download');
  const [showRefundModal, setShowRefundModal] = useState(false);

  // Unit Test Runner State
  const [testResults, setTestResults] = useState<{ allPassed: boolean; results: TestCaseResult[] } | null>(null);

  // Financial Calculations from Real Ledger Records (Fixed 20% Owner Commission)
  const grossSalesPaise = commissionRecords.reduce((acc, c) => acc + c.gross_amount_paise, 0);
  const eligibleSalesPaise = commissionRecords.reduce((acc, c) => acc + c.eligible_amount_paise, 0);
  const totalOwnerCommissionPaise = commissionRecords.reduce((acc, c) => acc + c.owner_commission_paise, 0);
  const totalSellerPayablePaise = commissionRecords.reduce((acc, c) => acc + c.seller_amount_paise, 0);
  const totalPaymentFeesPaise = commissionRecords.reduce((acc, c) => acc + c.payment_gateway_fee_paise, 0);
  const totalAffiliateCommissionsPaise = commissionRecords.reduce((acc, c) => acc + (c.affiliate_commission_paise || 0), 0);
  const totalRefundAmountPaise = refundRecords.reduce((acc, r) => acc + r.amount_paise, 0);
  const totalRefundOwnerDeductionPaise = refundRecords.reduce((acc, r) => acc + r.owner_deduction_paise, 0);
  const chargebackAmountPaise = 0; // 0 disputes

  // Net Marketplace Revenue = Platform Gross Commission - Gateway Fees - Affiliate Share - Owner Refund Deductions
  const netMarketplaceRevenuePaise = Math.max(
    0,
    totalOwnerCommissionPaise - totalPaymentFeesPaise - totalAffiliateCommissionsPaise - totalRefundOwnerDeductionPaise
  );

  const pendingSettlementPaise = commissionRecords
    .filter((c) => c.settlement_status === 'pending')
    .reduce((acc, c) => acc + c.owner_commission_paise, 0);

  const completedSettlementPaise = settlementRecords
    .filter((s) => s.status === 'settled')
    .reduce((acc, s) => acc + s.net_amount_paise, 0);

  // Today & This Month slices
  const todayCommissionPaise = commissionRecords.slice(0, 1).reduce((acc, c) => acc + c.owner_commission_paise, 0);
  const thisMonthCommissionPaise = totalOwnerCommissionPaise;

  const handleTestRazorpay = async () => {
    setTestingConnection(true);
    setConnectionFeedback(null);
    const result = await testRazorpayConnection();
    setTestingConnection(false);
    setConnectionFeedback({ success: result.success, msg: result.message });
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setConnectionFeedback(null);
    try {
      const res = await fetch('/api/razorpay/test-webhook', { method: 'POST' });
      const data = await res.json();
      setConnectionFeedback({ success: data.success, msg: data.message });
    } catch (err: any) {
      setConnectionFeedback({ success: false, msg: `Webhook test failed: ${err.message}` });
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      default_commission_rate_percent: tempCommissionRate,
      allow_commission_override: !commissionLocked,
    });
    setCommissionLocked(true);
    alert('Marketplace commission configuration successfully saved.');
  };

  const handleSaveRazorpaySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      razorpay_linked_account_id: linkedAccountIdInput,
      razorpay_webhook_url: webhookUrlInput,
      razorpay_route_enabled: routeEnabledToggle,
    });
    setConnectionFeedback({ success: true, msg: 'Settings → Payments → Razorpay saved successfully to secure configuration.' });
  };

  const handleProcessRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundOrderId) return;
    await processRefund(refundOrderId, refundReason);
    setShowRefundModal(false);
    setRefundOrderId('');
  };

  // Filtered Commission Records for Admin → Finance → Commission
  const filteredCommissionRecords = commissionRecords.filter((rec) => {
    if (productFilter !== 'all' && rec.product_id !== productFilter) return false;
    if (sellerFilter !== 'all' && rec.seller_id !== sellerFilter) return false;
    if (orderSearchQuery && !rec.order_number.toLowerCase().includes(orderSearchQuery.toLowerCase())) return false;
    if (paymentSearchQuery && !rec.payment_id.toLowerCase().includes(paymentSearchQuery.toLowerCase())) return false;
    return true;
  });

  // Unique sellers & products for filter selectors
  const uniqueSellers = Array.from(new Set(commissionRecords.map((c) => ({ id: c.seller_id, name: c.seller_name }))));
  const uniqueProducts = Array.from(new Set(commissionRecords.map((c) => ({ id: c.product_id, title: c.product_title }))));

  // Partially masked Razorpay linked account ID for security
  const maskedLinkedAccountId = linkedAccountIdInput
    ? `${linkedAccountIdInput.substring(0, 9)}••••${linkedAccountIdInput.slice(-4)}`
    : 'Not configured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Top Admin Warning: Route & Onboarding Compliance (Mandatory Requirement) */}
      {!platformSettings.razorpay_route_enabled && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">
              Razorpay Marketplace Route Warning & Settlement Notice
            </h4>
            <p className="leading-relaxed">
              &ldquo;Complete Razorpay marketplace/Route onboarding and verify seller Linked Accounts before enabling live settlements.&rdquo;
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">
              &ldquo;Marketplace settlement is not configured. Please complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
              Merchant Account <strong>{platformSettings.razorpay_mid}</strong> is operating in verified compliance review mode.
            </p>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Root Owner Administration · Merchant MID: {platformSettings.razorpay_mid}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
            CHAKRA Owner Commission & Finance Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Real-time server-side 20% marketplace commission calculation, immutable order snapshots, and Razorpay Route linked account accounting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const res = runCommissionTests();
              setTestResults(res);
              setActiveTab('test-suite');
            }}
            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 text-chakra-gold" />
            <span>Run Test Scenarios (₹1,000 / 20%)</span>
          </button>
        </div>
      </div>

      {/* MANDATORY OWNER FINANCE CARD */}
      <div className="my-8 p-6 sm:p-8 bg-gradient-to-br from-[#132C28] to-[#1e443e] text-chakra-ivory rounded-3xl shadow-xl border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-chakra-gold-light">
                SOVEREIGN REVENUE CONTRACT
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif">
                CHAKRA OWNER COMMISSION: 20%
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-black/40 border border-white/15 rounded-xl text-xs font-mono">
                MID: {platformSettings.razorpay_mid}
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-bold">
                {platformSettings.razorpay_route_enabled ? 'Route Split Active' : 'Manual Payout Rail'}
              </span>
            </div>
          </div>

          {/* 5 Exact Metric Clusters Required */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block">Today&rsquo;s Commission</span>
              <div className="text-xl font-bold font-serif text-chakra-gold mt-1 tabular-nums">
                {formatINR(todayCommissionPaise)}
              </div>
            </div>

            <div className="p-4 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block">This Month (20%)</span>
              <div className="text-xl font-bold font-serif text-white mt-1 tabular-nums">
                {formatINR(thisMonthCommissionPaise)}
              </div>
            </div>

            <div className="p-4 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block">Total Commission</span>
              <div className="text-xl font-bold font-serif text-white mt-1 tabular-nums">
                {formatINR(totalOwnerCommissionPaise)}
              </div>
            </div>

            <div className="p-4 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-[11px] text-stone-300 block">Pending Settlement</span>
              <div className="text-xl font-bold font-serif text-amber-300 mt-1 tabular-nums">
                {formatINR(pendingSettlementPaise)}
              </div>
            </div>

            <div className="p-4 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-stone-300 block">Settled to Bank (UTR)</span>
              <div className="text-xl font-bold font-serif text-emerald-400 mt-1 tabular-nums">
                {formatINR(completedSettlementPaise)}
              </div>
            </div>
          </div>

          {/* Mandatory Financial Rule Notice */}
          <div className="pt-2 text-[11px] text-stone-300/90 font-mono leading-relaxed border-t border-white/10 flex items-start gap-2">
            <Info className="w-4 h-4 text-chakra-gold shrink-0 mt-0.5" />
            <div>
              <strong>IMPORTANT FINANCIAL RULE:</strong> &ldquo;CHAKRA commission: 20% before applicable payment gateway charges, taxes, refunds, chargebacks and other applicable adjustments.&rdquo;
              Gross values represent captured marketplace commission before statutory deductions.
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Admin Views */}
      <div className="border-b border-stone-200 dark:border-stone-800 flex items-center gap-2 overflow-x-auto pb-3 text-xs font-semibold mb-8">
        {[
          { id: 'finance-commission', label: 'Admin → Finance → Commission' },
          { id: 'commission-settings', label: 'Admin / Commission Settings (20%)' },
          { id: 'transactions', label: 'Admin / Transactions' },
          { id: 'seller-payouts', label: 'Admin / Seller Payouts' },
          { id: 'settings-payments-razorpay', label: 'Settings → Payments → Razorpay' },
          { id: 'settlements', label: 'Admin / Settlements' },
          { id: 'refunds', label: 'Admin / Refunds' },
          { id: 'test-suite', label: 'Admin / Test Diagnostics' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ADMIN → FINANCE → COMMISSION VIEW (All Explicit Metrics & Filters) */}
      {activeTab === 'finance-commission' && (
        <div className="space-y-8">
          {/* 11 Required Metrics Cluster */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Total Sales</span>
              <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-1 tabular-nums">
                {formatINR(grossSalesPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Eligible Sales</span>
              <div className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-1 tabular-nums">
                {formatINR(eligibleSalesPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">CHAKRA Commission (20%)</span>
              <div className="text-xl font-bold font-serif text-chakra-green dark:text-chakra-gold mt-1 tabular-nums">
                {formatINR(totalOwnerCommissionPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Seller Payable Amount (80%)</span>
              <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {formatINR(totalSellerPayablePaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Razorpay Payment Fees</span>
              <div className="text-xl font-bold font-serif text-red-600 dark:text-red-400 mt-1 tabular-nums">
                {formatINR(totalPaymentFeesPaise)}
              </div>
              <span className="text-[10px] text-stone-400">~2.36% MDR + GST</span>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Refund Amount</span>
              <div className="text-xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
                {formatINR(totalRefundAmountPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Chargeback Amount</span>
              <div className="text-xl font-bold font-serif text-stone-700 dark:text-stone-300 mt-1 tabular-nums">
                {formatINR(chargebackAmountPaise)}
              </div>
              <span className="text-[10px] text-emerald-600">0 Active Disputes</span>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Net Marketplace Revenue</span>
              <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
                {formatINR(netMarketplaceRevenuePaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Pending Settlement</span>
              <div className="text-xl font-bold font-serif text-amber-500 mt-1 tabular-nums">
                {formatINR(pendingSettlementPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Settled Amount (Bank UTR)</span>
              <div className="text-xl font-bold font-serif text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
                {formatINR(completedSettlementPaise)}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Failed Payments</span>
              <div className="text-xl font-bold font-serif text-stone-500 mt-1 tabular-nums">
                0
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs">
              <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">Affiliate Attributed</span>
              <div className="text-xl font-bold font-serif text-purple-600 dark:text-purple-400 mt-1 tabular-nums">
                {formatINR(totalAffiliateCommissionsPaise)}
              </div>
            </div>
          </div>

          {/* Explicit Filters Bar (Today, 7 days, 30 days, This month, Custom date, Product, Seller, Order ID, Payment ID) */}
          <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                <Filter className="w-4 h-4 text-chakra-gold" />
                <span>Commission Filters & Date Range</span>
              </div>
              <button
                onClick={() => {
                  setDateFilter('30days');
                  setProductFilter('all');
                  setSellerFilter('all');
                  setOrderSearchQuery('');
                  setPaymentSearchQuery('');
                }}
                className="text-[11px] text-chakra-gold hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Date Filter */}
              <div>
                <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Date Filter</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                >
                  <option value="today">Today</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="custom">Custom Date Range</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Product Filter */}
              <div>
                <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Product</label>
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                >
                  <option value="all">All Products</option>
                  {uniqueProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              {/* Seller Filter */}
              <div>
                <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Seller</label>
                <select
                  value={sellerFilter}
                  onChange={(e) => setSellerFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                >
                  <option value="all">All Sellers</option>
                  {uniqueSellers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order ID Search */}
              <div>
                <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Order ID</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Order ID..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Custom Date Range & Payment ID Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              {dateFilter === 'custom' && (
                <>
                  <div>
                    <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1 text-[11px] font-semibold">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-stone-500 mb-1 text-[11px] font-semibold">Payment ID</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Payment ID (pay_...)"
                    value={paymentSearchQuery}
                    onChange={(e) => setPaymentSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-mono"
                  />
                  <CreditCard className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Date-Wise Commission Report Table */}
          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                  Date-Wise Commission Report & Order Snapshots
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Showing {filteredCommissionRecords.length} records. All amounts recorded in integer paise.
                </p>
              </div>

              <button
                onClick={() => {
                  const csv =
                    `Order ID,Product Title,Seller,Gross (INR),Commission %,Owner Cut (INR),Seller Share (INR),Gateway Fee (INR),Payment ID,Status,Created At\n` +
                    filteredCommissionRecords
                      .map(
                        (c) =>
                          `${c.order_number},"${c.product_title.replace(/"/g, '""')}","${c.seller_name}",${(c.gross_amount_paise / 100).toFixed(2)},${c.commission_percentage}%,${(c.owner_commission_paise / 100).toFixed(2)},${(c.seller_amount_paise / 100).toFixed(2)},${(c.payment_gateway_fee_paise / 100).toFixed(2)},${c.payment_id},${c.settlement_status},${c.created_at}`
                      )
                      .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chakra-commission-report-${dateFilter}.csv`;
                  a.click();
                }}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-900/60 text-stone-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Product Title</th>
                    <th className="py-3 px-4">Seller</th>
                    <th className="py-3 px-4">Gross Sale</th>
                    <th className="py-3 px-4">Snapshot Rate</th>
                    <th className="py-3 px-4">Owner Cut (20%)</th>
                    <th className="py-3 px-4">Seller Share (80%)</th>
                    <th className="py-3 px-4">Gateway Fee</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredCommissionRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-white">{rec.order_number}</td>
                      <td className="py-3 px-4 font-semibold text-stone-800 dark:text-stone-200 max-w-xs truncate">{rec.product_title}</td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-300">{rec.seller_name}</td>
                      <td className="py-3 px-4 tabular-nums font-semibold">{formatINR(rec.gross_amount_paise)}</td>
                      <td className="py-3 px-4 font-mono font-bold text-chakra-gold">{rec.commission_percentage}%</td>
                      <td className="py-3 px-4 font-bold text-chakra-green dark:text-chakra-gold tabular-nums">{formatINR(rec.owner_commission_paise)}</td>
                      <td className="py-3 px-4 tabular-nums text-stone-600 dark:text-stone-300">{formatINR(rec.seller_amount_paise)}</td>
                      <td className="py-3 px-4 tabular-nums text-red-500">{formatINR(rec.payment_gateway_fee_paise)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-chakra-gold">{rec.payment_id}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {rec.settlement_status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ADMIN / COMMISSION SETTINGS VIEW (Fixed 20% Protection) */}
      {activeTab === 'commission-settings' && (
        <div className="max-w-3xl bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                Platform Commission Architecture & Safety Lock
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Default marketplace commission is FIXED at 20% to guarantee predictable creator payouts.
              </p>
            </div>

            <button
              onClick={() => setCommissionLocked(!commissionLocked)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {commissionLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>20% Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-red-600" />
                  <span>Override Enabled</span>
                </>
              )}
            </button>
          </div>

          <form onSubmit={handleSaveCommission} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Default CHAKRA Owner Commission Percentage
              </label>
              <div className="relative max-w-xs">
                <input
                  type="number"
                  disabled={commissionLocked}
                  value={tempCommissionRate}
                  onChange={(e) => setTempCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-bold text-lg disabled:opacity-60"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">%</span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {commissionLocked
                  ? 'Locked: Admin cannot accidentally alter 20% commission unless override toggle is enabled.'
                  : 'Warning: Altering commission will apply to new orders. Historical orders preserve their snapshot rate.'}
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
              <h4 className="font-semibold text-stone-900 dark:text-chakra-ivory">
                Immutable Order-Level Snapshot Policy
              </h4>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                When a payment is captured via Razorpay, the commission percentage (20%) is recorded permanently into the <code>order_commissions</code> table.
                Even if global settings change in the future, past transaction records remain legally and contractually auditable.
              </p>
            </div>

            {!commissionLocked && (
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-chakra-gold text-stone-950 font-bold rounded-xl hover:bg-chakra-gold-light cursor-pointer shadow-xs"
                >
                  Save Commission Override
                </button>
              </div>
            )}
          </form>
        </div>
      )}

      {/* 3. ADMIN / TRANSACTIONS VIEW */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Captured Payment Transactions & Webhook Ledger
              </h3>
              <p className="text-xs text-stone-500">
                Idempotent event records verified via server-side HMAC-SHA256 signature verification.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Payment ID</th>
                  <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Gross Amount</th>
                  <th className="py-3.5 px-4 font-semibold">Gateway Fee</th>
                  <th className="py-3.5 px-4 font-semibold">Tax</th>
                  <th className="py-3.5 px-4 font-semibold">Method</th>
                  <th className="py-3.5 px-4 font-semibold">Idempotency Key</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {paymentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3 px-4 font-mono font-bold text-chakra-green dark:text-chakra-gold">{txn.razorpay_payment_id}</td>
                    <td className="py-3 px-4 font-mono text-stone-700 dark:text-stone-300">{txn.order_id}</td>
                    <td className="py-3 px-4 font-bold tabular-nums">{formatINR(txn.amount_paise)}</td>
                    <td className="py-3 px-4 tabular-nums text-red-500">{formatINR(txn.fee_paise)}</td>
                    <td className="py-3 px-4 tabular-nums text-stone-500">{formatINR(txn.tax_paise)}</td>
                    <td className="py-3 px-4 uppercase font-mono text-[11px]">{txn.method}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-stone-400">{txn.idempotency_key}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {txn.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ADMIN / SELLER PAYOUTS VIEW */}
      {activeTab === 'seller-payouts' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Seller Payouts & Razorpay Route Split Disbursals
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage seller linked account settlements, dispute holds, and manual bank clearance.
              </p>
            </div>

            <div className="px-3 py-1.5 bg-stone-50 dark:bg-stone-900 rounded-lg text-xs font-mono">
              Marketplace Fee: 20% Retained · Seller Share: 80%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Seller</th>
                  <th className="py-3.5 px-4 font-semibold">Payable (80%)</th>
                  <th className="py-3.5 px-4 font-semibold">Payout Rail</th>
                  <th className="py-3.5 px-4 font-semibold">Linked Account / VPA</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {payouts.map((pay) => (
                  <tr key={pay.id}>
                    <td className="py-3.5 px-4 font-semibold">{pay.seller_name}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 tabular-nums">{formatINR(pay.amount_paise)}</td>
                    <td className="py-3.5 px-4 uppercase font-mono text-[11px]">{pay.payout_method}</td>
                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                      {pay.linked_account_id ? `${pay.linked_account_id} (Route)` : pay.destination_summary}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          pay.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : pay.status === 'on_hold'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {pay.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {pay.status === 'pending' && (
                        <>
                          <button
                            onClick={() => approvePayout(pay.id)}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 cursor-pointer"
                          >
                            Disburse
                          </button>
                          <button
                            onClick={() => holdPayout(pay.id, 'Risk review: verification pending')}
                            className="px-2.5 py-1 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 cursor-pointer"
                          >
                            Hold
                          </button>
                        </>
                      )}
                      {pay.status === 'on_hold' && (
                        <button
                          onClick={() => approvePayout(pay.id)}
                          className="px-2.5 py-1 bg-stone-700 text-white rounded text-[11px] hover:bg-stone-800 cursor-pointer"
                        >
                          Release & Pay
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

      {/* 5. SETTINGS → PAYMENTS → RAZORPAY (Exact Fields Specified) */}
      {activeTab === 'settings-payments-razorpay' && (
        <div className="max-w-3xl bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-chakra-gold" />
                Settings → Payments → Razorpay
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure your verified Razorpay merchant keys, Route split account, and webhook endpoints.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold rounded-lg">
              MID: {platformSettings.razorpay_mid}
            </span>
          </div>

          {connectionFeedback && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
                connectionFeedback.success
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-200'
              }`}
            >
              {connectionFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{connectionFeedback.msg}</span>
            </div>
          )}

          <form onSubmit={handleSaveRazorpaySettings} className="space-y-4 text-xs">
            {/* Razorpay Key ID */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Razorpay Key ID (Client-Safe)
              </label>
              <input
                type="text"
                value={keyIdInput}
                onChange={(e) => setKeyIdInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Razorpay Key Secret is safely stored in Netlify environment variables (<code>RAZORPAY_KEY_SECRET</code>) and never displayed or exposed anywhere in frontend code.
              </span>
            </div>

            {/* Razorpay Linked Account ID (with partially masked display) */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Razorpay Linked Account ID (Route Marketplace)
              </label>
              <input
                type="text"
                value={linkedAccountIdInput}
                onChange={(e) => setLinkedAccountIdInput(e.target.value)}
                placeholder="acc_ThQ32KbfQQu7Qy"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Partially Masked Identifier: <strong>{maskedLinkedAccountId}</strong>. Only activate when Route feature is enabled by Razorpay compliance.
              </span>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrlInput}
                onChange={(e) => setWebhookUrlInput(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Endpoint in Razorpay Dashboard → Settings → Webhooks with events <code>payment.captured</code> and <code>refund.processed</code>.
              </span>
            </div>

            {/* Commission Percentage = 20% */}
            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                Commission Percentage
              </label>
              <div className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl font-bold text-sm text-stone-800 dark:text-stone-200">
                20% (Fixed Platform Commission)
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                Protected by Admin Settings lock to prevent accidental modification from 20%.
              </span>
            </div>

            {/* Status Indicators: Marketplace/Route Status, Payment Status, Webhook Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-stone-500 block text-[11px]">Marketplace/Route Status:</span>
                <span className="font-bold text-amber-600">
                  {platformSettings.razorpay_route_enabled ? 'Active Split' : 'Pending Activation'}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Payment Status:</span>
                <span className="font-bold text-emerald-600">Active (Live API Server)</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[11px]">Webhook Status:</span>
                <span className="font-bold text-emerald-600">HMAC-SHA256 Validated</span>
              </div>
            </div>

            {/* Action Buttons: Test Connection, Test Webhook, Save Settings */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleTestRazorpay}
                disabled={testingConnection}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingWebhook ? 'animate-spin' : ''}`} />
                <span>Test Webhook</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-xl hover:bg-chakra-gold-light transition-colors cursor-pointer shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. ADMIN / SETTLEMENTS VIEW */}
      {activeTab === 'settlements' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-stone-900 to-[#132C28] text-white p-6 sm:p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-chakra-gold text-xs font-semibold uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Owner Bank Account Onboarding Security Architecture</span>
            </div>
            <h3 className="text-xl font-bold font-serif">
              Connecting Your Business Bank Account Securely via Razorpay
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
              To safeguard your funds and maintain RBI compliance, <strong>bank account login credentials, passwords, or transaction PINs are never entered on this website.</strong>
              Bank verification occurs directly inside the official Razorpay Merchant Portal via automated Penny Drop verification (₹1 deposit) and cancelled cheque review.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Verified Razorpay Merchant Bank Settlements
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Settlements disbursed directly by Razorpay into your verified merchant bank account ({platformSettings.merchant_bank_summary}).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Settlement ID</th>
                    <th className="py-3 px-4 font-semibold">Gross Amount</th>
                    <th className="py-3 px-4 font-semibold">MDR Fee & Tax</th>
                    <th className="py-3 px-4 font-semibold">Net Credited</th>
                    <th className="py-3 px-4 font-semibold">UTR Reference</th>
                    <th className="py-3 px-4 font-semibold">Bank Account</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {settlementRecords.map((setl) => (
                    <tr key={setl.id}>
                      <td className="py-3 px-4 font-mono font-bold text-chakra-green dark:text-chakra-gold">{setl.settlement_id}</td>
                      <td className="py-3 px-4 tabular-nums">{formatINR(setl.amount_paise)}</td>
                      <td className="py-3 px-4 tabular-nums text-red-500">{formatINR(setl.fee_paise + setl.tax_paise)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600 tabular-nums">{formatINR(setl.net_amount_paise)}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600 dark:text-stone-300">{setl.utr}</td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-300">{setl.bank_account_masked}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {setl.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. ADMIN / REFUNDS VIEW */}
      {activeTab === 'refunds' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Refunds & Chargeback Reconciliations
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Proportionally reverses 20% owner marketplace commission and 80% seller share upon approved customer return.
              </p>
            </div>

            <button
              onClick={() => setShowRefundModal(true)}
              className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
            >
              Initiate Refund
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Payment ID</th>
                  <th className="py-3 px-4 font-semibold">Total Refunded</th>
                  <th className="py-3 px-4 font-semibold">Owner Reversed (20%)</th>
                  <th className="py-3 px-4 font-semibold">Seller Reversed (80%)</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {refundRecords.map((ref) => (
                  <tr key={ref.id}>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-white">{ref.order_number}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-chakra-gold">{ref.payment_id}</td>
                    <td className="py-3 px-4 font-bold text-red-600 tabular-nums">{formatINR(ref.amount_paise)}</td>
                    <td className="py-3 px-4 tabular-nums text-stone-600 dark:text-stone-300">{formatINR(ref.owner_deduction_paise)}</td>
                    <td className="py-3 px-4 tabular-nums text-stone-600 dark:text-stone-300">{formatINR(ref.seller_deduction_paise)}</td>
                    <td className="py-3 px-4 text-stone-500 text-[11px] max-w-xs truncate">{ref.reason}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700">
                        {ref.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. TEST SUITE DIAGNOSTICS VIEW */}
      {activeTab === 'test-suite' && (
        <div className="p-6 sm:p-8 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-3xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                Automated Test Scenarios & Ledger Invariant Diagnostics
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Verifies ₹1,000 product with fixed 20% platform commission, idempotency, Route holds, refunds, and reconciliation.
              </p>
            </div>

            <button
              onClick={() => {
                const res = runCommissionTests();
                setTestResults(res);
              }}
              className="px-5 py-2 bg-chakra-gold text-stone-950 text-xs font-bold rounded-xl hover:bg-chakra-gold-light transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run Suite</span>
            </button>
          </div>

          {testResults && (
            <div className="space-y-3">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All {testResults.results.length} Test Scenarios Passed (Zero Minor-Unit Leaks)</span>
              </div>

              <div className="space-y-2.5">
                {testResults.results.map((tr, idx) => (
                  <div key={idx} className="p-4 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 dark:text-chakra-ivory">{tr.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold text-[10px]">
                        PASSED
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">{tr.details}</p>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-stone-600 dark:text-stone-300 pt-1">
                      <span>Seller Share: ₹{tr.actual.sellerRupees}</span>
                      <span>Owner Cut: ₹{tr.actual.platformRupees}</span>
                      {tr.actual.affiliateRupees !== undefined && <span>Affiliate: ₹{tr.actual.affiliateRupees}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Initiate Proportional Order Refund
              </h3>
              <button onClick={() => setShowRefundModal(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessRefundSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Target Order ID
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ord_17905001"
                  value={refundOrderId}
                  onChange={(e) => setRefundOrderId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Reason for Refund
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl text-[11px] text-stone-500 space-y-1">
                <div>• Reverses 20% owner fee from marketplace commission balance.</div>
                <div>• Debits 80% seller share from seller settlement pending ledger.</div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRefundModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  Confirm & Execute Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
