'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { Product } from '@/types/chakra';
import { formatINR } from '@/lib/commission';
import {
  Star,
  Download,
  Package,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Sparkles,
  ArrowLeft,
  Share2,
  Lock,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';

interface ProductDetailViewProps {
  productId: string;
  onOpenCheckout?: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  onOpenCheckout,
}) => {
  const {
    products,
    addToCart,
    setCurrentView,
    generateAffiliateLink,
    user,
    reviews,
    addReview,
    t,
  } = useChakra();

  const product = products.find((p) => p.id === productId) || products[0];
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'preview' | 'reviews'>('overview');

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const productReviews = reviews.filter((r) => r.product_id === product.id);
  const isDigital = product.product_type === 'digital';

  const handleCopyAffiliate = () => {
    const link = generateAffiliateLink(product.id);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleInstantBuy = () => {
    addToCart(product, 1);
    if (onOpenCheckout) {
      onOpenCheckout();
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle || !reviewComment) return;
    addReview({
      product_id: product.id,
      user_id: user.id,
      user_name: user.full_name || 'Verified Customer',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verified_purchase: true,
    });
    setReviewTitle('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Back button */}
      <button
        onClick={() => setCurrentView('explore')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-chakra-ivory mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Grid: Left Gallery/Content + Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left 7 Columns: Product Visuals & Extended Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Visual Frame */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
            <Image
              src={product.cover_image}
              alt={product.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
              referrerPolicy="no-referrer"
              priority
            />

            {/* Type Pill */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#132C28]/95 text-chakra-ivory text-xs font-semibold rounded-lg backdrop-blur-md">
              {isDigital ? (
                <>
                  <Download className="w-3.5 h-3.5 text-chakra-gold" />
                  <span>Instant Digital Download</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5 text-chakra-gold" />
                  <span>Artisan Handcrafted Goods</span>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs for PDP */}
          <div className="border-b border-stone-200 dark:border-stone-800 flex items-center gap-6 text-xs font-medium">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Description & Specifications
            </button>
            {isDigital && product.sample_content_preview && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`pb-3 transition-colors ${
                  activeTab === 'preview'
                    ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                Table of Contents / Sample
              </button>
            )}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-chakra-gold text-chakra-green dark:text-chakra-gold font-bold'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Verified Reviews ({product.review_count})
            </button>
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-base font-normal leading-relaxed">{product.description}</p>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="p-5 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl space-y-3 text-xs">
                <h4 className="font-semibold text-stone-900 dark:text-chakra-ivory uppercase tracking-wider text-[11px]">
                  Product Details & Delivery Specifications
                </h4>
                <div className="grid grid-cols-2 gap-y-2.5">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200 capitalize">
                    {product.category.replace('_', ' ')}
                  </span>

                  <span className="text-stone-500">Delivery Format:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {isDigital
                      ? product.digital_file_format || 'PDF & ePub DRM-Free'
                      : 'Inspected & Courier Shipped'}
                  </span>

                  {isDigital && (
                    <>
                      <span className="text-stone-500">Download Limit:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {product.download_limit} secure downloads allowed
                      </span>

                      <span className="text-stone-500">License:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        Standard Personal & Single-Commercial License
                      </span>
                    </>
                  )}

                  {!isDigital && (
                    <>
                      <span className="text-stone-500">Weight:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {product.weight_grams || 500} grams
                      </span>

                      <span className="text-stone-500">Stock Availability:</span>
                      <span className="font-medium text-emerald-600">
                        {product.stock_quantity || 20} units in warehouse
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Creator Store Card */}
              <div className="p-5 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-chakra-ivory dark:bg-stone-800 flex items-center justify-center font-bold text-chakra-green text-sm">
                    {product.seller_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-chakra-ivory">
                      {product.seller_name}
                    </h4>
                    <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-chakra-gold" />
                      Verified Indian Creator
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentView('seller-storefront', { sellerId: product.seller_id })}
                  className="px-3.5 py-1.5 text-xs font-semibold text-chakra-green dark:text-chakra-gold border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Visit Storefront
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Sample Preview */}
          {activeTab === 'preview' && (
            <div className="p-6 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                <FileText className="w-4 h-4 text-chakra-gold" />
                <span>Table of Contents & Excerpt Preview</span>
              </div>
              <pre className="text-xs font-mono text-stone-700 dark:text-stone-300 whitespace-pre-line leading-relaxed bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
                {product.sample_content_preview ||
                  'Chapter 1: Foundations\nChapter 2: Pricing\nChapter 3: Distribution\nChapter 4: Automation'}
              </pre>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">
                    No reviews yet for this product. Be the first to share your experience!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                            {rev.user_name}
                          </span>
                          {rev.verified_purchase && (
                            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-current' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                        {rev.title}
                      </h5>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-5 border border-stone-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900 space-y-3"
              >
                <h4 className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                  Write a Verified Review
                </h4>
                {reviewSubmitted && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg">
                    Thank you! Your review has been added.
                  </div>
                )}
                <div>
                  <label className="block text-[11px] text-stone-500 mb-1">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="px-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  >
                    <option value={5}>5 Stars - Outstanding</option>
                    <option value={4}>4 Stars - Great</option>
                    <option value={3}>3 Stars - Average</option>
                    <option value={2}>2 Stars - Needs Improvement</option>
                    <option value={1}>1 Star - Poor</option>
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Review headline (e.g. Incredibly helpful eBook)"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share your detailed experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-chakra-green text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right 5 Columns: Contiguous Purchase Module (Sticky on desktop) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            <div className="p-6 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl space-y-5">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider">
                  {product.category.replace('_', ' ')}
                </span>
                <div className="flex items-center text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="ml-1 font-bold text-stone-800 dark:text-stone-200 tabular-nums">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-stone-400 tabular-nums">({product.review_count})</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold font-serif text-stone-900 dark:text-chakra-ivory leading-snug">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
                <span className="text-2xl md:text-3xl font-bold text-chakra-green dark:text-chakra-gold tabular-nums">
                  {formatINR(product.price_paise)}
                </span>
                {product.original_price_paise && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatINR(product.original_price_paise)}
                  </span>
                )}
                {product.original_price_paise && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                    {Math.round(
                      ((product.original_price_paise - product.price_paise) /
                        product.original_price_paise) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              {/* Instant Buy & Add to Cart Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleInstantBuy}
                  className="w-full py-3.5 px-4 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs tracking-wider uppercase rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Instant Buy ({formatINR(product.price_paise)})</span>
                </button>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full py-3 px-4 bg-chakra-ivory dark:bg-stone-800 text-chakra-green dark:text-chakra-ivory border border-stone-300 dark:border-stone-700 font-semibold text-xs rounded-xl hover:border-chakra-gold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-2 pt-2 text-[11px] text-stone-600 dark:text-stone-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Razorpay Verified UPI, Cards & Net Banking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-chakra-gold shrink-0" />
                  <span>Instant single-user DRM-free download delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>7-Day Fair Refund Protection for digital defects</span>
                </div>
              </div>

              {/* Affiliate Referral Program Box */}
              {product.affiliate_eligible && (
                <div className="p-4 bg-amber-50/70 dark:bg-stone-900 border border-chakra-gold/40 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-chakra-ivory flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Affiliate Referral Partner
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      Earn 3%
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                    Share this product with your community and earn ₹
                    {((product.price_paise * 0.03) / 100).toFixed(0)} on every completed sale.
                  </p>
                  <button
                    onClick={handleCopyAffiliate}
                    className="w-full py-2 px-3 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:border-chakra-gold text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Referral Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-chakra-gold" />
                        <span>Copy Unique Affiliate Link</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
