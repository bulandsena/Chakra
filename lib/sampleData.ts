import {
  Product,
  BlogPost,
  Review,
  UserProfile,
  PlatformSettings,
  CommissionRecord,
  PaymentTransaction,
  SettlementRecord,
  RefundRecord,
} from '@/types/chakra';

export const initialPlatformSettings: PlatformSettings = {
  marketplace_name: 'CHAKRA',
  tagline: 'Create • Sell • Earn',
  default_commission_rate_percent: 20, // FIXED 20% DEFAULT COMMISSION
  allow_commission_override: false, // Locked protection by default to prevent accidental change
  default_affiliate_rate_percent: 3,
  category_commissions: {
    ebooks: 20,
    storybooks: 20,
    education: 20,
    templates: 20,
    courses: 20,
    software: 20,
    artisan_crafts: 20,
    physical_goods: 20,
  },
  demo_mode_enabled: true,
  allow_seller_self_registration: true,
  require_product_moderation: false,
  cookie_attribution_days: 30,
  minimum_payout_amount_paise: 100000, // ₹1,000
  default_language: 'en',

  // Razorpay & Route Merchant Configuration
  razorpay_mid: 'ThQ32KbfQQu7Qy',
  razorpay_linked_account_id: 'acc_ThQ32KbfQQu7Qy',
  razorpay_route_enabled: false, // Route must be confirmed active before live transfers
  razorpay_webhook_url: 'https://chakra-marketplace.in/api/razorpay/webhook',
  payment_mode_live: false,
  merchant_bank_summary: 'HDFC Bank Ltd •••• 8912 (IFSC: HDFC0001245)',
};

