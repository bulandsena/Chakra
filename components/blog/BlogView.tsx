'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { sampleBlogPosts } from '@/lib/sampleData';
import { BlogPost } from '@/types/chakra';
import { BookOpen, Clock, ArrowRight, ArrowLeft, Share2, Tag } from 'lucide-react';

export const BlogView: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {selectedPost ? (
        <article className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-chakra-ivory mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Creator Hub</span>
          </button>

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-800">
            <Image
              src={selectedPost.cover_image}
              alt={selectedPost.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-chakra-gold-dark dark:text-chakra-gold font-semibold uppercase tracking-wider">
            <span>{selectedPost.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-normal">{selectedPost.published_date}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-normal">{selectedPost.read_time_mins} min read</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex items-center gap-3 py-4 border-y border-stone-200 dark:border-stone-800">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-stone-200">
              <Image
                src={selectedPost.author.avatar}
                alt={selectedPost.author.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory">
                {selectedPost.author.name}
              </div>
              <div className="text-[11px] text-stone-500">{selectedPost.author.role}</div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
            {selectedPost.content}
          </div>

          <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" />
              <span>{selectedPost.tags.join(', ')}</span>
            </div>
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="text-chakra-gold hover:underline flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </article>
      ) : (
        <div>
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-stone-800 text-chakra-gold-dark dark:text-chakra-gold text-xs font-bold rounded-full mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sovereign Knowledge</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
              Creator Hub & SEO Articles
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-2">
              Tactical blueprints, pricing strategies, and regional publishing guides for Indian creators.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleBlogPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group flex flex-col bg-white dark:bg-[#1a2e2b] border border-stone-200/80 dark:border-stone-800 rounded-2xl overflow-hidden hover:shadow-lg hover:border-chakra-gold/50 transition-all cursor-pointer"
              >
                <div className="relative aspect-[16/10] w-full bg-stone-100 dark:bg-stone-900 overflow-hidden">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#132C28]/90 text-chakra-ivory text-[10px] font-bold rounded">
                    {post.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time_mins} min read
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.published_date}</span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-stone-900 dark:text-chakra-ivory group-hover:text-chakra-gold-dark dark:group-hover:text-chakra-gold transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 flex-1 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-chakra-gold">
                    <span>Read Guide</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
