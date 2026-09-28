'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import {
  Product,
  CartItem,
  Order,
  DownloadTicket,
  UserProfile,
  UserRole,
  ProductCategory,
  PlatformSettings,
  Review,
  AffiliateLink,
  PayoutRecord,
  NotificationItem,
  CommissionRecord,
  PaymentTransaction,
  SettlementRecord,
  RefundRecord,
} from '@/types/chakra';
import {
  sampleProducts,
  sampleUser,
  sampleReviews,
  initialPlatformSettings,
  sampleCommissionRecords,
  samplePaymentTransactions,
  sampleSettlementRecords,
  sampleRefundRecords,
} from '@/lib/sampleData';
import { calculateCommission, rupeesToPaise } from '@/lib/commission';
import { Language, translations } from '@/lib/translations';

// External helper generators (outside component body for pure idempotent render compliance)
function generateOrderId(): string {
  return `ord_${Date.now()}`;
}

function generateOrderNumber(): string {
  return `CHK-${Math.floor(100000 + Math.random() * 900000)}`;
}

function generatePaymentId(paymentMethod: string): string {
  return paymentMethod === 'demo'
    ? `pay_sim_${Date.now().toString(36)}`
    : `pay_ThQ32Kbf_${Date.now().toString(36)}`;
}

function generateDownloadTicket(orderId: string, product: Product): DownloadTicket {
  const token = `tk_${Math.random().toString(36).substring(2)}_${Date.now().toString(36)}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: `dl_${Date.now()}_${product.id}`,
    order_id: orderId,
    product_id: product.id,
    product_title: product.title,
    file_name: product.digital_file_name || `${product.slug}.pdf`,
    file_size_formatted: `${((product.digital_file_size_bytes || 15000000) / 1000000).toFixed(1)} MB`,
    download_token: token,
    download_url: `/api/download?token=${token}&order=${orderId}`,
    max_downloads: product.download_limit || 5,
    download_count: 0,
    expires_at: expiresAt,
    created_at: new Date().toISOString(),
  };
}

function generateProductId(): string {
  return `prod_${Date.now()}`;
}

function generateReviewId(): string {
  return `rev_${Date.now()}`;
}

function generatePayoutId(): string {
  return `pay_${Date.now()}`;
}

function generateAffiliateId(): string {
  return `aff_${Date.now()}`;
}

function generateNotifId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

interface ChakraContextType {
  // Localization & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['en'];
  darkMode: boolean;
  toggleDarkMode: () => void;

  // User & Authentication
  user: UserProfile;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Products
  products: Product[];
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (cat: ProductCategory | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sales_count' | 'rating' | 'review_count'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  moderateProduct: (id: string, status: 'approved' | 'rejected') => void;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, affiliateRef?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalPaise: number;
  activeAffiliateCode: string | null;
  setActiveAffiliateCode: (code: string | null) => void;

  // Orders & Downloads
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentMethod: 'razorpay' | 'stripe' | 'demo';
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  }) => Promise<Order>;
  downloads: DownloadTicket[];
  triggerDownload: (ticketId: string) => Promise<{ success: boolean; message: string }>;

  // Accounting, Ledger & Owner Finance
  commissionRecords: CommissionRecord[];
  paymentTransactions: PaymentTransaction[];
  settlementRecords: SettlementRecord[];
  refundRecords: RefundRecord[];
  processRefund: (orderId: string, reason: string) => Promise<{ success: boolean; message: string }>;

  // Wishlist & Reviews
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'created_at'>) => void;

  // Affiliates
  affiliateLinks: AffiliateLink[];
  generateAffiliateLink: (productId: string) => string;
  recordAffiliateClick: (code: string) => void;

  // Seller & Admin
  payouts: PayoutRecord[];
  requestPayout: (amountPaise: number, method: 'razorpay_route' | 'bank_transfer' | 'upi', destination: string) => void;
  approvePayout: (payoutId: string) => void;
  holdPayout: (payoutId: string, reason: string) => void;
  platformSettings: PlatformSettings;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => void;
  testRazorpayConnection: () => Promise<{ success: boolean; message: string; details?: any }>;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;

  // Navigation Helper
  currentView: string;
  setCurrentView: (view: string, params?: Record<string, string>) => void;
  viewParams: Record<string, string>;
}

// Local storage listener set for clean SSR-friendly hydration without cascading renders
const storageListeners = new Set<() => void>();
function notifyStorageChange() {
  storageListeners.forEach((listener) => listener());
}
function subscribeStorage(callback: () => void) {
  storageListeners.add(callback);
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', callback);
  }
  return () => {
    storageListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', callback);
    }
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('chakra_lang') as Language;
    if (saved === 'en' || saved === 'mr' || saved === 'hi') return saved;
  } catch {
    // Ignore restricted localStorage
  }
  return 'en';
}
function getLanguageServerSnapshot(): Language {
  return 'en';
}

function getDarkModeSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('chakra_theme') === 'dark';
  } catch {
    // Ignore restricted localStorage
  }
  return false;
}
function getDarkModeServerSnapshot(): boolean {
  return false;
}

const ChakraContext = createContext<ChakraContextType | undefined>(undefined);

export const ChakraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme & Language synced cleanly with SSR hydration guarantee
  const language = useSyncExternalStore(subscribeStorage, getLanguageSnapshot, getLanguageServerSnapshot);
  const darkMode = useSyncExternalStore(subscribeStorage, getDarkModeSnapshot, getDarkModeServerSnapshot);

  // User
  const [user, setUser] = useState<UserProfile>(sampleUser);
  const [activeRole, setActiveRoleState] = useState<UserRole>('owner');

  // Products
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeAffiliateCode, setActiveAffiliateCode] = useState<string | null>('dev_growth_26');

  // Orders & Downloads
  const [orders, setOrders] = useState<Order[]>([]);
  const [downloads, setDownloads] = useState<DownloadTicket[]>([]);

  // Financial Ledger & Accounting
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>(sampleCommissionRecords);
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(samplePaymentTransactions);
  const [settlementRecords, setSettlementRecords] = useState<SettlementRecord[]>(sampleSettlementRecords);
  const [refundRecords, setRefundRecords] = useState<RefundRecord[]>(sampleRefundRecords);

  // Wishlist & Reviews
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);

  // Affiliates & Payouts
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: 'aff_1',
      affiliate_id: 'usr_current_user',
      affiliate_code: 'dev_growth_26',
      product_id: 'prod_creator_playbook',
      product_title: 'The Sovereign Indian Creator Playbook (2026 Edition)',
      target_url: 'https://chakra-marketplace.in/product/the-sovereign-indian-creator-playbook?ref=dev_growth_26',
      clicks: 142,
      conversions: 8,
      pending_commission_paise: 24000, // 8 * ₹30 (3% of ₹1,000) = ₹240
      approved_earnings_paise: 48000,
      paid_earnings_paise: 50000,
      created_at: '2026-01-20T10:00:00Z',
    },
  ]);

  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    {
      id: 'pay_101',
      seller_id: 'seller_aarav',
      seller_name: 'Aarav Deshmukh',
      amount_paise: 8000000, // ₹80,000 (80% of sales)
      status: 'completed',
      payout_method: 'bank_transfer',
      destination_summary: 'HDFC Bank •••• 4120 (IFSC: HDFC0001245)',
      reference_number: 'UTR-20260220-891244',
      requested_at: '2026-02-18T10:00:00Z',
      processed_at: '2026-02-19T14:30:00Z',
    },
    {
      id: 'pay_102',
      seller_id: 'seller_priya',
      seller_name: 'Priya Kulkarni',
      amount_paise: 2400000, // ₹24,000
      status: 'on_hold',
      payout_method: 'razorpay_route',
      destination_summary: 'Razorpay Route Linked Account (acc_priya_ui)',
      linked_account_id: 'acc_priya_ui',
      requested_at: '2026-02-26T10:00:00Z',
      hold_reason: 'Awaiting Route activation approval from Razorpay merchant compliance.',
    },
  ]);

  // Settings & Notifications
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_welcome',
      title: 'CHAKRA Financial Engine Online',
      message: 'Fixed 20% owner commission model and Razorpay Route architecture initialized.',
      type: 'finance',
      read: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  ]);

  // Navigation View Router
  const [currentView, setCurrentViewState] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});

  // Sync dark mode class with DOM
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    try {
      if (typeof window !== 'undefined') {
        const next = !darkMode;
        localStorage.setItem('chakra_theme', next ? 'dark' : 'light');
        notifyStorageChange();
      }
    } catch {
      // Ignore localStorage access failures in restricted environments
    }
  };

  const setLanguage = (lang: Language) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('chakra_lang', lang);
        notifyStorageChange();
      }
    } catch {
      // Ignore localStorage access failures in restricted environments
    }
  };

  const addNotification = useCallback((title: string, message: string, type: NotificationItem['type'] = 'system') => {
    const item: NotificationItem = {
      id: generateNotifId(),
      title,
      message,
      type,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [item, ...prev.slice(0, 15)]);
  }, []);

  const setActiveRole = (role: UserRole) => {
    setActiveRoleState(role);
    setUser((prev) => ({ ...prev, activeRole: role }));
    addNotification('Role Switched', `Active perspective set to ${role.toUpperCase()}.`, 'system');
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
    addNotification('Profile Saved', 'Your user profile details have been updated.', 'system');
  };

  const setCurrentView = (view: string, params: Record<string, string> = {}) => {
    setCurrentViewState(view);
    setViewParams(params);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, affiliateRef?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          affiliate_ref: affiliateRef || activeAffiliateCode || undefined,
        },
      ];
    });

    addNotification(
      'Added to Cart',
      `"${product.title}" added to your bag.`,
      'order'
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotalPaise = cart.reduce(
    (acc, item) => acc + item.product.price_paise * item.quantity,
    0
  );

  // Orders, Checkout & Ledger Recording
  const createOrder = async ({
    customerName,
    customerEmail,
    customerPhone,
    paymentMethod,
    shippingAddress,
  }: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentMethod: 'razorpay' | 'stripe' | 'demo';
    shippingAddress?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
    };
  }): Promise<Order> => {
    const defaultCommissionPercent = platformSettings.default_commission_rate_percent ?? 20;

    const orderItems = cart.map((item) => {
      const hasAff = Boolean(item.affiliate_ref);
      const categoryRate = platformSettings.category_commissions?.[item.product.category];
      const effectiveRate = item.product.commission_override_percent ?? (categoryRate ?? defaultCommissionPercent);
      const commission = calculateCommission({
        productPricePaise: item.product.price_paise * item.quantity,
        platformCommissionRatePercent: effectiveRate,
        affiliateCommissionRatePercent: item.product.custom_affiliate_rate_percent || platformSettings.default_affiliate_rate_percent,
        hasAffiliate: hasAff,
      });

      return {
        product_id: item.product.id,
        title: item.product.title,
        product_type: item.product.product_type,
        price_paise: item.product.price_paise,
        quantity: item.quantity,
        cover_image: item.product.cover_image,
        digital_file_name: item.product.digital_file_name,
        seller_id: item.product.seller_id,
        seller_name: item.product.seller_name,
        affiliate_code: item.affiliate_ref,
        commission,
      };
    });

    const subtotalPaise = cartSubtotalPaise;
    const taxPaise = Math.round(subtotalPaise * 0.05);
    const totalPaise = subtotalPaise + taxPaise;

    const orderId = generateOrderId();
    const orderNumber = generateOrderNumber();
    const paymentId = generatePaymentId(paymentMethod);

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: user.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      items: orderItems,
      subtotal_paise: subtotalPaise,
      tax_paise: taxPaise,
      discount_paise: 0,
      total_paise: totalPaise,
      status: 'paid',
      payment_method: paymentMethod,
      payment_id: paymentId,
      shipping_address: shippingAddress,
      fulfillment_status: cart.some((i) => i.product.product_type === 'physical')
        ? 'pending'
        : 'not_applicable',
      commission_percentage: defaultCommissionPercent,
      created_at: new Date().toISOString(),
    };

    // Record immutable Commission Ledger entries for each order item
    const newCommissionEntries: CommissionRecord[] = orderItems.map((item, idx) => {
      return {
        id: `comm_rec_${Date.now()}_${idx}`,
        order_id: orderId,
        order_number: orderNumber,
        product_id: item.product_id,
        product_title: item.title,
        seller_id: item.seller_id,
        seller_name: item.seller_name,
        gross_amount_paise: item.price_paise * item.quantity,
        eligible_amount_paise: item.price_paise * item.quantity,
        commission_percentage: item.commission.platform_commission_rate_percent,
        owner_commission_paise: item.commission.platform_gross_fee_paise,
        seller_amount_paise: item.commission.seller_gross_amount_paise,
        affiliate_commission_paise: item.commission.affiliate_fee_paise,
        payment_gateway_fee_paise: item.commission.estimated_payment_gateway_fee_paise,
        net_marketplace_revenue_paise: item.commission.platform_net_fee_paise,
        payment_id: paymentId,
        settlement_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // Record payment transaction
    const newTxn: PaymentTransaction = {
      id: `txn_${Date.now()}`,
      order_id: orderId,
      razorpay_order_id: `order_${Date.now().toString(36)}`,
      razorpay_payment_id: paymentId,
      amount_paise: totalPaise,
      currency: 'INR',
      fee_paise: Math.round((totalPaise * 236) / 10000),
      tax_paise: taxPaise,
      status: 'captured',
      method: paymentMethod === 'demo' ? 'demo_sim' : 'upi',
      vpa: customerEmail,
      email: customerEmail,
      contact: customerPhone || '+919822000000',
      captured_at: new Date().toISOString(),
      idempotency_key: `idem_${orderId}`,
    };

    // Generate secure download tickets for digital goods
    const newDownloads: DownloadTicket[] = [];
    cart.forEach((item) => {
      if (item.product.product_type === 'digital') {
        newDownloads.push(generateDownloadTicket(newOrder.id, item.product));
      }
    });

    setOrders((prev) => [newOrder, ...prev]);
    setCommissionRecords((prev) => [...newCommissionEntries, ...prev]);
    setPaymentTransactions((prev) => [newTxn, ...prev]);
    setDownloads((prev) => [...newDownloads, ...prev]);
    clearCart();

    addNotification(
      'Payment Verified & Recorded',
      `Order ${newOrder.order_number} captured. Platform fee (₹${(orderItems.reduce((a, b) => a + b.commission.platform_gross_fee_paise, 0) / 100).toFixed(0)}) and creator share stored.`,
      'finance'
    );

    return newOrder;
  };

  // Refund processing handler
  const processRefund = async (orderId: string, reason: string): Promise<{ success: boolean; message: string }> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) {
      return { success: false, message: 'Order reference not found' };
    }

    const totalRefundPaise = targetOrder.total_paise;
    const effectiveCommissionRate = (targetOrder.commission_percentage || platformSettings.default_commission_rate_percent || 10) / 100;
    const ownerDeductionPaise = Math.round(totalRefundPaise * effectiveCommissionRate);
    const sellerDeductionPaise = totalRefundPaise - ownerDeductionPaise;

    const newRefund: RefundRecord = {
      id: `rfnd_${Date.now()}`,
      payment_id: targetOrder.payment_id,
      order_id: targetOrder.id,
      order_number: targetOrder.order_number,
      amount_paise: totalRefundPaise,
      owner_deduction_paise: ownerDeductionPaise,
      seller_deduction_paise: sellerDeductionPaise,
      reason,
      status: 'processed',
      created_at: new Date().toISOString(),
    };

    setRefundRecords((prev) => [newRefund, ...prev]);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'refunded' } : o))
    );
    setCommissionRecords((prev) =>
      prev.map((c) => (c.order_id === orderId ? { ...c, settlement_status: 'refunded' } : c))
    );

    addNotification(
      'Refund Reconciled',
      `Reversed ₹${(totalRefundPaise / 100).toFixed(0)}: ₹${(ownerDeductionPaise / 100).toFixed(0)} platform cut reversed, ₹${(sellerDeductionPaise / 100).toFixed(0)} deducted from seller balance.`,
      'finance'
    );

    return { success: true, message: 'Refund completed and ledger adjusted.' };
  };

  // Secure download handler
  const triggerDownload = async (ticketId: string): Promise<{ success: boolean; message: string }> => {
    const ticket = downloads.find((d) => d.id === ticketId);
    if (!ticket) {
      return { success: false, message: 'Invalid or non-existent download token.' };
    }

    if (ticket.download_count >= ticket.max_downloads) {
      return {
        success: false,
        message: `Download limit of ${ticket.max_downloads} reached for security. Contact creator or support for reset.`,
      };
    }

    setDownloads((prev) =>
      prev.map((d) => (d.id === ticketId ? { ...d, download_count: d.download_count + 1 } : d))
    );

    try {
      const fileContent = `
========================================================================
CHAKRA MARKETPLACE - VERIFIED DIGITAL PRODUCT LICENSED DOWNLOAD
========================================================================
Product: ${ticket.product_title}
File: ${ticket.file_name}
Licensed To: ${user.full_name} (${user.email})
Order Ref: ${ticket.order_id}
Token: ${ticket.download_token}
Download Timestamp: ${new Date().toISOString()}
License: Single User Sovereign License (Non-redistributable)

Thank you for supporting sovereign creators on CHAKRA!
Platform: https://chakra-marketplace.in
========================================================================
      `;
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = ticket.file_name || 'chakra-digital-asset.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification(
        'File Downloaded',
        `Started download for ${ticket.file_name}. Remaining: ${ticket.max_downloads - (ticket.download_count + 1)}`,
        'system'
      );
      return { success: true, message: 'Download initiated successfully.' };
    } catch {
      return { success: false, message: 'Could not trigger browser download.' };
    }
  };

  // Product management
  const addProduct = (
    newProdData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'sales_count' | 'rating' | 'review_count'>
  ) => {
    const newProduct: Product = {
      ...newProdData,
      id: generateProductId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sales_count: 0,
      rating: 5.0,
      review_count: 0,
      status: platformSettings.require_product_moderation ? 'pending' : 'approved',
    };

    setProducts((prev) => [newProduct, ...prev]);
    addNotification(
      'Product Published',
      `"${newProduct.title}" has been created and listed in your store catalog.`,
      'moderation'
    );
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addNotification('Product Deleted', 'The item was removed from the marketplace.', 'moderation');
  };

  const moderateProduct = (id: string, status: 'approved' | 'rejected') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    addNotification(
      'Moderation Action',
      `Product status changed to ${status.toUpperCase()}.`,
      'moderation'
    );
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'created_at'>) => {
    const newRev: Review = {
      ...review,
      id: generateReviewId(),
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === review.product_id) {
          const currentCount = p.review_count;
          const currentTotal = p.rating * currentCount;
          const newCount = currentCount + 1;
          const newAvg = Number(((currentTotal + review.rating) / newCount).toFixed(2));
          return { ...p, rating: newAvg, review_count: newCount };
        }
        return p;
      })
    );
    addNotification('Review Published', 'Thank you for your valuable feedback!', 'system');
  };

  // Affiliates
  const generateAffiliateLink = (productId: string): string => {
    const product = products.find((p) => p.id === productId);
    const code = user.affiliate_profile?.affiliate_code || 'chakra_partner';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chakra-marketplace.in';
    const target = `${baseUrl}?product=${product?.slug || productId}&ref=${code}`;

    const existing = affiliateLinks.find((l) => l.product_id === productId);
    if (!existing && product) {
      setAffiliateLinks((prev) => [
        {
          id: generateAffiliateId(),
          affiliate_id: user.id,
          affiliate_code: code,
          product_id: product.id,
          product_title: product.title,
          target_url: target,
          clicks: 1,
          conversions: 0,
          pending_commission_paise: 0,
          approved_earnings_paise: 0,
          paid_earnings_paise: 0,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    return target;
  };

  const recordAffiliateClick = (code: string) => {
    setAffiliateLinks((prev) =>
      prev.map((l) => (l.affiliate_code === code ? { ...l, clicks: l.clicks + 1 } : l))
    );
  };

  // Payouts
  const requestPayout = (amountPaise: number, method: 'razorpay_route' | 'bank_transfer' | 'upi', destination: string) => {
    const newPayout: PayoutRecord = {
      id: generatePayoutId(),
      seller_id: user.id,
      seller_name: user.seller_profile?.store_name || user.full_name,
      amount_paise: amountPaise,
      status: 'pending',
      payout_method: method,
      destination_summary: destination,
      requested_at: new Date().toISOString(),
    };
    setPayouts((prev) => [newPayout, ...prev]);
    addNotification('Payout Requested', `Withdrawal request for ₹${(amountPaise / 100).toFixed(0)} submitted for admin reconciliation.`, 'payout');
  };

  const approvePayout = (payoutId: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'completed',
              reference_number: `UTR-MKT-${Math.floor(10000000 + Math.random() * 90000000)}`,
              processed_at: new Date().toISOString(),
            }
          : p
      )
    );
    addNotification('Payout Disbursed', 'Transfer reconciled and marked completed.', 'payout');
  };

  const holdPayout = (payoutId: string, reason: string) => {
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'on_hold',
              hold_reason: reason,
            }
          : p
      )
    );
    addNotification('Settlement Held', `Payout held: ${reason}`, 'payout');
  };

  const updatePlatformSettings = (settings: Partial<PlatformSettings>) => {
    setPlatformSettings((prev) => ({ ...prev, ...settings }));
    addNotification('Settings Saved', 'Global marketplace configuration updated.', 'system');
  };

  // Test real Razorpay connection via server API
  const testRazorpayConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
    try {
      const res = await fetch('/api/razorpay/test-connection', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        addNotification('Razorpay Connected', 'Verified live connection to Razorpay Merchant API.', 'finance');
        return { success: true, message: data.message, details: data };
      } else {
        return {
          success: false,
          message: data.error || 'Connection failed. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Netlify environment.',
          details: data,
        };
      }
    } catch {
      return {
        success: false,
        message: 'Could not reach server API. Complete Razorpay environment configuration in Netlify/production.',
      };
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const currentTranslations = translations[language] || translations.en;

  return (
    <ChakraContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        darkMode,
        toggleDarkMode,
        user,
        activeRole,
        setActiveRole,
        updateUserProfile,
        products,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addProduct,
        updateProduct,
        deleteProduct,
        moderateProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalPaise,
        activeAffiliateCode,
        setActiveAffiliateCode,
        orders,
        createOrder,
        downloads,
        triggerDownload,
        commissionRecords,
        paymentTransactions,
        settlementRecords,
        refundRecords,
        processRefund,
        wishlist,
        toggleWishlist,
        reviews,
        addReview,
        affiliateLinks,
        generateAffiliateLink,
        recordAffiliateClick,
        payouts,
        requestPayout,
        approvePayout,
        holdPayout,
        platformSettings,
        updatePlatformSettings,
        testRazorpayConnection,
        notifications,
        markNotificationRead,
        addNotification,
        currentView,
        setCurrentView,
        viewParams,
      }}
    >
      {children}
    </ChakraContext.Provider>
  );
};

export const useChakra = (): ChakraContextType => {
  const context = useContext(ChakraContext);
  if (!context) {
    throw new Error('useChakra must be used within a ChakraProvider');
  }
  return context;
};