export const sampleProducts: Product[] = [
  {
    id: 'prod_creator_playbook',
    title: 'The Sovereign Indian Creator Playbook (2026 Edition)',
    slug: 'the-sovereign-indian-creator-playbook',
    description:
      'The definitive step-by-step 240-page guide to building a profitable digital business in India. Covers eBook publishing, high-ticket digital courses, GST compliance for digital creators, UPI funnel conversion, and international payments.',
    short_description: '240-page master guide for Indian creators to package and sell digital knowledge.',
    price_paise: 100000, // ₹1,000 (standard benchmark)
    original_price_paise: 199900,
    category: 'ebooks',
    product_type: 'digital',
    tags: ['Creator Economy', 'eBook', 'Business', 'Solopreneur', 'Monetization'],
    cover_image: '/images/product_ebook_guide_1790588355041.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'Sovereign_Indian_Creator_Playbook_v2026.pdf',
    digital_file_size_bytes: 14800000,
    digital_file_format: 'PDF (Printable & DRM-free)',
    download_limit: 5,
    seller_id: 'seller_aarav',
    seller_name: 'Aarav Deshmukh',
    seller_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    rating: 4.9,
    review_count: 84,
    sales_count: 612,
    status: 'approved',
    featured: true,
    bestseller: true,
    trending: true,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-01T12:00:00Z',
    sample_content_preview:
      'CHAPTER 1: The Economics of Attention in India\nCHAPTER 2: Creating Irresistible Micro-Products\nCHAPTER 3: Pricing in INR for Indian Audiences\nCHAPTER 4: Automated Delivery & GST Simplified',
  },
  {
    id: 'prod_design_craft_system',
    title: 'DesignCraft Pro: Complete Figma Design System & Next.js Kit',
    slug: 'designcraft-pro-figma-system-nextjs',
    description:
      'A battle-tested, production-ready design library featuring 480+ UI components, dark and light modes, accessible tokens, responsive patterns, and full TypeScript Next.js code exports. Ideal for indie hackers, agencies, and senior designers building SaaS products.',
    short_description: '480+ accessible Figma UI components and clean Tailwind/React code kit.',
    price_paise: 150000, // ₹1,500
    original_price_paise: 299900,
    category: 'templates',
    product_type: 'digital',
    tags: ['Figma', 'UI Kit', 'Next.js', 'Tailwind', 'SaaS Design'],
    cover_image: '/images/product_course_design_1790588371629.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'DesignCraft_Pro_Figma_Kit_v3.zip',
    digital_file_size_bytes: 42000000,
    digital_file_format: 'ZIP (Figma Community File + Next.js Repo)',
    download_limit: 5,
    seller_id: 'seller_priya',
    seller_name: 'Priya Kulkarni',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    rating: 5.0,
    review_count: 52,
    sales_count: 320,
    status: 'approved',
    featured: true,
    bestseller: false,
    trending: true,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-20T14:30:00Z',
    updated_at: '2026-02-10T16:00:00Z',
    sample_content_preview:
      'Module 1: Design Tokens & Typography Scale\nModule 2: 480+ Atomic Components\nModule 3: 40 Ready-Made SaaS Layouts\nModule 4: Next.js Component Library Source Code',
  },
  {
    id: 'prod_brass_diya_lamp',
    title: 'Chakra Hand-Engraved Brass Diya & Aarti Vessel',
    slug: 'chakra-hand-engraved-brass-diya-lamp',
    description:
      'Handcrafted by 4th-generation metal masters of Moradabad. Solid virgin brass with delicate 16-spoke sacred wheel engravings and protective anti-tarnish lacquering. Comes in a ceremonial velvet-lined gift box with authentic brass care guide.',
    short_description: 'Pure solid brass ceremonial oil lamp hand-carved with sacred chakra spokes.',
    price_paise: 120000, // ₹1,200
    original_price_paise: 189900,
    category: 'artisan_crafts',
    product_type: 'physical',
    tags: ['Brass', 'Handmade', 'Diya', 'Indian Heritage', 'Spiritual Decor'],
    cover_image: '/images/product_handcrafted_brass_1790588387451.jpg',
    stock_quantity: 45,
    weight_grams: 850,
    download_limit: 0,
    seller_id: 'seller_moradabad',
    seller_name: 'Moradabad Heritage Guild',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    rating: 4.8,
    review_count: 39,
    sales_count: 185,
    status: 'approved',
    featured: true,
    bestseller: true,
    trending: false,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-10T08:00:00Z',
    updated_at: '2026-02-14T09:30:00Z',
  },
  {
    id: 'prod_marathi_stories',
    title: 'मराठी कथाविश्व: ऐतिहासिक आणि प्रेरणादायी कथा संग्रह',
    slug: 'marathi-kathavishwa-aitihasik-preranadayi-sangraha',
    description:
      'महाराष्ट्रातील शौर्य, संस्कृती आणि मानवी संवेदनांवर आधारित २५ अप्रतिम कथांचा संग्रह. सुंदर डिजिटल फॉन्ट्स, ऑडिओ संवादांची लिंक आणि प्रत्येक कथेचे सुरेख चित्र रेखाटन. मोबाईल आणि ई-रीडरवर सहज वाचण्याजोगे.',
    short_description: 'महाराष्ट्राच्या शौर्य आणि संस्कृतीवर आधारित २५ सुरेख कथांचा संग्रह (PDF & ePub).',
    price_paise: 50000, // ₹500
    original_price_paise: 99900,
    category: 'storybooks',
    product_type: 'digital',
    tags: ['मराठी', 'साहित्य', 'कथा', 'ऐतिहासिक', 'eBook'],
    cover_image: '/images/hero_marketplace_showcase_1790588339548.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'Marathi_Kathavishwa_Digital_Edition.pdf',
    digital_file_size_bytes: 9200000,
    digital_file_format: 'PDF & ePub Bundle',
    download_limit: 5,
    seller_id: 'seller_tanvi',
    seller_name: 'Tanvi Joshi (तन्वी जोशी)',
    seller_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop',
    rating: 4.95,
    review_count: 73,
    sales_count: 480,
    status: 'approved',
    featured: true,
    bestseller: true,
    trending: true,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-18T11:20:00Z',
    updated_at: '2026-02-05T13:00:00Z',
    sample_content_preview:
      'कथा १: सह्याद्रीचा पहारेकरी\nकथा २: राजमुद्रेचा सन्मान\nकथा ३: गोदावरीकाठचे गूढ\nकथा ४: सुवर्ण पिंपळ',
  },
  {
    id: 'prod_upsc_mpsc_notes',
    title: 'Modern Indian History & Governance: Visual Exam Master Notes',
    slug: 'modern-indian-history-visual-exam-master-notes',
    description:
      'High-yield visual summary notes designed for UPSC Civil Services, MPSC, and State PSC examinations. Includes 85 hand-drawn mindmaps, chronological timeline charts, key constitutional committee summaries, and previous years question trend analysis.',
    short_description: '85 visual mindmaps and crisp revision notes for civil service aspirants.',
    price_paise: 50000, // ₹500
    original_price_paise: 79900,
    category: 'education',
    product_type: 'digital',
    tags: ['UPSC', 'MPSC', 'History', 'Mindmaps', 'Exam Prep'],
    cover_image: '/images/product_ebook_guide_1790588355041.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'UPSC_MPSC_History_Master_Notes_2026.pdf',
    digital_file_size_bytes: 18500000,
    digital_file_format: 'High-Resolution PDF (Searchable)',
    download_limit: 5,
    seller_id: 'seller_aarav',
    seller_name: 'Aarav Deshmukh',
    seller_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    rating: 4.85,
    review_count: 61,
    sales_count: 510,
    status: 'approved',
    featured: false,
    bestseller: true,
    trending: true,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-22T07:15:00Z',
    updated_at: '2026-02-12T15:45:00Z',
  },
];

