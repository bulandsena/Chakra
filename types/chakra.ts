export type UserRole = 'buyer' | 'seller' | 'affiliate' | 'admin' | 'owner';

export type ProductCategory =
  | 'ebooks'
  | 'storybooks'
  | 'education'
  | 'templates'
  | 'courses'
  | 'software'
  | 'artisan_crafts'
  | 'physical_goods';

export type ProductType = 'digital' | 'physical';

export type ProductStatus = 'draft' | 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  roles: UserRole[];
  activeRole: UserRole;
  bio?: string;
  created_at: string;
  seller_profile?: {
    store_name: string;
    store_slug: string;
    store_description: string;
    store_banner?: string;
    verified: boolean;
    verification_status: 'none' | 'pending' | 'approved' | 'rejected';
    payout_account?: {
      account_holder_name: string;
      bank_name: string;
      account_number: string;
      ifsc_code: string;
      upi_id?: string;
      pan_number?: string;
      kyc_approved: boolean;
      razorpay_linked_account_id?: string;
      route_active?: boolean;
    };
  };
  affiliate_profile?: {
    affiliate_code: string;
    payment_upi?: string;
    status: 'active' | 'suspended';
    tier: 'standard' | 'silver' | 'gold';
  };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  price_paise: number; // Stored in integer paise (e.g. ₹1,000.00 is 100000)
  original_price_paise?: number;
  category: ProductCategory;
  product_type: ProductType;
  tags: string[];
  cover_image: string;
  gallery_images?: string[];
  preview_file_url?: string;
  digital_file_name?: string;
  digital_file_size_bytes?: number;
  digital_file_format?: string;
  download_limit: number;
  stock_quantity?: number;
  weight_grams?: number;
  seller_id: string;
  seller_name: string;
  seller_avatar?: string;
  rating: number;
  review_count: number;
  sales_count: number;
  status: ProductStatus;
  featured?: boolean;
  bestseller?: boolean;
  trending?: boolean;
  affiliate_eligible: boolean;
  custom_affiliate_rate_percent?: number;
  commission_override_percent?: number; // Optional product-specific override
  created_at: string;
  updated_at: string;
  sample_content_preview?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  affiliate_ref?: string;
}

export interface CommissionBreakdown {
  product_price_paise: number;
  platform_commission_rate_percent: number; // 20% fixed by default
  platform_gross_fee_paise: number; // 20%
  seller_share_percent: number; // 80%
  seller_gross_amount_paise: number; // 80%
  affiliate_commission_rate_percent: number;
  affiliate_fee_paise: number;
  estimated_payment_gateway_fee_paise: number; // ~2% + GST
  platform_net_fee_paise: number;
  seller_net_paise: number;
}

export interface OrderItem {
  product_id: string;
  title: string;
  product_type: ProductType;
  price_paise: number;
  quantity: number;
  cover_image: string;
  digital_file_name?: string;
  seller_id: string;
  seller_name: string;
  affiliate_code?: string;
  commission: CommissionBreakdown;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: OrderItem[];
  subtotal_paise: number;
  tax_paise: number;
  discount_paise: number;
  total_paise: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'razorpay' | 'stripe' | 'demo';
  payment_id: string;
  razorpay_order_id?: string;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  fulfillment_status?: 'not_applicable' | 'pending' | 'shipped' | 'delivered';
  tracking_number?: string;
  commission_percentage: number; // Snapshot of commission at order time
  created_at: string;
}

export interface CommissionRecord {
  id: string;
  order_id: string;
  order_number: string;
  product_id: string;
  product_title: string;
  seller_id: string;
  seller_name: string;
  gross_amount_paise: number;
  eligible_amount_paise: number;
  commission_percentage: number; // Stored fixed 20% snapshot
  owner_commission_paise: number; // 20%
  seller_amount_paise: number; // 80%
  affiliate_commission_paise: number;
  payment_gateway_fee_paise: number;
  net_marketplace_revenue_paise: number;
  payment_id: string;
  settlement_status: 'pending' | 'on_hold' | 'settled' | 'refunded';
  route_transfer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount_paise: number;
  currency: string;
  fee_paise: number;
  tax_paise: number;
  status: 'captured' | 'failed' | 'refunded';
  method: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  email: string;
  contact: string;
  captured_at: string;
  idempotency_key: string;
}

export interface SettlementRecord {
  id: string;
  settlement_id: string;
  amount_paise: number;
  fee_paise: number;
  tax_paise: number;
  net_amount_paise: number;
  status: 'settled' | 'pending' | 'failed';
  utr: string;
  bank_account_masked: string;
  created_at: string;
  settled_at: string;
}

export interface RefundRecord {
  id: string;
  payment_id: string;
  order_id: string;
  order_number: string;
  amount_paise: number;
  owner_deduction_paise: number;
  seller_deduction_paise: number;
  reason: string;
  status: 'processed' | 'pending' | 'failed';
  created_at: string;
}

export interface DownloadTicket {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  file_name: string;
  file_size_formatted: string;
  download_token: string;
  download_url: string;
  max_downloads: number;
  download_count: number;
  expires_at: string;
  created_at: string;
}

export interface AffiliateLink {
  id: string;
  affiliate_id: string;
  affiliate_code: string;
  product_id: string;
  product_title: string;
  target_url: string;
  clicks: number;
  conversions: number;
  pending_commission_paise: number;
  approved_earnings_paise: number;
  paid_earnings_paise: number;
  created_at: string;
}

export interface PayoutRecord {
  id: string;
  seller_id: string;
  seller_name: string;
  amount_paise: number;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'on_hold';
  payout_method: 'razorpay_route' | 'bank_transfer' | 'upi';
  destination_summary: string;
  linked_account_id?: string;
  reference_number?: string;
  requested_at: string;
  processed_at?: string;
  hold_reason?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  category: 'order' | 'download' | 'seller' | 'affiliate' | 'copyright' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }[];
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  read_time_mins: number;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  published_date: string;
  cover_image: string;
  tags: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'payout' | 'moderation' | 'affiliate' | 'system' | 'finance';
  read: boolean;
  created_at: string;
  link?: string;
}

export interface PlatformSettings {
  marketplace_name: string;
  tagline: string;
  default_commission_rate_percent: number; // FIXED 20%
  allow_commission_override: boolean; // Safe lock preventing accidental modification from 20%
  default_affiliate_rate_percent: number;
  category_commissions: Record<ProductCategory, number>;
  demo_mode_enabled: boolean;
  allow_seller_self_registration: boolean;
  require_product_moderation: boolean;
  cookie_attribution_days: number;
  minimum_payout_amount_paise: number;
  default_language: 'en' | 'mr' | 'hi';
  
  // Razorpay & Route settings
  razorpay_mid: string; // "ThQ32KbfQQu7Qy"
  razorpay_linked_account_id: string; // e.g. "acc_ThQ32KbfQQu7Qy"
  razorpay_route_enabled: boolean; // Only true when approved and activated
  razorpay_webhook_url: string;
  payment_mode_live: boolean;
  merchant_bank_summary: string;
}
