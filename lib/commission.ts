import { CommissionBreakdown } from '@/types/chakra';

/**
 * Calculates marketplace commissions using integer minor units (paise)
 * to strictly prevent IEEE 754 floating-point rounding errors.
 *
 * Example given in prompt:
 * ₹500 product (50000 paise):
 * - Marketplace commission: 10% = ₹50 (5000 paise) gross
 * - Affiliate commission: 3% = ₹15 (1500 paise) paid from marketplace's share
 * - Seller net: ₹450 (45000 paise)
 * - Affiliate net: ₹15 (1500 paise)
 * - Marketplace net: ₹35 (3500 paise)
 *
 * Invariant: seller_net + affiliate_fee + platform_net === product_price
 */
export function calculateCommission({
  productPricePaise,
  platformCommissionRatePercent = 10,
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

  // Integer math: calculate platform gross cut in paise
  const platformGrossFeePaise = Math.round(
    (productPricePaise * platformCommissionRatePercent) / 100
  );

  // Seller receives full price minus platform gross fee
  const sellerNetPaise = productPricePaise - platformGrossFeePaise;

  // Affiliate fee is paid from marketplace's share if eligible affiliate referred the sale
  const effectiveAffiliateRate = hasAffiliate ? affiliateCommissionRatePercent : 0;
  const affiliateFeePaise = hasAffiliate
    ? Math.min(
        Math.round((productPricePaise * effectiveAffiliateRate) / 100),
        platformGrossFeePaise // Cannot exceed platform gross fee
      )
    : 0;

  // Platform retains gross fee minus affiliate payout
  const platformNetFeePaise = platformGrossFeePaise - affiliateFeePaise;

  // Invariant verification
  const totalCheck = sellerNetPaise + affiliateFeePaise + platformNetFeePaise;
  if (totalCheck !== productPricePaise) {
    // Reconcile any 1-paise rounding edge case onto platform net
    const diff = productPricePaise - totalCheck;
    return {
      product_price_paise: productPricePaise,
      platform_commission_rate_percent: platformCommissionRatePercent,
      platform_gross_fee_paise: platformGrossFeePaise,
      affiliate_commission_rate_percent: effectiveAffiliateRate,
      affiliate_fee_paise: affiliateFeePaise,
      platform_net_fee_paise: platformNetFeePaise + diff,
      seller_net_paise: sellerNetPaise,
    };
  }

  return {
    product_price_paise: productPricePaise,
    platform_commission_rate_percent: platformCommissionRatePercent,
    platform_gross_fee_paise: platformGrossFeePaise,
    affiliate_commission_rate_percent: effectiveAffiliateRate,
    affiliate_fee_paise: affiliateFeePaise,
    platform_net_fee_paise: platformNetFeePaise,
    seller_net_paise: sellerNetPaise,
  };
}

/**
 * Format INR paise into human-friendly currency string (e.g. ₹500 or ₹500.50)
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
