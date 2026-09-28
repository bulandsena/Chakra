'use client';

import React from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { ProductCard } from '@/components/products/ProductCard';
import { Store, Star, CheckCircle2, ShieldCheck, Mail, ArrowLeft } from 'lucide-react';

interface SellerStorefrontViewProps {
  sellerId?: string;
}

export const SellerStorefrontView: React.FC<SellerStorefrontViewProps> = ({ sellerId }) => {
  const { products, setCurrentView, user } = useChakra();

  const sellerProducts = products.filter((p) => p.seller_id === sellerId || p.seller_id === 'seller_aarav');
  const leadProduct = sellerProducts[0] || products[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => setCurrentView('explore')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-chakra-ivory mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </button>

      {/* Store Banner & Profile Card */}
      <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-3xl overflow-hidden shadow-sm mb-12">
        {/* Banner Image */}
        <div className="relative h-48 sm:h-64 w-full bg-stone-900">
          <Image
            src="/images/hero_marketplace_showcase_1790588339548.jpg"
            alt="Store banner"
            fill
            className="object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
        </div>

        {/* Profile Info Row */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative -mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-chakra-green border-4 border-white dark:border-[#1a2e2b] flex items-center justify-center text-chakra-gold text-3xl font-bold shadow-xl overflow-hidden relative">
              <Store className="w-12 h-12" />
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                  {leadProduct.seller_name}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-chakra-gold shrink-0" />
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                <span>Verified Sovereign Creator</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  4.9 Rating
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">1,240+ Verified Sales</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setCurrentView('contact')}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Creator</span>
            </button>
          </div>
        </div>

        {/* Bio summary */}
        <div className="px-6 sm:px-10 pb-8 text-xs text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
          Specializing in sovereign creator business models, high-yield examination notes, and digital knowledge products.
          Every asset is carefully curated and formatted in high-resolution DRM-free files.
        </div>
      </div>

      {/* Catalog Grid */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-200 dark:border-stone-800">
          <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
            Published Catalog ({sellerProducts.length})
          </h2>
          <span className="text-xs text-stone-500">Instant Tokenized Delivery</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sellerProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};
