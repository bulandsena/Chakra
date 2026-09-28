'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FeaturedShowcase: React.FC = () => {
  const { products, setCurrentView } = useChakra();
  const [filter, setFilter] = useState<'all' | 'ebooks' | 'templates' | 'crafts'>('all');

  const filteredProducts = products.filter((p) => {
    if (filter === 'ebooks') return p.category === 'ebooks' || p.category === 'storybooks' || p.category === 'education';
    if (filter === 'templates') return p.category === 'templates' || p.category === 'software' || p.category === 'courses';
    if (filter === 'crafts') return p.category === 'artisan_crafts' || p.category === 'physical_goods';
    return true;
  });

  return (
    <section className="py-16 md:py-20 bg-stone-50/50 dark:bg-[#102421] transition-colors border-b border-stone-200/80 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Segmented Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked by Curators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Featured Sovereign Products
            </h2>
          </div>

          {/* Interactive Filter Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xs self-start md:self-auto overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              All Top Goods
            </button>
            <button
              onClick={() => setFilter('ebooks')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'ebooks'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              eBooks & Literature
            </button>
            <button
              onClick={() => setFilter('templates')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'templates'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              Templates & SaaS
            </button>
            <button
              onClick={() => setFilter('crafts')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === 'crafts'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              Artisan Crafts
            </button>
          </div>
        </div>

        {/* 3-column / 4-column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentView('explore')}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-[#132C28] dark:text-chakra-ivory bg-chakra-ivory dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl hover:border-chakra-gold hover:bg-white dark:hover:bg-stone-700 transition-all cursor-pointer shadow-xs"
          >
            <span>Explore Entire 4,000+ Item Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
