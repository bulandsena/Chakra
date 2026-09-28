'use client';

import React from 'react';
import { useChakra } from '@/context/ChakraContext';
import { ChakraLogo } from '@/components/common/ChakraLogo';
import { ShieldCheck, Lock, IndianRupee, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setCurrentView } = useChakra();

  const handleLink = (view: string) => {
    setCurrentView(view);
  };

  return (
    <footer className="w-full bg-[#132C28] text-chakra-ivory border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand & Sovereign Mission */}
          <div className="lg:col-span-2">
            <ChakraLogo size={42} showWordmark={true} showTagline={true} light={true} />
            <p className="mt-4 text-xs sm:text-sm text-stone-300 max-w-sm leading-relaxed">
              India’s sovereign multi-vendor marketplace for digital products, eBooks, educational notes,
              code templates, and artisanal crafts. Powered by fair 10% marketplace splits and instant Razorpay UPI payouts.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-chakra-gold" />
                <span>Verified Downloads</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-chakra-gold" />
                <span>256-bit Encrypted Tokenization</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-chakra-gold" />
                <span>100% INR Native (No FX Fees)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Catalog */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-chakra-gold mb-3.5">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => handleLink('category-ebooks')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  eBooks & PDF Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('category-storybooks')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Story Books & Literature
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('category-education')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  UPSC & MPSC Prep Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('category-templates')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Figma & Code Templates
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('category-crafts')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Heritage Brass & Artisan Crafts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Creators & Affiliates */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-chakra-gold mb-3.5">
              Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => handleLink('become-seller')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Open Creator Store
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('affiliate-portal')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Affiliate Program (3% Earn)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('pricing')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Pricing & 10% Commission Math
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('blog')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Creator Playbook Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('marathi-guide')}
                  className="text-amber-300 font-medium hover:text-white transition-colors"
                >
                  मराठी इन्स्टॉलेशन गाइड
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Legal Governance */}
          <div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-chakra-gold mb-3.5">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <button
                  onClick={() => handleLink('terms')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('privacy')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Privacy Policy (DPDP Act)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('refund')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('copyright')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Copyright & DMCA Takedown
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('help')}
                  className="hover:text-chakra-gold transition-colors"
                >
                  Help Center & FAQs
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} CHAKRA Technologies. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Crafted for Indian Creators</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-stone-300">Netlify & Supabase PostgreSQL Ready</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => handleLink('marathi-guide')}
              className="text-chakra-gold hover:underline"
            >
              मराठी गाइड वाचा
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
