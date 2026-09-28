# CHAKRA — Create • Sell • Earn
> **The Sovereign Multi-Vendor Marketplace for Digital Products, eBooks & Artisan Goods**  
> *"Create • Sell • Earn (निर्मिती करा • विक्री करा • कमवा • सृजन करें • बेचें • कमाएं)"*

CHAKRA is an end-to-end, production-ready multi-vendor digital commerce platform inspired by Gumroad, Etsy, and creator-first marketplaces, architected specifically for independent authors, educators, software engineers, designers, and traditional artisans.

---

## 🌟 Brand & Aesthetics
- **Name:** CHAKRA
- **Tagline:** Create • Sell • Earn
- **Primary Color Palette:**
  - Deep Forest Green: `#132C28`
  - Sovereign Gold: `#D8AD60`
  - Ivory Cream: `#F6F0E4`
  - Clean Surface White & Dark Slate Canvas
- **Logo:** Sacred circular CHAKRA emblem featuring 8 radiating illumination spokes, diamond energy points, and central golden hub.
- **Modes:** Full Dark and Light theme support with seamless transition.
- **Internationalization:** Instant switcher for **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)**.

---

## 🏗 Full Project Architecture & Folder Tree
```
chakra-marketplace/
├── app/
│   ├── api/
│   │   ├── create-order/route.ts      # Server-side Razorpay order generation
│   │   ├── verify-payment/route.ts    # HMAC-SHA256 signature verification
│   │   └── download/route.ts          # Cryptographic tokenized file streaming
│   ├── globals.css                    # Tailwind CSS v4 brand tokens & scrollbars
│   ├── layout.tsx                     # Root Layout, SEO metadata, JSON-LD schema
│   └── page.tsx                       # Full interactive multi-view router
├── components/
│   ├── common/
│   │   ├── ChakraLogo.tsx             # Intricate circular SVG logo
│   │   └── AboutAndContactView.tsx    # Mission statement & support form
│   ├── layout/
│   │   ├── Navbar.tsx                 # Top Bar Contract (3 zones, unboxed links)
│   │   ├── Footer.tsx                 # Full category links & trust badges
│   │   └── NotificationToast.tsx      # Real-time transaction toast
│   ├── home/
│   │   ├── HeroSection.tsx            # Hero showcase, search bar & proof metrics
│   │   ├── CategoryGrid.tsx           # 8 curated category cards
│   │   ├── FeaturedShowcase.tsx       # Segmented filters & product grid
│   │   └── CommissionExplainer.tsx    # Transparent 90-10% model breakdown
│   ├── products/
│   │   ├── ProductCard.tsx            # 65% image prominence, unboxed metadata
│   │   ├── ProductDetailView.tsx      # Contiguous purchase module & reviews
│   │   └── ExploreCatalogView.tsx     # Full catalog search, sort & filters
│   ├── cart/
│   │   └── CartDrawer.tsx             # Slide-over shopping bag with steppers
│   ├── checkout/
│   │   └── CheckoutModal.tsx          # Razorpay & Demo simulation checkout
│   ├── downloads/
│   │   └── DownloadLibraryView.tsx    # Encrypted token vault & limits tracker
│   ├── seller/
│   │   ├── SellerDashboardView.tsx    # GMV, product publishing, payouts
│   │   ├── SellerStorefrontView.tsx   # Public creator storefront & catalog
│   │   └── BecomeSellerView.tsx       # 5-minute creator onboarding
│   ├── admin/
│   │   └── AdminDashboardView.tsx     # Product moderation, rates & unit tests
│   ├── affiliate/
│   │   └── AffiliatePortalView.tsx    # Referral link generator & clicks tracking
│   ├── pricing/
│   │   └── PricingCalculatorView.tsx  # Live minor-unit interactive calculator
│   ├── guides/
│   │   └── MarathiGuideView.tsx       # In-app Marathi beginner guide
│   ├── blog/
│   │   └── BlogView.tsx               # Creator playbooks & SEO articles
│   └── legal/
│       └── LegalPagesView.tsx         # Terms, Privacy, Refund, Copyright, FAQ
├── context/
│   └── ChakraContext.tsx              # React Context with persistence & test roles
├── docs/
│   └── MARATHI_BEGINNER_GUIDE.md      # Standalone 16-step Marathi guide
├── lib/
│   ├── commission.ts                  # Integer minor-unit (paise) math
│   ├── commission.test.ts             # Unit test suite verifying exact prompt cases
│   ├── translations.ts                # English, Marathi, and Hindi dictionaries
│   └── sampleData.ts                  # Rich catalog of eBooks, courses, crafts
├── netlify/
│   └── functions/
│       ├── create-order.ts            # Netlify Serverless order endpoint
│       ├── verify-payment.ts          # Netlify Serverless signature verification
│       └── download-file.ts           # Netlify Serverless private storage bridge
├── public/
│   └── images/                        # Generated high-resolution product assets
├── supabase/
│   ├── migrations/
│   │   └── 20250101_chakra_schema.sql # 25+ Tables with RLS & functions
│   └── seed.sql                       # Initial categories & first admin script
├── netlify.toml                       # Build settings, redirects & security headers
├── .env.example                       # Documented client vs server secrets
└── package.json                       # Core dependencies
```

---

## 💰 The Commission Math Model (Minor Units / Paise)
All currency calculations are strictly executed in integer minor units (paise) to eliminate floating-point leakage.

### Benchmark Example: ₹500 Product (50,000 Paise)
- **Marketplace Commission:** 10% gross = ₹50 (5,000 paise)
- **Affiliate Commission:** 3% = ₹15 (1,500 paise) paid *from the marketplace cut*
- **Seller Net Take-Home:** ₹450 (45,000 paise) — 90% direct payout
- **Affiliate Promoter:** ₹15 (1,500 paise)
- **CHAKRA Marketplace:** ₹35 (3,500 paise) — 7% net operating share
- **Conservation Check:** $450 + 15 + 35 = ₹500.00$ Exact.

Automated unit tests can be executed directly inside the **Admin Console** or via `npm test`.

---

## 🚀 Quick Start (Local Development)
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Netlify Deployment Guide
1. Push this repository to GitHub.
2. Log in to [Netlify](https://netlify.com) and click **"Add new site" -> "Import from GitHub"**.
3. Settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `.next`
   - **Functions Directory:** `netlify/functions`
4. Add environment variables in Netlify UI from `.env.example`.
5. Click **"Deploy site"**. Your marketplace will be live in ~2 minutes with automatic SSL!

---

## 📖 Marathi Guide (मराठी संपूर्ण मार्गदर्शिका)
नवशिक्यांसाठी सोप्या भाषेतील संपूर्ण १६ पायऱ्यांचे मार्गदर्शक वाचण्यासाठी:
- ऍप्लिकेशनमधील **"मराठी सेटअप गाइड"** टॅब उघडा, किंवा
- `/docs/MARATHI_BEGINNER_GUIDE.md` फाइल पहा.