// Immutable Commission Ledger Records (20% Owner / 80% Seller)
export const sampleCommissionRecords: CommissionRecord[] = [
  {
    id: 'comm_rec_1001',
    order_id: 'ord_17905001',
    order_number: 'CHK-892144',
    product_id: 'prod_creator_playbook',
    product_title: 'The Sovereign Indian Creator Playbook (2026 Edition)',
    seller_id: 'seller_aarav',
    seller_name: 'Aarav Deshmukh',
    gross_amount_paise: 100000, // ₹1,000
    eligible_amount_paise: 100000,
    commission_percentage: 20, // FIXED 20%
    owner_commission_paise: 20000, // ₹200 (20%)
    seller_amount_paise: 80000, // ₹800 (80%)
    affiliate_commission_paise: 0,
    payment_gateway_fee_paise: 2360, // ₹23.60 (~2.36%)
    net_marketplace_revenue_paise: 17640, // ₹176.40
    payment_id: 'pay_ThQ32Kbf_001',
    settlement_status: 'settled',
    route_transfer_id: 'trf_982144_seller',
    created_at: '2026-02-24T10:15:00Z',
    updated_at: '2026-02-25T14:30:00Z',
  },
  {
    id: 'comm_rec_1002',
    order_id: 'ord_17905002',
    order_number: 'CHK-892145',
    product_id: 'prod_design_craft_system',
    product_title: 'DesignCraft Pro: Complete Figma Design System & Next.js Kit',
    seller_id: 'seller_priya',
    seller_name: 'Priya Kulkarni',
    gross_amount_paise: 150000, // ₹1,500
    eligible_amount_paise: 150000,
    commission_percentage: 20,
    owner_commission_paise: 30000, // ₹300 (20%)
    seller_amount_paise: 120000, // ₹1,200 (80%)
    affiliate_commission_paise: 4500, // ₹45 (3%)
    payment_gateway_fee_paise: 3540,
    net_marketplace_revenue_paise: 21960,
    payment_id: 'pay_ThQ32Kbf_002',
    settlement_status: 'settled',
    route_transfer_id: 'trf_982145_seller',
    created_at: '2026-02-25T11:20:00Z',
    updated_at: '2026-02-26T14:30:00Z',
  },
  {
    id: 'comm_rec_1003',
    order_id: 'ord_17905003',
    order_number: 'CHK-892146',
    product_id: 'prod_brass_diya_lamp',
    product_title: 'Chakra Hand-Engraved Brass Diya & Aarti Vessel',
    seller_id: 'seller_moradabad',
    seller_name: 'Moradabad Heritage Guild',
    gross_amount_paise: 120000, // ₹1,200
    eligible_amount_paise: 120000,
    commission_percentage: 20,
    owner_commission_paise: 24000, // ₹240 (20%)
    seller_amount_paise: 96000, // ₹960 (80%)
    affiliate_commission_paise: 0,
    payment_gateway_fee_paise: 2832,
    net_marketplace_revenue_paise: 21168,
    payment_id: 'pay_ThQ32Kbf_003',
    settlement_status: 'pending',
    created_at: '2026-02-26T09:00:00Z',
    updated_at: '2026-02-26T09:00:00Z',
  },
  {
    id: 'comm_rec_1004',
    order_id: 'ord_17905004',
    order_number: 'CHK-892147',
    product_id: 'prod_marathi_stories',
    product_title: 'मराठी कथाविश्व: ऐतिहासिक आणि प्रेरणादायी कथा संग्रह',
    seller_id: 'seller_tanvi',
    seller_name: 'Tanvi Joshi (तन्वी जोशी)',
    gross_amount_paise: 50000, // ₹500
    eligible_amount_paise: 50000,
    commission_percentage: 20,
    owner_commission_paise: 10000, // ₹100 (20%)
    seller_amount_paise: 40000, // ₹400 (80%)
    affiliate_commission_paise: 1500, // ₹15 (3%)
    payment_gateway_fee_paise: 1180,
    net_marketplace_revenue_paise: 7320,
    payment_id: 'pay_ThQ32Kbf_004',
    settlement_status: 'pending',
    created_at: '2026-02-27T14:10:00Z',
    updated_at: '2026-02-27T14:10:00Z',
  },
];

