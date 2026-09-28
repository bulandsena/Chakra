import { Product, BlogPost, Review, UserProfile, PlatformSettings } from '@/types/chakra';

export const initialPlatformSettings: PlatformSettings = {
  marketplace_name: 'CHAKRA',
  tagline: 'Create • Sell • Earn',
  default_commission_rate_percent: 10,
  default_affiliate_rate_percent: 3,
  category_commissions: {
    ebooks: 10,
    storybooks: 10,
    education: 8,
    templates: 10,
    courses: 12,
    software: 10,
    artisan_crafts: 10,
    physical_goods: 10,
  },
  demo_mode_enabled: true,
  allow_seller_self_registration: true,
  require_product_moderation: false,
  cookie_attribution_days: 30,
  minimum_payout_amount_paise: 100000, // ₹1,000
  default_language: 'en',
};

export const sampleProducts: Product[] = [
  {
    id: 'prod_creator_playbook',
    title: 'The Sovereign Indian Creator Playbook (2026 Edition)',
    slug: 'the-sovereign-indian-creator-playbook',
    description:
      'The definitive step-by-step 240-page guide to building a profitable digital business in India. Covers eBook publishing, high-ticket digital courses, GST compliance for digital creators, UPI funnel conversion, and international payments without losing 30% to platform middlemen.',
    short_description: '240-page master guide for Indian creators to package and sell digital knowledge.',
    price_paise: 49900, // ₹499
    original_price_paise: 99900,
    category: 'ebooks',
    product_type: 'digital',
    tags: ['Creator Economy', 'eBook', 'Business', 'Solopreneur', 'Monetization'],
    cover_image: '/images/product_ebook_guide_1790588355041.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'Sovereign_Indian_Creator_Playbook_v2026.pdf',
    digital_file_size_bytes: 14800000, // 14.8 MB
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
    price_paise: 149900, // ₹1,499
    original_price_paise: 299900,
    category: 'templates',
    product_type: 'digital',
    tags: ['Figma', 'UI Kit', 'Next.js', 'Tailwind', 'SaaS Design'],
    cover_image: '/images/product_course_design_1790588371629.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'DesignCraft_Pro_Figma_Kit_v3.zip',
    digital_file_size_bytes: 42000000, // 42 MB
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
    custom_affiliate_rate_percent: 5,
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
    price_paise: 129900, // ₹1,299
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
    price_paise: 29900, // ₹299
    original_price_paise: 49900,
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
    custom_affiliate_rate_percent: 4,
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
    price_paise: 39900, // ₹399
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
  {
    id: 'prod_freelance_finance_sheets',
    title: 'Chakra Wealth OS: Freelance Income, Invoicing & GST Sheet',
    slug: 'chakra-wealth-os-freelance-invoicing-gst-sheets',
    description:
      'Automated financial dashboard for Indian freelancers and digital agencies. Generates GST-compliant PDF invoices, calculates 44ADA presumptive taxation, tracks client payment milestones, and forecasts quarterly advance taxes automatically.',
    short_description: 'Automated Google Sheets template for Indian freelancers, GST and income tracking.',
    price_paise: 49900, // ₹499
    original_price_paise: 99900,
    category: 'templates',
    product_type: 'digital',
    tags: ['Google Sheets', 'Finance', 'Freelancing', 'GST', 'Tax Calculator'],
    cover_image: '/images/product_course_design_1790588371629.jpg',
    preview_file_url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    digital_file_name: 'Chakra_Wealth_OS_v4.xlsx',
    digital_file_size_bytes: 5400000,
    digital_file_format: 'Google Sheets link + Excel XLSX',
    download_limit: 5,
    seller_id: 'seller_priya',
    seller_name: 'Priya Kulkarni',
    seller_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop',
    rating: 4.75,
    review_count: 28,
    sales_count: 240,
    status: 'approved',
    featured: false,
    bestseller: false,
    trending: false,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-25T13:00:00Z',
    updated_at: '2026-02-15T11:00:00Z',
  },
  {
    id: 'prod_nextjs_saas_boilerplate',
    title: 'NextSaas Pro: Production Multi-Tenant Boilerplate',
    slug: 'nextsaas-pro-multi-tenant-boilerplate',
    description:
      'Full-stack Next.js 15 App Router boilerplate with Supabase PostgreSQL, Authentication, Stripe & Razorpay webhook handlers, admin analytics panel, and clean shadcn/Tailwind components. Ready to deploy to Netlify or Vercel in 15 minutes.',
    short_description: 'Next.js 15, Supabase, Tailwind, and Razorpay production starter codebase.',
    price_paise: 249900, // ₹2,499
    original_price_paise: 499900,
    category: 'software',
    product_type: 'digital',
    tags: ['Next.js', 'Supabase', 'SaaS Boilerplate', 'TypeScript', 'Tailwind'],
    cover_image: '/images/product_course_design_1790588371629.jpg',
    digital_file_name: 'nextsaas-pro-v2.1.zip',
    digital_file_size_bytes: 28000000,
    digital_file_format: 'Full GitHub Repo Source Archive (ZIP)',
    download_limit: 5,
    seller_id: 'seller_aarav',
    seller_name: 'Aarav Deshmukh',
    seller_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
    rating: 4.92,
    review_count: 45,
    sales_count: 198,
    status: 'approved',
    featured: true,
    bestseller: false,
    trending: true,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 5,
    created_at: '2026-02-01T09:00:00Z',
    updated_at: '2026-02-20T17:15:00Z',
  },
  {
    id: 'prod_silk_handcrafted_journal',
    title: 'Artisan Mulberry Silk Hardbound Creator Journal & Brass Bookmark',
    slug: 'artisan-mulberry-silk-hardbound-journal-brass-bookmark',
    description:
      'Exquisite 192-page unruled archival cotton paper journal bound in hand-woven raw mulberry silk. Accompanied by a precision laser-etched circular chakra brass bookmark. Hand-bound by traditional artisans in Varanasi.',
    short_description: 'Raw silk hardbound journal with handmade cotton pages and solid brass chakra bookmark.',
    price_paise: 89900, // ₹899
    original_price_paise: 129900,
    category: 'physical_goods',
    product_type: 'physical',
    tags: ['Journal', 'Silk', 'Stationery', 'Gift Box', 'Handcrafted'],
    cover_image: '/images/hero_marketplace_showcase_1790588339548.jpg',
    stock_quantity: 60,
    weight_grams: 450,
    download_limit: 0,
    seller_id: 'seller_moradabad',
    seller_name: 'Moradabad Heritage Guild',
    seller_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop',
    rating: 4.88,
    review_count: 31,
    sales_count: 142,
    status: 'approved',
    featured: false,
    bestseller: false,
    trending: false,
    affiliate_eligible: true,
    custom_affiliate_rate_percent: 3,
    created_at: '2026-01-28T10:15:00Z',
    updated_at: '2026-02-18T14:00:00Z',
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
  {
    id: 'rev_3',
    product_id: 'prod_brass_diya_lamp',
    user_id: 'user_suresh',
    user_name: 'Suresh Patil',
    user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
    rating: 5,
    title: 'Superb craftsmanship and heavy pure brass',
    comment:
      'The chakra engraving is mesmerizing. Delivered safely to Pune in a protective velvet gift pack. Excellent quality.',
    verified_purchase: true,
    created_at: '2026-02-18T11:00:00Z',
  },
  {
    id: 'rev_4',
    product_id: 'prod_marathi_stories',
    user_id: 'user_vaishali',
    user_name: 'वैशाली गाडगीळ',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
    rating: 5,
    title: 'अतिशय हृदयस्पर्शी आणि प्रेरणादायी कथा!',
    comment:
      'तन्वी जोशी यांचे लेखन मनाला स्पर्शून जाते. सह्याद्रीच्या इतिहासाचे वर्णन सुंदर आहे. ई-बुक डाऊनलोड अगदी सहज आणि तत्काळ झाले.',
    verified_purchase: true,
    created_at: '2026-02-21T18:30:00Z',
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

The Indian creator economy has transitioned from social media vanity metrics to sovereign direct-to-consumer digital commerce. Today, individual authors, engineers, and teachers can package their specialized expertise into eBooks, templates, and courses.

## 1. Why the 10% Marketplace Model Wins
Traditional international platforms charge up to 30% plus heavy foreign currency conversion fees. CHAKRA introduces a transparent 10% marketplace commission, with 90% going straight to creators.

## 2. Choosing Your Product Format
* **eBooks & PDF Notes**: Highest conversion rate, immediate utility.
* **Design Systems & Templates**: High perceived value for businesses.
* **Online Video Kits & Code**: Premium pricing potential (₹1,500 – ₹5,000).

## 3. Safe Delivery with Tokenized Links
Never host paid files on open Google Drive links. Using cryptographic tokenized downloads ensures that only verified purchasers receive time-limited, limit-tracked downloads.
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
  {
    id: 'blog_2',
    slug: 'marathi-content-creators-digital-revolution',
    title: 'मराठी लेखकांसाठी डिजिटल क्रांती: स्वतःचे ई-पुस्तक कसे प्रकाशित करावे?',
    excerpt:
      'पारंपरिक प्रकाशकांच्या फेऱ्या न मारता स्वतःची पुस्तके, शैक्षणिक नोट्स आणि कथा थेट वाचकांपर्यंत पोहोचवा. संपूर्ण मराठी मार्गदर्शिका.',
    content: `
# मराठी लेखकांसाठी डिजिटल क्रांती

महाराष्ट्र ही संतांची, विचारवंतांची आणि दर्जेदार साहित्याची भूमी आहे. मात्र अनेक होतकरू लेखकांना पुस्तक छपाईचा खर्च आणि प्रकाशकांची रॉयल्टी मिळण्यात मोठ्या अडचणी येतात. 

## डिजिटल व्यासपीठाचे फायदे:
१. **शून्य छपाई खर्च**: पुस्तक पीडीएफ किंवा ई-पब स्वरूपात एकदाच तयार करा.
२. **थेट उत्पन्न**: विक्रीच्या ९०% रक्कम थेट तुमच्या भारतीय बँक खात्यात जमा होते.
३. **जागतिक वाचकवर्ग**: मुंबई, पुणे, नागपूरसह अमेरिका, लंडन आणि आखाती देशांतील मराठी वाचकही त्वरित खरेदी करू शकतात.
    `,
    category: 'साहित्य व लेखन',
    read_time_mins: 5,
    author: {
      name: 'तन्वी जोशी',
      role: 'साहित्यिक व सल्लागार',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop',
    },
    published_date: 'February 20, 2026',
    cover_image: '/images/product_ebook_guide_1790588355041.jpg',
    tags: ['मराठी', 'ई-बुक', 'स्वयं-प्रकाशन', 'कमाई'],
  },
  {
    id: 'blog_3',
    slug: 'ethical-affiliate-marketing-india',
    title: 'Ethical Affiliate Marketing: How Genuine Recommenders Earn 3-5%',
    excerpt:
      'Why spamming links fails, and how curated curation creates predictable passive income for community leaders, newsletter writers, and educators.',
    content: `
# Ethical Affiliate Marketing: Sustainable Commissions Without Spam

Affiliate marketing has suffered from spam schemes in the past. At CHAKRA, affiliate partnerships are rooted in verifiable value.

## The Mathematical Model
When an affiliate refers a buyer for a ₹500 product:
* Seller receives ₹450 (90%)
* Affiliate earns ₹15 (3% of product value, funded from marketplace fee)
* CHAKRA retains ₹35 to cover servers, Razorpay processing, and security

This ensures that the seller never loses more than the agreed 10% platform fee, while incentivizing advocates to recommend quality products.
    `,
    category: 'Affiliate Growth',
    read_time_mins: 4,
    author: {
      name: 'Priya Kulkarni',
      role: 'Product Architect',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop',
    },
    published_date: 'February 15, 2026',
    cover_image: '/images/product_course_design_1790588371629.jpg',
    tags: ['Affiliate', 'Commission', 'Transparency'],
  },
];

export const sampleUser: UserProfile = {
  id: 'usr_current_user',
  email: 'creator@chakra-marketplace.in',
  full_name: 'Devendra Kulkarni',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop',
  phone: '+91 98220 12345',
  roles: ['buyer', 'seller', 'affiliate', 'admin'],
  activeRole: 'buyer',
  bio: 'Digital creator, educator, and enthusiast of Indian typography and heritage arts.',
  created_at: '2026-01-01T00:00:00Z',
  seller_profile: {
    store_name: 'Chakra Sovereign Studio',
    store_slug: 'chakra-studio',
    store_description: 'Curated premium digital guides, design systems, and handcrafted artisan products.',
    store_banner: '/images/hero_marketplace_showcase_1790588339548.jpg',
    verified: true,
    verification_status: 'approved',
    payout_account: {
      account_holder_name: 'Devendra Kulkarni',
      bank_name: 'HDFC Bank',
      account_number: '•••• •••• 8912',
      ifsc_code: 'HDFC0001245',
      upi_id: 'devendra@okhdfcbank',
      pan_number: 'ABCDE1234F',
      kyc_approved: true,
    },
  },
  affiliate_profile: {
    affiliate_code: 'dev_growth_26',
    payment_upi: 'devendra@okhdfcbank',
    status: 'active',
    tier: 'gold',
  },
};
