'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductCategory, ProductType } from '@/types/chakra';
import { Search, Filter, SlidersHorizontal, PackageOpen, Download, Layers } from 'lucide-react';

export const ExploreCatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    t,
  } = useChakra();

  const [typeFilter, setTypeFilter] = useState<'all' | ProductType>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPriceRupees, setMaxPriceRupees] = useState<number>(5000);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    // Category match
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    // Type match
    if (typeFilter !== 'all' && prod.product_type !== typeFilter) {
      return false;
    }
    // Price match
    if (prod.price_paise > maxPriceRupees * 100) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchSeller = prod.seller_name.toLowerCase().includes(q);
      const matchTag = prod.tags.some((tag) => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchSeller && !matchTag) {
        return false;
      }
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price_paise - b.price_paise;
    if (sortBy === 'price-desc') return b.price_paise - a.price_paise;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.sales_count - a.sales_count;
  });

  const categoriesList: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: t.categories.all },
    { id: 'ebooks', label: 'eBooks & PDFs' },
    { id: 'storybooks', label: 'Story Books' },
    { id: 'education', label: 'Exam Notes' },
    { id: 'templates', label: 'Templates & UI' },
    { id: 'courses', label: 'Courses' },
    { id: 'software', label: 'Software / Code' },
    { id: 'artisan_crafts', label: 'Brass & Crafts' },
    { id: 'physical_goods', label: 'Physical Goods' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          Explore Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
          Browse verified eBooks, handwritten study notes, design assets, and traditional Indian handicrafts.
          Every purchase directly empowers independent creators.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        {/* Top search & sorting row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or author..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:border-chakra-gold text-stone-900 dark:text-white"
            />
          </div>

          {/* Type filters (Digital vs Physical) */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setTypeFilter('digital')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                typeFilter === 'digital'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Digital Instant</span>
            </button>
            <button
              onClick={() => setTypeFilter('physical')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                typeFilter === 'physical'
                  ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Physical Crafts</span>
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-stone-600 dark:text-stone-400">
            <span className="shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 focus:outline-none focus:border-chakra-gold"
            >
              <option value="featured">Best Selling</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips / Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-stone-100 dark:border-stone-800">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-stone-200 dark:bg-stone-800 text-chakra-green dark:text-chakra-gold font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Active Status */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
        <span>
          Showing <strong className="text-stone-900 dark:text-white tabular-nums">{sortedProducts.length}</strong> verified products
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-chakra-gold hover:underline"
          >
            Clear Search Filter
          </button>
        )}
      </div>

      {/* Product Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
          <PackageOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-900 dark:text-chakra-ivory mb-1">
            No products match your criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
            Try adjusting your search keywords, clearing category filters, or selecting &ldquo;All Types&rdquo;.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setTypeFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-chakra-gold text-stone-950 font-bold text-xs rounded-xl hover:bg-chakra-gold-light transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
