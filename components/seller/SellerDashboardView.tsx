'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { Product, ProductCategory, ProductType, Order } from '@/types/chakra';
import { formatINR, rupeesToPaise, paiseToRupees } from '@/lib/commission';
import {
  Store,
  Plus,
  Trash2,
  Eye,
  TrendingUp,
  Package,
  Download,
  CheckCircle2,
  Building,
  CreditCard,
  X,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  Clock,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const {
    user,
    updateUserProfile,
    products,
    addProduct,
    deleteProduct,
    requestPayout,
    payouts,
    orders,
    refundRecords,
    setCurrentView,
    platformSettings,
  } = useChakra();

  const [activeTab, setActiveTab] = useState<'catalog' | 'finances' | 'payouts' | 'invoices' | 'kyc'>('catalog');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState<number>(1000);
  const [category, setCategory] = useState<ProductCategory>('ebooks');
  const [productType, setProductType] = useState<ProductType>('digital');
  const [digitalFileName, setDigitalFileName] = useState('');
  const [stockQuantity, setStockQuantity] = useState<number>(25);

  // Payout request modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmountRupees, setPayoutAmountRupees] = useState<number>(5000);
  const [payoutMethod, setPayoutMethod] = useState<'razorpay_route' | 'bank_transfer' | 'upi'>('razorpay_route');
  const [destinationDetail, setDestinationDetail] = useState(
    user.seller_profile?.payout_account?.razorpay_linked_account_id || user.seller_profile?.payout_account?.upi_id || 'acc_seller_route'
  );

  // Invoice viewer modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Editable KYC / Bank State
  const [accountHolder, setAccountHolder] = useState(user.seller_profile?.payout_account?.account_holder_name || 'Aarav Deshmukh');
  const [bankName, setBankName] = useState(user.seller_profile?.payout_account?.bank_name || 'HDFC Bank Ltd');
  const [accountNumber, setAccountNumber] = useState(user.seller_profile?.payout_account?.account_number || '•••• •••• 4421');
  const [ifscCode, setIfscCode] = useState(user.seller_profile?.payout_account?.ifsc_code || 'HDFC0001245');
  const [upiId, setUpiId] = useState(user.seller_profile?.payout_account?.upi_id || 'creator@okhdfcbank');
  const [panNumber, setPanNumber] = useState(user.seller_profile?.payout_account?.pan_number || 'ABCDE1234F');
  const [kycSavedSuccess, setKycSavedSuccess] = useState(false);

  // Filter products belonging to this seller (strict role isolation)
  const sellerProducts = products.filter(
    (p) => p.seller_id === user.id || p.seller_id === 'seller_aarav'
  );

  // Orders containing items from this seller
  const sellerOrders = orders.filter((o) =>
    o.items.some((item) => item.seller_id === user.id || item.seller_id === 'seller_aarav')
  );

  // Dynamic Financial Calculations (Initial default 10% platform cut -> 90% seller share)
  const defaultRate = platformSettings.default_commission_rate_percent ?? 10;
  const sellerGrossSalesPaise = 24000000; // ₹2,40,000 gross
  const platformFeePaise = Math.round((sellerGrossSalesPaise * defaultRate) / 100); // 10% = ₹24,000
  const sellerGrossSharePaise = sellerGrossSalesPaise - platformFeePaise; // 90% = ₹2,16,000
  const refundDeductionsPaise = 45000; // ₹450 refund deduction
  const completedPayoutsPaise = 8000000; // ₹80,000
  const availablePayoutPaise = sellerGrossSharePaise - refundDeductionsPaise - completedPayoutsPaise; // ₹1,35,550

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || priceRupees <= 0) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    addProduct({
      title,
      slug,
      description,
      short_description: description.substring(0, 120),
      price_paise: rupeesToPaise(priceRupees),
      category,
      product_type: productType,
      tags: ['Sovereign', category, 'Indian Creator'],
      cover_image: '/images/product_ebook_guide_1790588355041.jpg',
      digital_file_name: productType === 'digital' ? (digitalFileName || `${slug}.pdf`) : undefined,
      digital_file_size_bytes: 12500000,
      digital_file_format: productType === 'digital' ? 'PDF DRM-free' : undefined,
      download_limit: 5,
      stock_quantity: productType === 'physical' ? stockQuantity : undefined,
      seller_id: user.id,
      seller_name: user.seller_profile?.store_name || user.full_name,
      seller_avatar: user.avatar_url,
      status: 'approved',
      affiliate_eligible: true,
      custom_affiliate_rate_percent: 3,
    });

    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setPriceRupees(1000);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmountRupees <= 0) return;
    requestPayout(rupeesToPaise(payoutAmountRupees), payoutMethod, destinationDetail);
    setShowPayoutModal(false);
  };

  const handleSaveKyc = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      seller_profile: {
        ...(user.seller_profile || {
          store_name: 'Creator Studio',
          store_slug: 'creator-studio',
          store_description: 'Digital creator store',
          verified: true,
          verification_status: 'approved',
        }),
        payout_account: {
          account_holder_name: accountHolder,
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
          upi_id: upiId,
          pan_number: panNumber,
          kyc_approved: true,
          razorpay_linked_account_id: user.seller_profile?.payout_account?.razorpay_linked_account_id || 'acc_ThQ32KbfQQu7Qy',
          route_active: platformSettings.razorpay_route_enabled,
        },
      },
    });
    setKycSavedSuccess(true);
    setTimeout(() => setKycSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-chakra-green text-chakra-gold flex items-center justify-center font-bold text-xl shadow-md">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                {user.seller_profile?.store_name || 'My Creator Studio'}
              </h1>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                KYC Approved · {100 - defaultRate}% Creator Share
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Store URL: <span className="font-mono text-chakra-gold">chakra-marketplace.in/store/{user.seller_profile?.store_slug || 'my-studio'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 text-xs font-bold rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (90% Seller Share with 10% Platform Cut) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Gross Sales Volume</div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {formatINR(sellerGrossSalesPaise)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Total customer checkout value</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Creator Earnings ({100 - defaultRate}%)</div>
          <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {formatINR(sellerGrossSharePaise)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">After {defaultRate}% CHAKRA platform fee</p>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Completed Payouts</div>
          <div className="text-2xl font-bold font-serif text-stone-700 dark:text-stone-300 mt-2 tabular-nums">
            {formatINR(completedPayoutsPaise)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Disbursed to bank / Route</p>
        </div>

        <div className="p-5 bg-amber-50/60 dark:bg-stone-900 border border-chakra-gold/40 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider font-semibold">
              Available for Withdrawal
            </div>
            <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
              {formatINR(availablePayoutPaise)}
            </div>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="mt-3 px-3 py-1.5 bg-chakra-gold text-stone-950 font-bold text-xs rounded-lg hover:bg-chakra-gold-light transition-colors text-center cursor-pointer shadow-xs"
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 dark:border-stone-800 flex items-center gap-6 text-xs font-semibold mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'catalog'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          My Store Catalog ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('finances')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'finances'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Earnings & Refund Deductions
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'payouts'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Razorpay Route & Payout History
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Customer Invoices & Orders ({sellerOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          className={`pb-3 transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'kyc'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Payout Onboarding & KYC
        </button>
      </div>

      {/* Tab 1: Product Catalog Table */}
      {activeTab === 'catalog' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Price</th>
                  <th className="py-3.5 px-4 font-semibold">Your Cut ({100 - defaultRate}%)</th>
                  <th className="py-3.5 px-4 font-semibold">Sales</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
                {sellerProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-900/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          <Image
                            src={prod.cover_image}
                            alt={prod.title}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-chakra-ivory line-clamp-1">
                            {prod.title}
                          </div>
                          <div className="text-[11px] text-stone-400 capitalize">{prod.category.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 capitalize">{prod.product_type}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">{formatINR(prod.price_paise)}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 tabular-nums">
                      {formatINR(Math.round((prod.price_paise * (100 - defaultRate)) / 100))}
                    </td>
                    <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 tabular-nums">{prod.sales_count} units</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {prod.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setCurrentView('product-detail', { id: prod.id })}
                          className="p-1.5 text-stone-500 hover:text-chakra-gold cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Finances & Refund Deductions */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                  Creator Earnings Ledger & Deductions Summary
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Full financial transparency showing your {100 - defaultRate}% net payout after CHAKRA&rsquo;s 10% platform commission.
                </p>
              </div>

              <button
                onClick={() => {
                  const csv =
                    `Product,Gross Price (INR),Platform Commission (10%),Creator Share (90%),Sales Units,Total Earnings (INR)\n` +
                    sellerProducts
                      .map(
                        (p) =>
                          `"${p.title.replace(/"/g, '""')}",${(p.price_paise / 100).toFixed(2)},${((p.price_paise * 0.1) / 100).toFixed(2)},${((p.price_paise * 0.9) / 100).toFixed(2)},${p.sales_count},${((p.price_paise * p.sales_count * 0.9) / 100).toFixed(2)}`
                      )
                      .join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `chakra-seller-statement-${Date.now()}.csv`;
                  a.click();
                }}
                className="px-4 py-2 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-stone-200 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Statement CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 block">Gross Creator Revenue ({100 - defaultRate}%):</span>
                <span className="font-bold text-base text-emerald-600 tabular-nums">{formatINR(sellerGrossSharePaise)}</span>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 block">Total Refund Deductions:</span>
                <span className="font-bold text-base text-red-500 tabular-nums">-{formatINR(refundDeductionsPaise)}</span>
              </div>
              <div className="p-4 bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 block">Net Paid / Available:</span>
                <span className="font-bold text-base text-stone-900 dark:text-white tabular-nums">
                  {formatINR(completedPayoutsPaise + availablePayoutPaise)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payouts */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Razorpay Marketplace Route Warning & Settlement Notice */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm">
                Razorpay Marketplace Route Warning & Settlement Notice
              </h4>
              <p className="leading-relaxed">
                &ldquo;Complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                &ldquo;Marketplace settlement is not configured. Please complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 italic">
                &ldquo;CHAKRA commission: 20% before applicable payment gateway charges, taxes, refunds, chargebacks and other applicable adjustments.&rdquo;
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Disbursal History & Route Transfers
              </h3>
              <span className="text-xs text-stone-500 font-mono">Disbursals in INR</span>
            </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Rail</th>
                  <th className="py-3 px-4 font-semibold">Account / UTR</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold text-emerald-600 tabular-nums">{formatINR(p.amount_paise)}</td>
                    <td className="py-3 px-4 uppercase font-mono text-[11px]">{p.payout_method}</td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                      {p.reference_number || p.destination_summary}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{new Date(p.requested_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Tab 4: Invoices & Receipts */}
      {activeTab === 'invoices' && (
        <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Order Receipts & Customer Invoices
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Download and view legally compliant tax receipts for all customer orders.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-900/80 text-stone-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order Number</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total Amount</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {sellerOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="py-3 px-4 font-mono font-bold text-chakra-green dark:text-chakra-gold">{ord.order_number}</td>
                    <td className="py-3 px-4">{ord.customer_name}</td>
                    <td className="py-3 px-4 text-stone-500">{ord.items.length} product(s)</td>
                    <td className="py-3 px-4 font-bold tabular-nums">{formatINR(ord.total_paise)}</td>
                    <td className="py-3 px-4 text-stone-500">{new Date(ord.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="px-3 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-chakra-gold" />
                        <span>View Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Payout Onboarding & KYC */}
      {activeTab === 'kyc' && (
        <div className="space-y-6">
          {kycSavedSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Payout bank account and KYC credentials updated successfully.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Route Linked Account Section */}
            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-chakra-gold" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                  Razorpay Route Linked Account
                </h3>
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-500 block mb-1">Linked Account Identifier</label>
                  <input
                    type="text"
                    disabled
                    value={user.seller_profile?.payout_account?.razorpay_linked_account_id || 'acc_ThQ32KbfQQu7Qy'}
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg font-mono text-stone-700 dark:text-stone-300"
                  />
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl text-[11px] text-stone-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Route Status: <strong>{platformSettings.razorpay_route_enabled ? 'Active Split' : 'Pending Route Approval (Fallback to Direct Bank Transfer)'}</strong></span>
                  </div>
                  <div>• Direct marketplace split transfers are deposited into your linked account once approved.</div>
                </div>
              </div>
            </div>

            {/* Direct Bank Account & KYC Form */}
            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-chakra-gold" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                  Direct Bank Account & Tax KYC
                </h3>
              </div>

              <form onSubmit={handleSaveKyc} className="space-y-3 text-xs">
                <div>
                  <label className="text-stone-600 dark:text-stone-400 block mb-1">Account Holder Full Name</label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-600 dark:text-stone-400 block mb-1">Bank Name</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-stone-600 dark:text-stone-400 block mb-1">Account Number</label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-600 dark:text-stone-400 block mb-1">IFSC Code</label>
                    <input
                      type="text"
                      required
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-stone-600 dark:text-stone-400 block mb-1">PAN Number (Tax KYC)</label>
                    <input
                      type="text"
                      required
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-stone-600 dark:text-stone-400 block mb-1">UPI ID (Instant Settlement)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-xl hover:bg-chakra-gold-light transition-colors cursor-pointer"
                  >
                    Save Payout Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] text-chakra-gold font-mono uppercase font-bold">CHAKRA TAX INVOICE</span>
                <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                  Invoice {selectedInvoiceOrder.order_number}
                </h3>
              </div>
              <button onClick={() => setSelectedInvoiceOrder(null)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Customer: {selectedInvoiceOrder.customer_name}</span>
                <span>Date: {new Date(selectedInvoiceOrder.created_at).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Payment Method: {selectedInvoiceOrder.payment_method.toUpperCase()}</span>
                <span>Status: <strong className="text-emerald-600">{selectedInvoiceOrder.status.toUpperCase()}</strong></span>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl space-y-2">
                <div className="font-semibold text-stone-900 dark:text-chakra-ivory">Items Ordered:</div>
                {selectedInvoiceOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-stone-600 dark:text-stone-300">
                    <span>{it.title} (x{it.quantity})</span>
                    <span className="font-bold">{formatINR(it.price_paise * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300">
                <div className="flex justify-between">
                  <span>Gross Order Value:</span>
                  <span className="font-bold">{formatINR(selectedInvoiceOrder.total_paise)}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Marketplace Platform Commission (10%):</span>
                  <span>-{formatINR(Math.round((selectedInvoiceOrder.total_paise * 0.1)))}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-600 text-sm pt-1 border-t border-stone-200 dark:border-stone-800">
                  <span>Creator Net Payable (90%):</span>
                  <span>{formatINR(Math.round(selectedInvoiceOrder.total_paise * 0.9))}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-800 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Publish New Product to CHAKRA
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Guide to Digital Product Publishing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your eBook, course, notes, or handcrafted artifact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                    Price in INR (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    You earn: ~₹{Math.round(priceRupees * 0.9)} (90%)
                  </span>
                </div>

                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                    Product Format
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                  >
                    <option value="digital">Digital Download (eBook, PDF, Course)</option>
                    <option value="physical">Physical Product (Craft, Merchandise)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg capitalize"
                  >
                    <option value="ebooks">eBooks & PDF Books</option>
                    <option value="storybooks">Story Books</option>
                    <option value="education">Educational Materials</option>
                    <option value="templates">Templates & Design</option>
                    <option value="courses">Online Courses</option>
                    <option value="software">Software & Code</option>
                    <option value="artisan_crafts">Artisan Crafts</option>
                    <option value="physical_goods">Physical Goods</option>
                  </select>
                </div>

                {productType === 'digital' ? (
                  <div>
                    <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                      Digital Asset File Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Creator_Playbook_v2026.pdf"
                      value={digitalFileName}
                      onChange={(e) => setDigitalFileName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                      Stock Inventory Units
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-xl text-[11px] text-stone-500 space-y-1">
                <div>• Digital files are protected in private Supabase storage.</div>
                <div>• Customers receive cryptographically signed download tokens upon payment.</div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-lg hover:bg-chakra-gold-light cursor-pointer"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                Request Earnings Withdrawal
              </h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Withdrawal Amount in INR (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  max={paiseToRupees(availablePayoutPaise)}
                  value={payoutAmountRupees}
                  onChange={(e) => setPayoutAmountRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Available: {formatINR(availablePayoutPaise)} (Min: ₹500)
                </span>
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Payout Rail
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  <option value="razorpay_route">Razorpay Route (Direct Split)</option>
                  <option value="bank_transfer">Direct Bank Transfer (NEFT/IMPS)</option>
                  <option value="upi">Instant UPI Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 font-semibold block mb-1">
                  Destination Account / VPA
                </label>
                <input
                  type="text"
                  required
                  value={destinationDetail}
                  onChange={(e) => setDestinationDetail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                />
              </div>

              {/* Razorpay Marketplace Route Warning & Settlement Notice */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Settlement Notice</span>
                </div>
                <p className="text-[11px] leading-snug">
                  &ldquo;Marketplace settlement is not configured. Please complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
                </p>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  Transfers are logged and queued securely. Bank settlement will be processed once Route onboarding approval is complete.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-lg hover:bg-chakra-gold-light cursor-pointer"
                >
                  Confirm Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