export const samplePaymentTransactions: PaymentTransaction[] = [
  {
    id: 'txn_001',
    order_id: 'ord_17905001',
    razorpay_order_id: 'order_ThQ32Kbf_001',
    razorpay_payment_id: 'pay_ThQ32Kbf_001',
    amount_paise: 100000,
    currency: 'INR',
    fee_paise: 2360,
    tax_paise: 360,
    status: 'captured',
    method: 'upi',
    vpa: 'buyer@okhdfcbank',
    email: 'rohit@example.in',
    contact: '+919822011111',
    captured_at: '2026-02-24T10:15:30Z',
    idempotency_key: 'idem_evt_capture_1001',
  },
  {
    id: 'txn_002',
    order_id: 'ord_17905002',
    razorpay_order_id: 'order_ThQ32Kbf_002',
    razorpay_payment_id: 'pay_ThQ32Kbf_002',
    amount_paise: 150000,
    currency: 'INR',
    fee_paise: 3540,
    tax_paise: 540,
    status: 'captured',
    method: 'card',
    email: 'ananya@example.in',
    contact: '+919822022222',
    captured_at: '2026-02-25T11:20:45Z',
    idempotency_key: 'idem_evt_capture_1002',
  },
  {
    id: 'txn_003',
    order_id: 'ord_17905003',
    razorpay_order_id: 'order_ThQ32Kbf_003',
    razorpay_payment_id: 'pay_ThQ32Kbf_003',
    amount_paise: 120000,
    currency: 'INR',
    fee_paise: 2832,
    tax_paise: 432,
    status: 'captured',
    method: 'netbanking',
    bank: 'HDFC',
    email: 'suresh@example.in',
    contact: '+919822033333',
    captured_at: '2026-02-26T09:00:20Z',
    idempotency_key: 'idem_evt_capture_1003',
  },
];

export const sampleSettlementRecords: SettlementRecord[] = [
  {
    id: 'setl_001',
    settlement_id: 'setl_ThQ32Kbf_881',
    amount_paise: 250000, // ₹2,500
    fee_paise: 5900,
    tax_paise: 900,
    net_amount_paise: 244100, // ₹2,441
    status: 'settled',
    utr: 'HDFCR20260226998124',
    bank_account_masked: 'HDFC Bank •••• 8912',
    created_at: '2026-02-25T23:59:59Z',
    settled_at: '2026-02-26T06:30:00Z',
  },
];

export const sampleRefundRecords: RefundRecord[] = [
  {
    id: 'rfnd_001',
    payment_id: 'pay_ThQ32Kbf_old_099',
    order_id: 'ord_17904099',
    order_number: 'CHK-712891',
    amount_paise: 50000, // ₹500
    owner_deduction_paise: 10000, // 20% reversed = ₹100
    seller_deduction_paise: 40000, // 80% reversed = ₹400
    reason: 'Customer requested cancellation prior to digital asset download',
    status: 'processed',
    created_at: '2026-02-20T16:00:00Z',
  },
];

