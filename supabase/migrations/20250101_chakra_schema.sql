-- =============================================================================
-- CHAKRA Multi-Vendor Marketplace - PostgreSQL Schema with Row Level Security (RLS)
-- Tagline: "Create • Sell • Earn"
-- Architecture: Supabase PostgreSQL, Auth, Private Storage & Webhook Auditing
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. PROFILES & ROLES
-- -----------------------------------------------------------------------------
CREATE TYPE user_role_enum AS ENUM ('buyer', 'seller', 'affiliate', 'admin');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    roles user_role_enum[] DEFAULT ARRAY['buyer'::user_role_enum],
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. SELLERS & VERIFICATION
-- -----------------------------------------------------------------------------
CREATE TYPE verification_status_enum AS ENUM ('none', 'pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    store_name TEXT UNIQUE NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_description TEXT,
    store_logo_url TEXT,
    store_banner_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verification_status verification_status_enum DEFAULT 'pending',
    pan_number TEXT,
    gstin TEXT,
    bank_account_number TEXT,
    bank_ifsc_code TEXT,
    bank_account_holder TEXT,
    upi_id TEXT,
    kyc_document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    commission_rate_percent NUMERIC(5,2) DEFAULT 10.00,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. PRODUCTS & FILES
-- -----------------------------------------------------------------------------
CREATE TYPE product_type_enum AS ENUM ('digital', 'physical');
CREATE TYPE product_status_enum AS ENUM ('draft', 'pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0), -- Stored in minor integer units (paise)
    original_price_paise BIGINT CHECK (original_price_paise >= price_paise),
    category_id TEXT NOT NULL REFERENCES public.categories(id),
    product_type product_type_enum NOT NULL DEFAULT 'digital',
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    preview_file_url TEXT,
    stock_quantity INT DEFAULT 0,
    weight_grams INT DEFAULT 0,
    download_limit INT DEFAULT 5,
    status product_status_enum DEFAULT 'pending',
    featured BOOLEAN DEFAULT FALSE,
    affiliate_eligible BOOLEAN DEFAULT TRUE,
    custom_affiliate_rate_percent NUMERIC(5,2) DEFAULT 3.00,
    sales_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL, -- Private Supabase Storage bucket path
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    file_format TEXT NOT NULL,
    is_preview BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. ORDERS & ORDER ITEMS
-- -----------------------------------------------------------------------------
CREATE TYPE order_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    subtotal_paise BIGINT NOT NULL,
    tax_paise BIGINT DEFAULT 0,
    discount_paise BIGINT DEFAULT 0,
    total_paise BIGINT NOT NULL,
    status order_status_enum DEFAULT 'pending',
    payment_method TEXT NOT NULL,
    payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    shipping_street TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    shipping_pincode TEXT,
    fulfillment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    price_paise BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    platform_commission_paise BIGINT NOT NULL,
    affiliate_commission_paise BIGINT DEFAULT 0,
    seller_net_paise BIGINT NOT NULL,
    affiliate_code TEXT
);

-- -----------------------------------------------------------------------------
-- 6. DOWNLOAD TICKETS (SECURE TIME-LIMITED TOKENS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    download_token TEXT UNIQUE NOT NULL,
    max_downloads INT DEFAULT 5,
    download_count INT DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. COMMISSIONS & AFFILIATES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    affiliate_code TEXT UNIQUE NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    pending_commission_paise BIGINT DEFAULT 0,
    paid_earnings_paise BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_code TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id),
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 8. PAYOUTS
-- -----------------------------------------------------------------------------
CREATE TYPE payout_status_enum AS ENUM ('pending', 'approved', 'processing', 'completed', 'rejected');

CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status payout_status_enum DEFAULT 'pending',
    payout_method TEXT NOT NULL,
    destination_summary TEXT NOT NULL,
    reference_number TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. AUDIT LOGS & SYSTEM SETTINGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    performed_by UUID REFERENCES public.profiles(id),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read their own profile; public can read basic creator metadata
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can view approved products; sellers can edit their own
CREATE POLICY "Approved products are viewable by anyone" ON public.products
    FOR SELECT USING (status = 'approved' OR seller_id IN (
        SELECT id FROM public.sellers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Sellers can manage their own products" ON public.products
    FOR ALL USING (seller_id IN (
        SELECT id FROM public.sellers WHERE user_id = auth.uid()
    ));

-- Downloads: Only verified purchasers can view their own tokens
CREATE POLICY "Purchasers can access their own download tokens" ON public.downloads
    FOR SELECT USING (user_id = auth.uid());

-- Orders: Users can view their own placed orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid());
