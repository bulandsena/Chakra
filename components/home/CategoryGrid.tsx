'use client';

import React from 'react';
import { useChakra } from '@/context/ChakraContext';
import { ProductCategory } from '@/types/chakra';
import {
  BookOpen,
  BookMarked,
  GraduationCap,
  Layout,
  Video,
  Code,
  Flame,
  Package,
} from 'lucide-react';

interface CategoryItem {
  id: ProductCategory;
  label: string;
  count: string;
  icon: React.ReactNode;
  desc: string;
}

export const CategoryGrid: React.FC = () => {
  const { setSelectedCategory, setCurrentView, t } = useChakra();

  const categories: CategoryItem[] = [
    {
      id: 'ebooks',
      label: t.categories.ebooks,
      count: '1,240+ Titles',
      icon: <BookOpen className="w-5 h-5 text-chakra-gold" />,
      desc: 'Playbooks, guides, non-fiction and research reports in DRM-free PDF.',
    },
    {
      id: 'storybooks',
      label: t.categories.storybooks,
      count: '480+ Stories',
      icon: <BookMarked className="w-5 h-5 text-chakra-gold" />,
      desc: 'Marathi, Hindi & regional literature, historical epics and illustrated lore.',
    },
    {
      id: 'education',
      label: t.categories.education,
      count: '950+ Notes',
      icon: <GraduationCap className="w-5 h-5 text-chakra-gold" />,
      desc: 'UPSC, MPSC, Engineering, and civil service handwritten mindmaps.',
    },
    {
      id: 'templates',
      label: t.categories.templates,
      count: '820+ Kits',
      icon: <Layout className="w-5 h-5 text-chakra-gold" />,
      desc: 'Figma UI design systems, Notion workspaces, and automated Excel sheets.',
    },
    {
      id: 'courses',
      label: t.categories.courses,
      count: '340+ Courses',
      icon: <Video className="w-5 h-5 text-chakra-gold" />,
      desc: 'Modular video masterclasses with project repos and creator community access.',
    },
    {
      id: 'software',
      label: t.categories.software,
      count: '260+ Repos',
      icon: <Code className="w-5 h-5 text-chakra-gold" />,
      desc: 'Full-stack Next.js boilers, Supabase integrations, and developer plugins.',
    },
    {
      id: 'artisan_crafts',
      label: t.categories.artisan_crafts,
      count: '190+ Crafts',
      icon: <Flame className="w-5 h-5 text-chakra-gold" />,
      desc: 'Solid brass Diyas, sacred chakra wheels and traditional metal craft.',
    },
    {
      id: 'physical_goods',
      label: t.categories.physical_goods,
      count: '150+ Goods',
      icon: <Package className="w-5 h-5 text-chakra-gold" />,
      desc: 'Mulberry silk journals, handmade cotton stationery and gift sets.',
    },
  ];

  const handleCategorySelect = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    setCurrentView('explore');
  };

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-[#132C28] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="text-xs font-semibold text-chakra-gold-dark dark:text-chakra-gold uppercase tracking-wider mb-1">
              Curated Collections
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              {t.categories.title}
            </h2>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 md:mt-0 max-w-sm">
            {t.categories.subtitle}
          </p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="group p-5 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200/80 dark:border-stone-800 rounded-xl hover:border-chakra-gold/60 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-chakra-ivory dark:bg-stone-800 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-chakra-ivory group-hover:text-chakra-gold-dark dark:group-hover:text-chakra-gold transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {cat.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/80 flex items-center justify-between text-[11px]">
                <span className="font-mono text-stone-500 dark:text-stone-400 tabular-nums">
                  {cat.count}
                </span>
                <span className="font-medium text-chakra-gold group-hover:underline">
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
