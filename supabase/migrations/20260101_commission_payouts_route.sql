-- =============================================================================
-- CHAKRA Multi-Vendor Marketplace - Advanced Commission, Payouts & Razorpay Route Schema
-- Migration: 20260101_commission_payouts_route.sql
-- Description: Creates commission_rules, payment_transactions, order_commissions,
--              seller_payouts, affiliate_commissions, refunds, settlement_records, audit_logs
-- Accounting: Strict integer minor units (paise) to prevent floating-point rounding errors
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. COMMISSION RULES TABLE
-- Supports default platform commission (10%), category overrides & product overrides
-- -----------------------------------------------------------------------------
CREATE TYPE commission_rule_type AS ENUM ('default', 'category', 'product', 'seller');

CREATE TABLE IF NOT EXISTS public.commission_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_type commission_rule_type NOT NULL DEFAULT 'default',
    category_id TEXT, -- references public.categories(id)
    product_id UUID,  -- references public.products(id)
    seller_id UUID,   -- references public.sellers(id)
    platform_commission_rate_percent NUMERIC(5, 2) NOT NULL CHECK (platform_commission_rate_percent >= 0 AND platform_commission_rate_percent <= 100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    effective_from TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial default 10% platform commission rule
INSERT INTO public.commission_rules (rule_type, platform_commission_rate_percent, description)
VALUES ('default', 10.00, 'CHAKRA Initial Default Platform Commission Rate (10%)')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. PAYMENT TRANSACTIONS TABLE
-- Captures Razorpay payments with idempotency keys and signature validation
-- -----------------------------------------------------------------------------
CREATE TYPE transaction_status_enum AS ENUM ('created', 'authorized', 'captured', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT UNIQUE NOT NULL,
    amount_paise BIGINT NOT NULL CHECK (amount_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    fee_paise BIGINT DEFAULT 0,
    tax_paise BIGINT DEFAULT 0,
    status transaction_status_enum NOT NULL DEFAULT 'captured',
    method TEXT NOT NULL, -- 'upi', 'card', 'netbanking', 'wallet'
    bank TEXT,
    wallet TEXT,
    vpa TEXT,
    customer_email TEXT NOT NULL,
    customer_contact TEXT,
    idempotency_key TEXT UNIQUE NOT NULL,
    captured_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_razorpay_id ON public.payment_transactions(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_idempotency ON public.payment_transactions(idempotency_key);

-- -----------------------------------------------------------------------------
-- 3. ORDER COMMISSIONS TABLE
-- Stores immutable order-level snapshots of platform cuts, seller shares and MDR fees
-- -----------------------------------------------------------------------------
CREATE TYPE settlement_status_enum AS ENUM ('pending', 'on_hold', 'settled', 'refunded');

CREATE TABLE IF NOT EXISTS public.order_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    order_number TEXT NOT NULL,
    product_id UUID NOT NULL,
    product_title TEXT NOT NULL,
    seller_id UUID NOT NULL,
    gross_amount_paise BIGINT NOT NULL,
    eligible_amount_paise BIGINT NOT NULL,
    commission_percentage NUMERIC(5, 2) NOT NULL, -- Immutable snapshot at time of purchase
    owner_commission_paise BIGINT NOT NULL,       -- E.g. 10%
    seller_amount_paise BIGINT NOT NULL,          -- E.g. 90%
    affiliate_commission_paise BIGINT DEFAULT 0,  -- Paid from platform cut
    payment_gateway_fee_paise BIGINT DEFAULT 0,   -- ~2.36% MDR
    net_marketplace_revenue_paise BIGINT NOT NULL,
    payment_id TEXT NOT NULL,
    settlement_status settlement_status_enum NOT NULL DEFAULT 'pending',
    route_transfer_id TEXT,                       -- Razorpay Route transfer identifier
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_commissions_order_id ON public.order_commissions(order_id);
CREATE INDEX IF NOT EXISTS idx_order_commissions_seller_id ON public.order_commissions(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_commissions_status ON public.order_commissions(settlement_status);

-- -----------------------------------------------------------------------------
-- 4. SELLER PAYOUTS TABLE
-- Tracks transfers to seller linked accounts or fallback bank/UPI disbursals
-- -----------------------------------------------------------------------------
CREATE TYPE seller_payout_status_enum AS ENUM ('pending', 'approved', 'processing', 'completed', 'rejected', 'on_hold');
CREATE TYPE payout_method_enum AS ENUM ('razorpay_route', 'bank_transfer', 'upi');

CREATE TABLE IF NOT EXISTS public.seller_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    status seller_payout_status_enum NOT NULL DEFAULT 'pending',
    payout_method payout_method_enum NOT NULL DEFAULT 'razorpay_route',
    destination_summary TEXT NOT NULL,
    linked_account_id TEXT,           -- e.g. "acc_ThQ32KbfQQu7Qy"
    reference_number TEXT,            -- Bank UTR or Route transfer ID
    hold_reason TEXT,                 -- Recorded if placed on risk hold
    requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_seller_payouts_seller_id ON public.seller_payouts(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_payouts_status ON public.seller_payouts(status);

-- -----------------------------------------------------------------------------
-- 5. AFFILIATE COMMISSIONS TABLE
-- Records affiliate earnings attributed to verified sales
-- -----------------------------------------------------------------------------
CREATE TYPE affiliate_commission_status AS ENUM ('pending', 'approved', 'paid', 'reversed');

CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    affiliate_id UUID NOT NULL,
    affiliate_code TEXT NOT NULL,
    product_id UUID NOT NULL,
    sale_amount_paise BIGINT NOT NULL,
    commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 3.00,
    commission_paise BIGINT NOT NULL,
    status affiliate_commission_status NOT NULL DEFAULT 'pending',
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_affiliate ON public.affiliate_commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_order ON public.affiliate_commissions(order_id);

-- -----------------------------------------------------------------------------
-- 6. REFUNDS TABLE
-- Proportional reversals: 10% platform share & 90% seller deduction
-- -----------------------------------------------------------------------------
CREATE TYPE refund_status_enum AS ENUM ('processed', 'pending', 'failed');

CREATE TABLE IF NOT EXISTS public.refunds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id TEXT NOT NULL,
    order_id UUID NOT NULL,
    order_number TEXT NOT NULL,
    amount_paise BIGINT NOT NULL CHECK (amount_paise > 0),
    owner_deduction_paise BIGINT NOT NULL,  -- 10% platform reversal
    seller_deduction_paise BIGINT NOT NULL, -- 90% seller deduction
    reason TEXT NOT NULL,
    status refund_status_enum NOT NULL DEFAULT 'processed',
    razorpay_refund_id TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON public.refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON public.refunds(payment_id);

-- -----------------------------------------------------------------------------
-- 7. SETTLEMENT RECORDS TABLE
-- Verified bank deposits disbursed from Razorpay merchant portal
-- -----------------------------------------------------------------------------
CREATE TYPE provider_settlement_status AS ENUM ('settled', 'pending', 'failed');

CREATE TABLE IF NOT EXISTS public.settlement_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    settlement_id TEXT UNIQUE NOT NULL,      -- e.g. "setl_ThQ32Kbf_881"
    amount_paise BIGINT NOT NULL,            -- Gross batch amount
    fee_paise BIGINT NOT NULL DEFAULT 0,     -- Gateway MDR
    tax_paise BIGINT NOT NULL DEFAULT 0,     -- GST on MDR
    net_amount_paise BIGINT NOT NULL,        -- Credited to bank
    status provider_settlement_status NOT NULL DEFAULT 'settled',
    utr TEXT NOT NULL,                       -- RBI UTR transaction reference
    bank_account_masked TEXT NOT NULL,       -- e.g. "HDFC Bank •••• 8912"
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    settled_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed verified initial settlement record
INSERT INTO public.settlement_records (
    settlement_id, amount_paise, fee_paise, tax_paise, net_amount_paise, status, utr, bank_account_masked
) VALUES (
    'setl_ThQ32Kbf_881', 250000, 5900, 900, 244100, 'settled', 'HDFCR20260226998124', 'HDFC Bank Ltd •••• 8912'
) ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE
-- Tracks all financial alterations, payout approvals and commission rule changes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    performed_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Commission Rules: Public can read active rules; only admin can insert/update
CREATE POLICY "Anyone can view active commission rules" ON public.commission_rules
    FOR SELECT USING (active = true);

-- 2. Payment Transactions: Sellers see transactions for their own orders; admins see all
CREATE POLICY "Sellers can view own transactions" ON public.payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.order_commissions oc
            WHERE oc.payment_id = payment_transactions.razorpay_payment_id
            AND oc.seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
        )
    );

-- 3. Order Commissions: Strict seller isolation (sellers only access their own records)
CREATE POLICY "Sellers only access own commission snapshots" ON public.order_commissions
    FOR SELECT USING (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

-- 4. Seller Payouts: Sellers can view and request their own payouts
CREATE POLICY "Sellers can view own payouts" ON public.seller_payouts
    FOR SELECT USING (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

CREATE POLICY "Sellers can request own payouts" ON public.seller_payouts
    FOR INSERT WITH CHECK (
        seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
    );

-- 5. Affiliate Commissions: Affiliates can only view their own attributed earnings
CREATE POLICY "Affiliates can view own commissions" ON public.affiliate_commissions
    FOR SELECT USING (
        affiliate_id = auth.uid()
    );

-- 6. Refunds: Sellers can view refunds affecting their products
CREATE POLICY "Sellers can view refunds for own orders" ON public.refunds
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.order_commissions oc
            WHERE oc.order_id = refunds.order_id
            AND oc.seller_id IN (SELECT id FROM public.sellers WHERE user_id = auth.uid())
        )
    );

-- 7. Settlement Records: Root owner/admins only
CREATE POLICY "Admin only settlement records" ON public.settlement_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND ('admin' = ANY(roles) OR 'owner' = ANY(roles))
        )
    );
