import { calculateCommission, paiseToRupees, rupeesToPaise } from './commission';

export interface TestCaseResult {
  name: string;
  passed: boolean;
  expected: {
    sellerRupees: number;
    affiliateRupees: number;
    platformRupees: number;
  };
  actual: {
    sellerRupees: number;
    affiliateRupees: number;
    platformRupees: number;
  };
  details: string;
}

export function runCommissionTests(): {
  allPassed: boolean;
  results: TestCaseResult[];
} {
  const results: TestCaseResult[] = [];

  // Test 1: Exact specification from prompt: ₹500 product, 10% marketplace, 3% affiliate
  {
    const pricePaise = rupeesToPaise(500); // 50000 paise
    const comm = calculateCommission({
      productPricePaise: pricePaise,
      platformCommissionRatePercent: 10,
      affiliateCommissionRatePercent: 3,
      hasAffiliate: true,
    });

    const sellerRupees = paiseToRupees(comm.seller_net_paise);
    const affiliateRupees = paiseToRupees(comm.affiliate_fee_paise);
    const platformRupees = paiseToRupees(comm.platform_net_fee_paise);

    const passed =
      sellerRupees === 450 &&
      affiliateRupees === 15 &&
      platformRupees === 35 &&
      comm.seller_net_paise + comm.affiliate_fee_paise + comm.platform_net_fee_paise === pricePaise;

    results.push({
      name: '₹500 Product with 10% platform fee and 3% affiliate attribution',
      passed,
      expected: { sellerRupees: 450, affiliateRupees: 15, platformRupees: 35 },
      actual: { sellerRupees, affiliateRupees, platformRupees },
      details: 'Seller gets ₹450, Affiliate ₹15, Platform retains net ₹35',
    });
  }

  // Test 2: Standard organic sale without affiliate: ₹1,000 product, 10% platform
  {
    const pricePaise = rupeesToPaise(1000);
    const comm = calculateCommission({
      productPricePaise: pricePaise,
      platformCommissionRatePercent: 10,
      affiliateCommissionRatePercent: 3,
      hasAffiliate: false,
    });

    const sellerRupees = paiseToRupees(comm.seller_net_paise);
    const affiliateRupees = paiseToRupees(comm.affiliate_fee_paise);
    const platformRupees = paiseToRupees(comm.platform_net_fee_paise);

    const passed =
      sellerRupees === 900 &&
      affiliateRupees === 0 &&
      platformRupees === 100 &&
      comm.seller_net_paise + comm.affiliate_fee_paise + comm.platform_net_fee_paise === pricePaise;

    results.push({
      name: '₹1,000 Direct Sale (No Affiliate)',
      passed,
      expected: { sellerRupees: 900, affiliateRupees: 0, platformRupees: 100 },
      actual: { sellerRupees, affiliateRupees, platformRupees },
      details: 'Seller receives ₹900, Marketplace receives full ₹100',
    });
  }

  // Test 3: Fractional paise edge-case check: ₹199 product (19900 paise)
  {
    const pricePaise = rupeesToPaise(199);
    const comm = calculateCommission({
      productPricePaise: pricePaise,
      platformCommissionRatePercent: 10,
      affiliateCommissionRatePercent: 3,
      hasAffiliate: true,
    });

    const passed =
      comm.seller_net_paise + comm.affiliate_fee_paise + comm.platform_net_fee_paise === pricePaise;

    results.push({
      name: '₹199 Invariant Conservation Test (No lost fractions)',
      passed,
      expected: { sellerRupees: 179.1, affiliateRupees: 5.97, platformRupees: 13.93 },
      actual: {
        sellerRupees: paiseToRupees(comm.seller_net_paise),
        affiliateRupees: paiseToRupees(comm.affiliate_fee_paise),
        platformRupees: paiseToRupees(comm.platform_net_fee_paise),
      },
      details: 'Exact conservation: seller + affiliate + platform === total paise',
    });
  }

  return {
    allPassed: results.every((r) => r.passed),
    results,
  };
}
