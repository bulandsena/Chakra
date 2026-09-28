'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { ChakraLogo } from '@/components/common/ChakraLogo';
import { Language } from '@/lib/translations';
import { UserRole } from '@/types/chakra';
import {
  ShoppingBag,
  Moon,
  Sun,
  Globe,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Store,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const {
    language,
    setLanguage,
    t,
    darkMode,
    toggleDarkMode,
    cartCount,
    user,
    activeRole,
    setActiveRole,
    currentView,
    setCurrentView,
  } = useChakra();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'explore', label: t.nav.explore },
    { id: 'become-seller', label: t.nav.becomeSeller },
    { id: 'affiliate-portal', label: t.nav.affiliate },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'marathi-guide', label: t.nav.marathiGuide, highlight: true },
  ];

  const handleNavClick = (id: string) => {
    setCurrentView(id);
    setMobileMenuOpen(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    setActiveRole(role);
    setRoleDropdownOpen(false);
    if (role === 'seller') setCurrentView('seller-dashboard');
    else if (role === 'admin') setCurrentView('admin-dashboard');
    else if (role === 'affiliate') setCurrentView('affiliate-portal');
    else setCurrentView('home');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#132C28]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Zone 1: Single Brand Zone */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer py-1"
          >
            <ChakraLogo size={36} showWordmark={true} showTagline={true} />
          </div>

          {/* Zone 2: 4-6 Clean Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700 dark:text-stone-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors py-1 hover:text-chakra-gold-dark dark:hover:text-chakra-gold whitespace-nowrap cursor-pointer ${
                  currentView === item.id
                    ? 'text-chakra-green dark:text-chakra-gold font-semibold underline underline-offset-8 decoration-chakra-gold decoration-2'
                    : ''
                } ${item.highlight ? 'text-amber-800 dark:text-amber-300 font-semibold' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions (Cart, Role Perspective, Language, Theme) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
                title="Select Interface Language"
              >
                <Globe className="w-4 h-4 text-chakra-gold" />
                <span className="uppercase font-mono">{language}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between ${
                      language === 'en' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-chakra-gold" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('mr');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between ${
                      language === 'mr' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>मराठी</span>
                    {language === 'mr' && <span className="w-1.5 h-1.5 rounded-full bg-chakra-gold" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('hi');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-between ${
                      language === 'hi' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>हिंदी</span>
                    {language === 'hi' && <span className="w-1.5 h-1.5 rounded-full bg-chakra-gold" />}
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-chakra-gold" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Role Perspective Switcher (Buyer / Seller / Affiliate / Admin) */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-chakra-green dark:text-chakra-ivory bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg hover:border-chakra-gold/60 transition-colors whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-chakra-gold" />
                <span className="capitalize">{activeRole} View</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 font-medium">
                    SWITCH TEST PERSPECTIVE
                  </div>

                  <button
                    onClick={() => handleRoleSelect('buyer')}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-2 ${
                      activeRole === 'buyer' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Buyer (Shopping & Downloads)</span>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('seller')}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-2 ${
                      activeRole === 'seller' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Seller (Uploads & Payouts)</span>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('affiliate')}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-2 ${
                      activeRole === 'affiliate' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Affiliate (3% Referrals)</span>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full px-3 py-2 text-left hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-2 ${
                      activeRole === 'admin' ? 'font-bold text-chakra-gold-dark dark:text-chakra-gold' : 'text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Owner Admin (Moderation & Rates)</span>
                  </button>

                  <div className="mt-1 pt-1 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => {
                        setCurrentView('download-library');
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t.nav.downloads}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag Button with tabular badge */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-chakra-green dark:text-chakra-ivory hover:text-chakra-gold transition-colors rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60"
              title="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 bg-chakra-gold text-stone-950 text-[10px] font-bold rounded-full shadow-xs tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
                  currentView === item.id
                    ? 'text-chakra-green dark:text-chakra-gold font-bold bg-stone-50 dark:bg-stone-900'
                    : 'text-stone-700 dark:text-stone-300'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-1 text-xs">
              <button
                onClick={() => handleNavClick('download-library')}
                className="text-left px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              >
                {t.nav.downloads}
              </button>
              <button
                onClick={() => handleNavClick('order-history')}
                className="text-left px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              >
                {t.nav.orders}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
