'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { Product, ProductCategory, ProductType } from '@/types/chakra';
import { formatINR, rupeesToPaise } from '@/lib/commission';
import {
  Store,
  Plus,
  Trash2,
  Edit,
  Eye,
  DollarSign,
  TrendingUp,
  Package,
  Download,
  AlertCircle,
  CheckCircle2,
  Building,
  CreditCard,
  X,
  FileText,
  UploadCloud,
} from 'lucide-react';

export const SellerDashboardView: React.FC = () => {
  const {
    user,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    requestPayout,
    orders,
    t,
    setCurrentView,
  } = useChakra();

  // Tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'payouts' | 'store'>('catalog');

  // Add Product Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceRupees, setPriceRupees] = useState<number>(499);
  const [category, setCategory] = useState<ProductCategory>('ebooks');
  const [productType, setProductType] = useState<ProductType>('digital');
  const [digitalFileName, setDigitalFileName] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('/images/product_ebook_guide_1790588355041.jpg');
  const [stockQuantity, setStockQuantity] = useState<number>(25);

  // Payout request modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmountRupees, setPayoutAmountRupees] = useState<number>(5000);
  const [payoutMethod, setPayoutMethod] = useState<'bank_transfer' | 'upi'>('upi');
  const [destinationDetail, setDestinationDetail] = useState(user.seller_profile?.payout_account?.upi_id || 'creator@upi');

  // Filter products belonging to this seller
  const sellerProducts = products.filter(
    (p) => p.seller_id === user.id || p.seller_id === 'seller_aarav'
  );

  // Financial statistics
  const grossSalesPaise = 18450000; // ~₹1,84,500
  const platformFeesPaise = Math.round(grossSalesPaise * 0.1); // ₹18,450
  const netEarningsPaise = grossSalesPaise - platformFeesPaise; // ₹1,66,050
  const availablePayoutPaise = 4250000; // ₹42,500

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
      cover_image: coverImageUrl,
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
    setPriceRupees(499);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmountRupees <= 0) return;
    requestPayout(rupeesToPaise(payoutAmountRupees), payoutMethod, destinationDetail);
    setShowPayoutModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
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
                KYC Verified
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-8">
        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Gross Sales (GMV)
          </div>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
            {formatINR(grossSalesPaise)}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% this month</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Marketplace Fee (10%)
          </div>
          <div className="text-2xl font-bold font-serif text-stone-600 dark:text-stone-300 mt-2 tabular-nums">
            {formatINR(platformFeesPaise)}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Includes hosting & bandwidth
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs">
          <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
            Creator Net Earnings (90%)
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-2 tabular-nums">
            {formatINR(netEarningsPaise)}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Directly earned from sales
          </div>
        </div>

        <div className="p-5 bg-amber-50/60 dark:bg-stone-900 border border-chakra-gold/40 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-xs text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider font-semibold">
              Available for Payout
            </div>
            <div className="text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory mt-2 tabular-nums">
              {formatINR(availablePayoutPaise)}
            </div>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="mt-3 px-3 py-1.5 bg-chakra-gold text-stone-950 font-bold text-xs rounded-lg hover:bg-chakra-gold-light transition-colors text-center cursor-pointer shadow-xs"
          >
            Request Instant Payout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 dark:border-stone-800 flex items-center gap-6 text-xs font-semibold mb-6">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 transition-colors ${
            activeTab === 'catalog'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          My Product Catalog ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-3 transition-colors ${
            activeTab === 'payouts'
              ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
          }`}
        >
          Bank & UPI KYC Settings
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
                          <div className="text-[11px] text-stone-400 capitalize">
                            {prod.category.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-stone-600 dark:text-stone-300 capitalize">
                      {prod.product_type}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">
                      {formatINR(prod.price_paise)}
                    </td>

                    <td className="py-3.5 px-4 text-stone-700 dark:text-stone-300 tabular-nums">
                      {prod.sales_count} units
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        {prod.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setCurrentView('product-detail', { id: prod.id })}
                          className="p-1.5 text-stone-500 hover:text-chakra-gold"
                          title="View product"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500"
                          title="Delete product"
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

      {/* Tab 2: Payout Account & KYC */}
      {activeTab === 'payouts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-chakra-gold" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Bank Payout Details (NEFT / RTGS)
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  disabled
                  value={user.seller_profile?.payout_account?.account_holder_name}
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  disabled
                  value={user.seller_profile?.payout_account?.bank_name}
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-500 block mb-1">Account Number</label>
                  <input
                    type="text"
                    disabled
                    value={user.seller_profile?.payout_account?.account_number}
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 font-mono"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    disabled
                    value={user.seller_profile?.payout_account?.ifsc_code}
                    className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-chakra-gold" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                UPI Instant Settlement & Tax KYC
              </h3>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">VPA / UPI ID (Google Pay, PhonePe)</label>
                <input
                  type="text"
                  disabled
                  value={user.seller_profile?.payout_account?.upi_id}
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="text-stone-500 block mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  disabled
                  value={user.seller_profile?.payout_account?.pan_number}
                  className="w-full px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-700 dark:text-stone-300 font-mono"
                />
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>KYC identity verified with 194-O Income Tax TDS exemption certificate.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-base font-bold text-stone-900 dark:text-chakra-ivory">
                Publish New Product on CHAKRA
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marathi Calligraphy Font & UI Kit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                  >
                    <option value="ebooks">eBooks & PDF</option>
                    <option value="storybooks">Story Books</option>
                    <option value="education">Exam Notes</option>
                    <option value="templates">Templates</option>
                    <option value="courses">Courses</option>
                    <option value="software">Software</option>
                    <option value="artisan_crafts">Artisan Crafts</option>
                    <option value="physical_goods">Physical Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Product Type
                  </label>
                  <select
                    value={productType}
                    onChange={(e: any) => setProductType(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                  >
                    <option value="digital">Digital (Instant Download)</option>
                    <option value="physical">Physical (Shipped)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Price in INR (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={49}
                    max={100000}
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  You will earn ₹{(priceRupees * 0.9).toFixed(0)} net (90%). CHAKRA fee is 10%.
                </span>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your digital guide or artisan product..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              {productType === 'digital' ? (
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Digital File Name (Private Storage)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marathi_Calligraphy_Pro_Guide.pdf"
                    value={digitalFileName}
                    onChange={(e) => setDigitalFileName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                    Initial Stock Inventory
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-lg hover:bg-chakra-gold-light"
                >
                  Publish to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-chakra-ivory">
                Request Creator Payout
              </h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-stone-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-stone-500 block mb-1">Available for Withdrawal</label>
                <div className="text-xl font-bold font-serif text-emerald-600">
                  {formatINR(availablePayoutPaise)}
                </div>
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 block mb-1">
                  Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  max={42500}
                  value={payoutAmountRupees}
                  onChange={(e) => setPayoutAmountRupees(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-bold"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Minimum payout ₹1,000</span>
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 block mb-1">Payout Rail</label>
                <select
                  value={payoutMethod}
                  onChange={(e: any) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  <option value="upi">Instant UPI (VPA)</option>
                  <option value="bank_transfer">Direct NEFT/IMPS Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="text-stone-700 dark:text-stone-300 block mb-1">
                  Recipient Destination (UPI / Account)
                </label>
                <input
                  type="text"
                  value={destinationDetail}
                  onChange={(e) => setDestinationDetail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-chakra-gold text-stone-950 font-bold rounded-lg hover:bg-chakra-gold-light"
                >
                  Submit Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
