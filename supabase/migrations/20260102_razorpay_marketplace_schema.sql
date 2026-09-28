-- =============================================================================
-- CHAKRA Multi-Vendor Marketplace - Complete Razorpay Commission & Payouts Schema
-- Migration: 20260102_razorpay_marketplace_schema.sql
-- Tagline: "Create • Sell • Earn"
-- Architecture: Supabase PostgreSQL, Row Level Security, Integer Paise Minor-Unit Math
--
-- Explicit Required Tables:
-- 1. users (or profiles)
-- 2. sellers
-- 3. products
-- 4. orders
-- 5. order_items
-- 6. payments
-- 7. commissions
-- 8. seller_accounts
-- 9. payouts
-- 10. refunds
-- 11. webhook_events
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TYPE chakra_role_enum AS ENUM ('OWNER', 'ADMIN', 'SELLER', 'BUYER', 'AFFILIATE');

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    bio TEXT,
    roles chakra_role_enum[] DEFAULT ARRAY['BUYER'::chakra_role_enum],
    active_role chakra_role_enum DEFAULT 'BUYER'::chakra_role_enum,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 2. SELLERS TABLE
-- -----------------------------------------------------------------------------
CREATE TYPE seller_kyc_status_enum AS ENUM ('none', 'pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    store_name TEXT UNIQUE NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    store_description TEXT,
    store_logo_url TEXT,
    store_banner_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verification_status seller_kyc_status_enum DEFAULT 'pending',
    pan_number TEXT,
    gstin TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TYPE product_format_enum AS ENUM ('digital', 'physical');
CREATE TYPE product_state_enum AS ENUM ('draft', 'pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    price_paise BIGINT NOT NULL CHECK (price_paise >= 0), -- Minor units (e.g. ₹1,000 = 100000)
    category TEXT NOT NULL,                               -- 'ebooks', 'templates', 'courses', etc.
    product_type product_format_enum NOT NULL DEFAULT 'digital',
    tags TEXT[] DEFAULT '{}',
    cover_image TEXT NOT NULL,
    download_limit INT DEFAULT 5,
    status product_state_enum DEFAULT 'approved',
    affiliate_eligible BOOLEAN DEFAULT TRUE,
    custom_affiliate_rate_percent NUMERIC(5, 2) DEFAULT 3.00,
    commission_override_percent NUMERIC(5, 2),            -- Optional override from default 20%
    sales_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- -----------------------------------------------------------------------------
CREATE TYPE order_payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    subtotal_paise BIGINT NOT NULL,
    tax_paise BIGINT DEFAULT 0,
    discount_paise BIGINT DEFAULT 0,
    total_paise BIGINT NOT NULL,
    status order_payment_status DEFAULT 'pending',
    payment_method TEXT NOT NULL,                        -- 'razorpay', 'stripe', 'demo'
    payment_id TEXT UNIQUE,
    razorpay_order_id TEXT,
    commission_percentage NUMERIC(5, 2) NOT NULL DEFAULT 20.00, -- Snapshot of 20% commission at checkout
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 5. ORDER_ITEMS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    title TEXT NOT NULL,
    price_paise BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    platform_commission_paise BIGINT NOT NULL, -- 20%
    seller_share_paise BIGINT NOT NULL,        -- 80%
    affiliate_code TEXT,
    affiliate_commission_paise BIGINT DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 6. PAYMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id),
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    amount_paise BIGINT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    fee_paise BIGINT DEFAULT 0,
    tax_paise BIGINT DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'captured',
    method TEXT NOT NULL,
    bank TEXT,
    wallet TEXT,
    vpa TEXT,
    customer_email TEXT NOT NULL,
    idempotency_key TEXT UNIQUE NOT NULL,
    captured_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 7. COMMISSIONS TABLE (Strictly Matching Required Columns)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    gross_amount BIGINT NOT NULL,               -- in paise
    eligible_amount BIGINT NOT NULL,            -- in paise
    commission_percentage NUMERIC(5, 2) NOT NULL DEFAULT 20.00, -- FIXED 20% Snapshot
    owner_commission BIGINT NOT NULL,           -- in paise (20%)
    seller_amount BIGINT NOT NULL,              -- in paise (80%)
    payment_id TEXT NOT NULL,
    settlement_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'on_hold', 'settled', 'refunded'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_commissions_order_id ON public.commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_commissions_seller_id ON public.commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_commissions_payment_id ON public.commissions(payment_id);

-- -----------------------------------------------------------------------------
-- 8. SELLER_ACCOUNTS TABLE (Razorpay Route Linked Accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.seller_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID UNIQUE NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
    razorpay_linked_account_id TEXT, -- e.g. "acc_ThQ32KbfQQu7Qy"
    account_holder_name TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    account_number_masked TEXT NOT NULL,
    ifsc_code TEXT NOT NULL,
    upi_id TEXT,
    pan_number TEXT NOT NULL,
    route_active BOOLEAN DEFAULT FALSE,
    kyc_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 9. PAYOUTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.sellers(id),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'processing', 'completed', 'on_hold', 'rejected'
    payout_method TEXT NOT NULL,            -- 'razorpay_route', 'bank_transfer', 'upi'
    destination_summary TEXT NOT NULL,
    linked_account_id TEXT,
    reference_number TEXT,
    hold_reason TEXT,
    requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 10. REFUNDS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id TEXT NOT NULL,
    order_id UUID NOT NULL REFERENCES public.orders(id),
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    owner_deduction_paise BIGINT NOT NULL,  -- 20% platform reversal
    seller_deduction_paise BIGINT NOT NULL, -- 80% seller share reversal
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed',
    razorpay_refund_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- -----------------------------------------------------------------------------
-- 11. WEBHOOK_EVENTS TABLE (Idempotency Protection)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'processed',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_id ON public.webhook_events(event_id);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Commissions: Sellers strictly access only their own rows
CREATE POLICY "Sellers can view own commissions" ON public.commissions
    FOR SELECT USING (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

-- Payouts: Sellers can view and request their own payouts
CREATE POLICY "Sellers can view own payouts" ON public.payouts
    FOR SELECT USING (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

CREATE POLICY "Sellers can request own payouts" ON public.payouts
    FOR INSERT WITH CHECK (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

-- Orders: Users view own placed orders
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (user_id = auth.uid());
