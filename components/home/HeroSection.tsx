'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { ChakraLogo } from '@/components/common/ChakraLogo';
import { Search, ArrowRight, ShieldCheck, Sparkles, BookOpen, Layers, IndianRupee } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { t, setCurrentView, setSearchQuery, searchQuery } = useChakra();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentView('explore');
  };

  return (
    <section className="relative overflow-hidden bg-stone-50/70 dark:bg-[#0e211e] border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      {/* Subtle radial golden glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-chakra-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Quiet unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-chakra-gold inline-block" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Display Headline with balanced wrapping */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold font-serif tracking-tight text-stone-900 dark:text-chakra-ivory leading-[1.15]">
              {t.hero.headlinePart1}{' '}
              <span className="text-chakra-gold-dark dark:text-chakra-gold block mt-1">
                {t.hero.headlineHighlight}
              </span>
            </h1>

            {/* Subheadline with optimal measure */}
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* Search Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative max-w-lg flex items-center bg-white dark:bg-[#1a2e2b] border border-stone-300 dark:border-stone-700/80 rounded-xl shadow-md p-1.5 focus-within:border-chakra-gold focus-within:ring-2 focus-within:ring-chakra-gold/20 transition-all"
            >
              <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={t.hero.searchPlaceholder}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-stone-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 text-xs font-bold rounded-lg hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentView('explore')}
                className="px-6 py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-bold text-xs rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>{t.hero.ctaExplore}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('become-seller')}
                className="px-6 py-3 bg-white dark:bg-stone-800 text-chakra-green dark:text-chakra-ivory border border-stone-300 dark:border-stone-700 font-semibold text-xs rounded-xl hover:border-chakra-gold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
              >
                <span>{t.hero.ctaStartSelling}</span>
              </button>
            </div>

            {/* Proof Metrics (Claim-to-Proof Adjacency) */}
            <div className="pt-6 border-t border-stone-200/80 dark:border-stone-800 grid grid-cols-3 gap-4 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-chakra-green dark:text-chakra-gold tabular-nums">
                  {t.hero.stat1}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {t.hero.stat1Label}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-chakra-green dark:text-chakra-gold tabular-nums">
                  {t.hero.stat2}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {t.hero.stat2Label}
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-chakra-green dark:text-chakra-gold tabular-nums">
                  {t.hero.stat3}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {t.hero.stat3Label}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-stone-700/80 bg-stone-900 group">
              <Image
                src="/images/hero_marketplace_showcase_1790588339548.jpg"
                alt="CHAKRA creator showcase with digital goods and artisan items"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

              {/* Float Callout Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/90 dark:bg-[#132C28]/90 backdrop-blur-md rounded-xl border border-white/20 dark:border-stone-700/50 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-chakra-gold-dark dark:text-chakra-gold">
                    Sovereign Commission Model
                  </div>
                  <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory mt-0.5">
                    Creators Keep 90% · Affiliates Earn 3%
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-chakra-gold/20 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5 text-chakra-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
