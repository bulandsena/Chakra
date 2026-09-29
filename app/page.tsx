'use client';

import React, { useState } from 'react';
import { ChakraProvider, useChakra } from '@/context/ChakraContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NotificationToast } from '@/components/layout/NotificationToast';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { RazorpayRouteNoticeBanner } from '@/components/common/RazorpayRouteNoticeBanner';

// Home Views
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedShowcase } from '@/components/home/FeaturedShowcase';
import { CommissionExplainer } from '@/components/home/CommissionExplainer';

// Catalog & Product Views
import { ExploreCatalogView } from '@/components/products/ExploreCatalogView';
import { ProductDetailView } from '@/components/products/ProductDetailView';

// Seller & Admin Views
import { SellerDashboardView } from '@/components/seller/SellerDashboardView';
import { SellerStorefrontView } from '@/components/seller/SellerStorefrontView';
import { BecomeSellerView } from '@/components/seller/BecomeSellerView';
import { AdminDashboardView } from '@/components/admin/AdminDashboardView';

// Affiliate, Pricing, Downloads, Orders
import { AffiliatePortalView } from '@/components/affiliate/AffiliatePortalView';
import { PricingCalculatorView } from '@/components/pricing/PricingCalculatorView';
import { DownloadLibraryView } from '@/components/downloads/DownloadLibraryView';
import { OrderHistoryView } from '@/components/orders/OrderHistoryView';

// Guides, Blog, Legal, About
import { MarathiGuideView } from '@/components/guides/MarathiGuideView';
import { BlogView } from '@/components/blog/BlogView';
import { LegalPagesView } from '@/components/legal/LegalPagesView';
import { AboutAndContactView } from '@/components/common/AboutAndContactView';

function ChakraApp() {
  const { currentView, viewParams, setSelectedCategory } = useChakra();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <HeroSection />
            <CategoryGrid />
            <FeaturedShowcase />
            <CommissionExplainer />
          </>
        );

      case 'explore':
        return <ExploreCatalogView />;

      case 'category-ebooks':
        setSelectedCategory('ebooks');
        return <ExploreCatalogView />;

      case 'category-storybooks':
        setSelectedCategory('storybooks');
        return <ExploreCatalogView />;

      case 'category-education':
        setSelectedCategory('education');
        return <ExploreCatalogView />;

      case 'category-templates':
        setSelectedCategory('templates');
        return <ExploreCatalogView />;

      case 'category-crafts':
        setSelectedCategory('artisan_crafts');
        return <ExploreCatalogView />;

      case 'product-detail':
        return (
          <ProductDetailView
            productId={viewParams.id || 'prod_creator_playbook'}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        );

      case 'seller-storefront':
        return <SellerStorefrontView sellerId={viewParams.sellerId} />;

      case 'become-seller':
        return <BecomeSellerView />;

      case 'seller-dashboard':
        return <SellerDashboardView />;

      case 'admin-dashboard':
        return <AdminDashboardView />;

      case 'affiliate-portal':
        return <AffiliatePortalView />;

      case 'pricing':
        return <PricingCalculatorView />;

      case 'download-library':
        return <DownloadLibraryView />;

      case 'order-history':
        return <OrderHistoryView />;

      case 'marathi-guide':
        return <MarathiGuideView />;

      case 'blog':
        return <BlogView />;

      case 'terms':
        return <LegalPagesView initialTab="terms" />;

      case 'privacy':
        return <LegalPagesView initialTab="privacy" />;

      case 'refund':
        return <LegalPagesView initialTab="refund" />;

      case 'copyright':
        return <LegalPagesView initialTab="copyright" />;

      case 'help':
        return <LegalPagesView initialTab="help" />;

      case 'about':
        return <AboutAndContactView initialMode="about" />;

      case 'contact':
        return <AboutAndContactView initialMode="contact" />;

      default:
        return (
          <>
            <HeroSection />
            <CategoryGrid />
            <FeaturedShowcase />
            <CommissionExplainer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0c1c19] text-stone-900 dark:text-stone-100 transition-colors">
      {/* Prominent Global Compliance & Settlement Notice */}
      <RazorpayRouteNoticeBanner />

      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Floating Notifications */}
      <NotificationToast />
    </div>
  );
}

export default function Page() {
  return (
    <ChakraProvider>
      <ChakraApp />
    </ChakraProvider>
  );
}
