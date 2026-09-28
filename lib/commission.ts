import { CommissionBreakdown, ProductCategory } from '@/types/chakra';

/**
 * Calculates marketplace commissions using integer minor units (paise)
 * to strictly prevent IEEE 754 floating-point rounding errors.
 *
 * SPECIFICATION:
 * - Default CHAKRA Owner Commission: FIXED 20%
 * - Seller Gross Share: 80%
 *
 * Benchmark Scenario:
 * Product price = ₹1,000 (100,000 paise) with 20% platform commission:
 * - CHAKRA platform cut (20%) = ₹200 (20,000 paise)
 * - Seller gross share (80%) = ₹800 (80,000 paise)
 * - Estimated Payment gateway fee (~2% + 18% GST = 2.36%): ₹23.60 (2,360 paise)
 *
 * IMPORTANT FINANCIAL RULE:
 * "CHAKRA commission: 20% before applicable payment gateway charges, taxes,
 * refunds, chargebacks and other applicable adjustments."
 * Never present gross platform commission as pure guaranteed bank profit.
 */
export function calculateCommission({
  productPricePaise,
  platformCommissionRatePercent = 20, // FIXED 20% DEFAULT
  affiliateCommissionRatePercent = 3,
  hasAffiliate = false,
}: {
  productPricePaise: number;
  platformCommissionRatePercent?: number;
  affiliateCommissionRatePercent?: number;
  hasAffiliate?: boolean;
}): CommissionBreakdown {
  if (productPricePaise < 0) {
    throw new Error('Product price cannot be negative');
  }

  const sellerSharePercent = Math.max(0, 100 - platformCommissionRatePercent);

  // Integer math: calculate platform gross cut in paise (20%)
  const platformGrossFeePaise = Math.round(
    (productPricePaise * platformCommissionRatePercent) / 100
  );

  // Seller receives remaining share (80%) before gateway deductions
  const sellerGrossAmountPaise = productPricePaise - platformGrossFeePaise;

  // Estimated standard Razorpay gateway processing fee (~2% + 18% GST = 2.36%)
  const estimatedGatewayFeePaise = Math.round((productPricePaise * 236) / 10000);

  // Affiliate fee is paid from marketplace's share if eligible affiliate referred the sale
  const effectiveAffiliateRate = hasAffiliate ? affiliateCommissionRatePercent : 0;
  const affiliateFeePaise = hasAffiliate
    ? Math.min(
        Math.round((productPricePaise * effectiveAffiliateRate) / 100),
        platformGrossFeePaise
      )
    : 0;

  // Platform net fee after affiliate deduction
  const platformNetFeePaise = Math.max(0, platformGrossFeePaise - affiliateFeePaise);
  const sellerNetPaise = sellerGrossAmountPaise;

  // Invariant verification: seller_gross + platform_gross must equal product_price
  const sumCheck = sellerGrossAmountPaise + platformGrossFeePaise;
  const diff = productPricePaise - sumCheck;

  return {
    product_price_paise: productPricePaise,
    platform_commission_rate_percent: platformCommissionRatePercent,
    platform_gross_fee_paise: platformGrossFeePaise + diff,
    seller_share_percent: sellerSharePercent,
    seller_gross_amount_paise: sellerGrossAmountPaise,
    affiliate_commission_rate_percent: effectiveAffiliateRate,
    affiliate_fee_paise: affiliateFeePaise,
    estimated_payment_gateway_fee_paise: estimatedGatewayFeePaise,
    platform_net_fee_paise: platformNetFeePaise + diff,
    seller_net_paise: sellerNetPaise,
  };
}

/**
 * Format INR paise into human-friendly currency string (e.g. ₹1,000 or ₹1,000.50)
 */
export function formatINR(paise: number, showDecimalsIfZero = false): string {
  const rupees = paise / 100;
  if (rupees % 1 === 0 && !showDecimalsIfZero) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(rupees);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

/**
 * Convert rupees to integer paise
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Convert integer paise to rupees
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}