export const sampleReviews: Review[] = [
  {
    id: 'rev_1',
    product_id: 'prod_creator_playbook',
    user_id: 'user_rohit',
    user_name: 'Rohit Verma',
    user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop',
    rating: 5,
    title: 'Worth 10x the price for Indian creators',
    comment:
      'The section on pricing in INR and setting up automated UPI payments saved me thousands of rupees. Best digital investment this year.',
    verified_purchase: true,
    created_at: '2026-02-10T14:20:00Z',
  },
  {
    id: 'rev_2',
    product_id: 'prod_design_craft_system',
    user_id: 'user_ananya',
    user_name: 'Ananya Sharma',
    user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop',
    rating: 5,
    title: 'Impeccable token structure & React exports',
    comment:
      'We launched our SaaS prototype two weeks faster because of DesignCraft Pro. The color tokens and accessibility contrast pass WCAG effortlessly.',
    verified_purchase: true,
    created_at: '2026-02-14T09:10:00Z',
  },
];

export const sampleBlogPosts: BlogPost[] = [
  {
    id: 'blog_1',
    slug: 'how-to-sell-digital-products-in-india-2026',
    title: 'How to Sell Digital Products & eBooks in India (2026 Blueprint)',
    excerpt:
      'A comprehensive roadmap covering pricing in INR, avoiding 30% platform tolls, setting up automated UPI checkout, and scaling from ₹0 to ₹1 Lakh monthly.',
    content: `
# How to Sell Digital Products in India (2026 Blueprint)

The Indian creator economy has transitioned from social media vanity metrics to sovereign direct-to-consumer digital commerce.

## 1. The 20% Fair Marketplace Model
International platforms charge upwards of 30% plus cross-border foreign exchange conversion fees. CHAKRA introduces a fixed 20% marketplace commission snapshot, with sellers receiving 80% direct net settlement.

## 2. Choosing Your Product Format
* **eBooks & PDF Notes**: Highest conversion rate, immediate utility.
* **Design Systems & Templates**: High perceived value for businesses.
* **Online Video Kits & Code**: Premium pricing potential (₹1,500 – ₹5,000).
    `,
    category: 'Creator Strategy',
    read_time_mins: 6,
    author: {
      name: 'Aarav Deshmukh',
      role: 'Head of Creator Growth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    },
    published_date: 'February 24, 2026',
    cover_image: '/images/hero_marketplace_showcase_1790588339548.jpg',
    tags: ['Monetization', 'eBooks', 'Razorpay', 'Digital Products'],
  },
];

export const sampleUser: UserProfile = {
  id: 'usr_current_user',
  email: 'owner@chakra-marketplace.in',
  full_name: 'CHAKRA Marketplace Owner',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  phone: '+91 98220 12345',
  roles: ['buyer', 'seller', 'affiliate', 'admin', 'owner'],
  activeRole: 'owner',
  bio: 'Platform founder and administrator overseeing creator economics, Razorpay Route settlements, and content governance.',
  created_at: '2026-01-01T00:00:00Z',
  seller_profile: {
    store_name: 'Chakra Sovereign Studio',
    store_slug: 'chakra-studio',
    store_description: 'Curated premium digital guides, design systems, and handcrafted artisan products.',
    store_banner: '/images/hero_marketplace_showcase_1790588339548.jpg',
    verified: true,
    verification_status: 'approved',
    payout_account: {
      account_holder_name: 'CHAKRA Technologies Pvt Ltd',
      bank_name: 'HDFC Bank Ltd',
      account_number: '•••• •••• 8912',
      ifsc_code: 'HDFC0001245',
      upi_id: 'chakra@okhdfcbank',
      pan_number: 'ABCDE1234F',
      kyc_approved: true,
      razorpay_linked_account_id: 'acc_ThQ32KbfQQu7Qy',
      route_active: false,
    },
  },
  affiliate_profile: {
    affiliate_code: 'chakra_owner',
    payment_upi: 'chakra@okhdfcbank',
    status: 'active',
    tier: 'gold',
  },
};
