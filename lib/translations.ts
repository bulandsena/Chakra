export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  tagline: string;
  nav: {
    home: string;
    explore: string;
    digital: string;
    physical: string;
    ebooks: string;
    storybooks: string;
    education: string;
    templates: string;
    courses: string;
    becomeSeller: string;
    affiliate: string;
    pricing: string;
    blog: string;
    help: string;
    marathiGuide: string;
    cart: string;
    signIn: string;
    dashboard: string;
    admin: string;
    downloads: string;
    orders: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlineHighlight: string;
    subheadline: string;
    ctaExplore: string;
    ctaStartSelling: string;
    searchPlaceholder: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    stat3: string;
    stat3Label: string;
  };
  categories: {
    title: string;
    subtitle: string;
    all: string;
    ebooks: string;
    storybooks: string;
    education: string;
    templates: string;
    courses: string;
    software: string;
    artisan_crafts: string;
    physical_goods: string;
  };
  product: {
    digitalInstant: string;
    physicalItem: string;
    addToCart: string;
    buyNow: string;
    downloadSample: string;
    secureDownload: string;
    downloadsRemaining: string;
    by: string;
    reviews: string;
    ratings: string;
    affiliateShare: string;
    generateRefLink: string;
    copyLink: string;
    linkCopied: string;
    inStock: string;
    outOfStock: string;
    verifiedSeller: string;
  };
  checkout: {
    cartTitle: string;
    emptyCart: string;
    subtotal: string;
    tax: string;
    total: string;
    proceedToCheckout: string;
    secureCheckoutTitle: string;
    customerInfo: string;
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    paymentMode: string;
    demoModeNotice: string;
    payWithRazorpay: string;
    payDemo: string;
    processingPayment: string;
    orderSuccessTitle: string;
    orderSuccessDesc: string;
    viewDownloads: string;
  };
  seller: {
    dashboardTitle: string;
    totalSales: string;
    grossRevenue: string;
    platformFeePaid: string;
    netEarnings: string;
    payoutAvailable: string;
    requestPayout: string;
    myProducts: string;
    addNewProduct: string;
    storeSettings: string;
    payoutSettings: string;
  };
  affiliate: {
    portalTitle: string;
    tagline: string;
    totalClicks: string;
    validConversions: string;
    pendingEarnings: string;
    approvedEarnings: string;
    paidEarnings: string;
    yourRefLink: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    tagline: 'Create • Sell • Earn',
    nav: {
      home: 'Home',
      explore: 'Explore',
      digital: 'Digital Goods',
      physical: 'Physical Crafts',
      ebooks: 'eBooks & PDFs',
      storybooks: 'Story Books',
      education: 'Educational Notes',
      templates: 'Templates & UI',
      courses: 'Online Courses',
      becomeSeller: 'Start Selling',
      affiliate: 'Affiliate Program',
      pricing: 'Pricing & Commission',
      blog: 'Creator Hub',
      help: 'Help & FAQ',
      marathiGuide: 'मराठी सेटअप गाइड',
      cart: 'Cart',
      signIn: 'Account',
      dashboard: 'Seller Studio',
      admin: 'Admin Console',
      downloads: 'My Downloads',
      orders: 'Order History',
    },
    hero: {
      badge: 'India’s Empowered Digital Marketplace',
      headlinePart1: 'The Sovereign Marketplace to',
      headlineHighlight: 'Create • Sell • Earn',
      subheadline:
        'Sell eBooks, educational PDFs, storybooks, UI kits, design templates, and artisan crafts with instant Razorpay payments, transparent commission splits, and automated affiliate tracking.',
      ctaExplore: 'Explore Catalog',
      ctaStartSelling: 'Open Creator Store',
      searchPlaceholder: 'Search eBooks, handwritten notes, design systems, course kits...',
      stat1: '₹1.8 Cr+',
      stat1Label: 'Paid to Creators',
      stat2: '14,200+',
      stat2Label: 'Verified Downloads',
      stat3: '90%',
      stat3Label: 'Creator Net Payout',
    },
    categories: {
      title: 'Curated Marketplace Categories',
      subtitle: 'From digital assets and PDF guides to physical heritage crafts',
      all: 'All Categories',
      ebooks: 'eBooks & PDF Books',
      storybooks: 'Story Books & Literature',
      education: 'Educational & Exam Notes',
      templates: 'Templates & Graphics',
      courses: 'Courses & Video Kits',
      software: 'Software & Code Kits',
      artisan_crafts: 'Artisan & Brass Crafts',
      physical_goods: 'Physical Products',
    },
    product: {
      digitalInstant: 'Instant Digital Download',
      physicalItem: 'Physical Goods (Shipped)',
      addToCart: 'Add to Cart',
      buyNow: 'Instant Buy',
      downloadSample: 'Preview Sample',
      secureDownload: 'Download File',
      downloadsRemaining: 'downloads remaining',
      by: 'By',
      reviews: 'Reviews',
      ratings: 'Rating',
      affiliateShare: 'Earn 3% affiliate commission sharing this product',
      generateRefLink: 'Get Affiliate Link',
      copyLink: 'Copy Referral Link',
      linkCopied: 'Copied to Clipboard!',
      inStock: 'In Stock',
      outOfStock: 'Sold Out',
      verifiedSeller: 'Verified Seller',
    },
    checkout: {
      cartTitle: 'Shopping Cart',
      emptyCart: 'Your cart is currently empty.',
      subtotal: 'Subtotal',
      tax: 'Taxes & Payment Fee',
      total: 'Total Due',
      proceedToCheckout: 'Proceed to Secure Checkout',
      secureCheckoutTitle: 'Secure Checkout',
      customerInfo: 'Customer Information',
      fullName: 'Full Name',
      email: 'Email Address (for download delivery)',
      phone: 'Mobile / WhatsApp (Optional)',
      shippingAddress: 'Shipping Address (for physical crafts)',
      paymentMode: 'Select Payment Method',
      demoModeNotice: 'Simulation Mode Active: You can safely simulate a verified Razorpay payment.',
      payWithRazorpay: 'Pay via Razorpay / UPI',
      payDemo: 'Simulate Verified Payment (Demo Mode)',
      processingPayment: 'Verifying signature & generating download tokens...',
      orderSuccessTitle: 'Payment Confirmed!',
      orderSuccessDesc:
        'Your transaction was successfully verified. Your download tokens and invoice are now active.',
      viewDownloads: 'Access Download Library',
    },
    seller: {
      dashboardTitle: 'Seller Creator Studio',
      totalSales: 'Gross Merchandise Value',
      grossRevenue: 'Total Volume',
      platformFeePaid: 'Marketplace Fees (10%)',
      netEarnings: 'Creator Net Earnings',
      payoutAvailable: 'Available for Payout',
      requestPayout: 'Request Bank Payout',
      myProducts: 'My Store Catalog',
      addNewProduct: 'Publish New Product',
      storeSettings: 'Storefront Settings',
      payoutSettings: 'Bank & UPI KYC',
    },
    affiliate: {
      portalTitle: 'Affiliate Growth Partner Portal',
      tagline: 'Earn 3% genuine commission for every buyer you refer',
      totalClicks: 'Attributed Clicks',
      validConversions: 'Verified Orders',
      pendingEarnings: 'Pending Commission',
      approvedEarnings: 'Approved Earnings',
      paidEarnings: 'Paid to Bank',
      yourRefLink: 'Your Master Referral Code',
    },
  },
  mr: {
    tagline: 'निर्मिती करा • विक्री करा • कमवा',
    nav: {
      home: 'मुख्यपृष्ठ',
      explore: 'मार्केटप्लेस पहा',
      digital: 'डिजिटल उत्पादने',
      physical: 'हस्तकला उत्पादने',
      ebooks: 'ई-बुक्स आणि पीडीएफ',
      storybooks: 'कथा पुस्तके',
      education: 'अभ्यास नोट्स',
      templates: 'टेम्प्लेट्स आणि डिझाइन',
      courses: 'ऑनलाइन कोर्सेस',
      becomeSeller: 'विक्रेता बना',
      affiliate: 'अॅफिलिएट प्रोग्राम',
      pricing: 'कमिशन आणि दर',
      blog: 'निर्माता केंद्र',
      help: 'मदत आणि प्रश्न',
      marathiGuide: 'मराठी संपूर्ण गाइड',
      cart: 'खरेदी टोपली',
      signIn: 'खाते',
      dashboard: 'विक्रेता स्टुडिओ',
      admin: 'प्रशासक पॅनेल',
      downloads: 'माझे डाऊनलोड्स',
      orders: 'माझ्या ऑर्डर्स',
    },
    hero: {
      badge: 'भारतातील अग्रगण्य डिजिटल क्रिएटर प्लॅटफॉर्म',
      headlinePart1: 'भारतीय निर्मात्यांसाठी हक्काचे व्यासपीठ',
      headlineHighlight: 'निर्मिती करा • विक्री करा • कमवा',
      subheadline:
        'ई-पुस्तके, शैक्षणिक पीडीएफ, कथा, डिझाइन टेम्प्लेट्स, ऑनलाइन कोर्सेस आणि हस्तकला उत्पादने विका. थेट रेझरपे पेमेंट्स, पारदर्शक कमिशन आणि सुरक्षित डाऊनलोड्स.',
      ctaExplore: 'उत्पादने पहा',
      ctaStartSelling: 'स्टोअर सुरू करा',
      searchPlaceholder: 'ई-बुक्स, मराठी कथा, हस्तलिखित नोट्स, डिझाइन शोधा...',
      stat1: '₹१.८ कोटी+',
      stat1Label: 'निर्मात्यांना वितरित',
      stat2: '१४,२००+',
      stat2Label: 'सुरक्षित डाऊनलोड्स',
      stat3: '९०%',
      stat3Label: 'निर्मात्यांचा निव्वळ वाटा',
    },
    categories: {
      title: 'उत्कृष्ट बाजारपेठ विभाग',
      subtitle: 'डिजिटल पुस्तकांपासून पारंपरिक भारतीय हस्तकलेपर्यंत सर्व काही एकाच ठिकाणी',
      all: 'सर्व विभाग',
      ebooks: 'ई-बुक्स आणि पीडीएफ पुस्तके',
      storybooks: 'कथा आणि साहित्य',
      education: 'शैक्षणिक व स्पर्धा परीक्षा नोट्स',
      templates: 'टेम्प्लेट्स आणि ग्राफिक्स',
      courses: 'कोर्सेस आणि व्हिडिओ संच',
      software: 'सॉफ्टवेअर आणि कोड',
      artisan_crafts: 'पारंपरिक पितळ व हस्तकला',
      physical_goods: 'प्रत्यक्ष उत्पादने',
    },
    product: {
      digitalInstant: 'झटपट डिजिटल डाऊनलोड',
      physicalItem: 'पार्सलद्वारे डिलिव्हरी',
      addToCart: 'टोपलीत टाका',
      buyNow: 'त्वरित खरेदी करा',
      downloadSample: 'नमुना पहा',
      secureDownload: 'फाइल डाऊनलोड करा',
      downloadsRemaining: 'डाऊनलोड्स शिल्लक',
      by: 'निर्माता',
      reviews: 'अभिप्राय',
      ratings: 'रेटिंग',
      affiliateShare: 'हे उत्पादन शेअर करून ३% अॅफिलिएट कमिशन कमवा',
      generateRefLink: 'अॅफिलिएट लिंक मिळवा',
      copyLink: 'लिंक कॉपी करा',
      linkCopied: 'लिंक कॉपी झाली!',
      inStock: 'उपलब्ध आहे',
      outOfStock: 'संपले आहे',
      verifiedSeller: 'प्रमाणित विक्रेता',
    },
    checkout: {
      cartTitle: 'तुमची खरेदी टोपली',
      emptyCart: 'तुमची टोपली रिकामी आहे.',
      subtotal: 'एकूण किंमत',
      tax: 'कर व सेवा शुल्क',
      total: 'देय रक्कम',
      proceedToCheckout: 'सुरक्षित पेमेंटकडे जा',
      secureCheckoutTitle: 'सुरक्षित खरेदी व पेमेंट',
      customerInfo: 'ग्राहक माहिती',
      fullName: 'पूर्ण नाव',
      email: 'ईमेल पत्ता (डाऊनलोड लिंक पाठवण्यासाठी)',
      phone: 'मोबाईल / व्हॉट्सअ‍ॅप (ऐच्छिक)',
      shippingAddress: 'डिलिव्हरी पत्ता (हस्तकला व वस्तूंसाठी)',
      paymentMode: 'पेमेंट पद्धत निवडा',
      demoModeNotice: 'डेमो मोड सक्रिय: तुम्ही सुरक्षितपणे रेझरपे पेमेंट तपासू शकता.',
      payWithRazorpay: 'रेझरपे / UPI द्वारे भरा',
      payDemo: 'डेमो पेमेंट तपासा (Simulation)',
      processingPayment: 'पेमेंट पडताळणी व सुरक्षित डाऊनलोड टोकन तयार होत आहे...',
      orderSuccessTitle: 'पेमेंट यशस्वी झाले!',
      orderSuccessDesc: 'तुमचा व्यवहार यशस्वीरीत्या पूर्ण झाला आहे. तुमच्या डाऊनलोड फाइल्स खाली उपलब्ध आहेत.',
      viewDownloads: 'माझी डाऊनलोड लायब्ररी उघडा',
    },
    seller: {
      dashboardTitle: 'विक्रेता डॅशबोर्ड',
      totalSales: 'एकूण विक्री (GMV)',
      grossRevenue: 'एकूण व्यवसाय',
      platformFeePaid: 'प्लॅटफॉर्म फी (१०%)',
      netEarnings: 'निर्मात्याची निव्वळ कमाई',
      payoutAvailable: 'बँकेत वर्ग करण्यासाठी शिल्लक',
      requestPayout: 'पेआउट विनंती करा',
      myProducts: 'माझी उत्पादने',
      addNewProduct: 'नवीन उत्पादन जोडा',
      storeSettings: 'स्टोअर प्रोफाइल सेटिंग्ज',
      payoutSettings: 'बँक खाते व केवायसी',
    },
    affiliate: {
      portalTitle: 'अॅफिलिएट भागीदार डॅशबोर्ड',
      tagline: 'उत्पादने शेअर करा आणि प्रत्येक यशस्वी खरेदीवर ३% कमिशन मिळवा',
      totalClicks: 'एकूण क्लिक्स',
      validConversions: 'यशस्वी ऑर्डर्स',
      pendingEarnings: 'प्रलंबित कमिशन',
      approvedEarnings: 'मंजूर कमाई',
      paidEarnings: 'बँकेत जमा कमाई',
      yourRefLink: 'तुमचा मुख्य रेफरल कोड',
    },
  },
  hi: {
    tagline: 'सृजन करें • बेचें • कमाएं',
    nav: {
      home: 'होम',
      explore: 'मार्केटप्लेस देखें',
      digital: 'डिजिटल उत्पाद',
      physical: 'हस्तशिल्प उत्पाद',
      ebooks: 'ई-बुक्स और पीडीएफ',
      storybooks: 'कहानियां और किताबें',
      education: 'अध्ययन नोट्स',
      templates: 'टेम्प्लेट्स और ग्राफिक्स',
      courses: 'ऑनलाइन कोर्सेस',
      becomeSeller: 'विक्रेता बनें',
      affiliate: 'एफिलिएट प्रोग्राम',
      pricing: 'कमीशन और दरें',
      blog: 'क्रिएटर हब',
      help: 'सहायता एवं सवाल',
      marathiGuide: 'मराठी सेटअप गाइड',
      cart: 'कार्ट',
      signIn: 'अकाउंट',
      dashboard: 'विक्रेता स्टूडियो',
      admin: 'प्रशासक कंसोल',
      downloads: 'मेरे डाउनलोड्स',
      orders: 'ऑर्डर इतिहास',
    },
    hero: {
      badge: 'भारत का अग्रणी डिजिटल क्रिएटर मार्केटप्लेस',
      headlinePart1: 'भारतीय क्रिएटर्स के लिए समर्पित मंच',
      headlineHighlight: 'सृजन करें • बेचें • कमाएं',
      subheadline:
        'ई-बुक्स, पीडीएफ नोट्स, कहानियां, डिजाइन टेम्प्लेट्स, ऑनलाइन कोर्सेज और हस्तशिल्प बेचें। त्वरित रेज़रपे भुगतान, पारदर्शी कमीशन विभाजन और सुरक्षित डाउनलोड्स।',
      ctaExplore: 'कैटलॉग देखें',
      ctaStartSelling: 'स्टोर शुरू करें',
      searchPlaceholder: 'ई-बुक्स, हस्तलिखित नोट्स, डिजाइन टेम्प्लेट खोजें...',
      stat1: '₹1.8 करोड़+',
      stat1Label: 'क्रिएटर्स को भुगतान',
      stat2: '14,200+',
      stat2Label: 'सत्यापित डाउनलोड्स',
      stat3: '90%',
      stat3Label: 'क्रिएटर का शुद्ध हिस्सा',
    },
    categories: {
      title: 'लोकप्रिय श्रेणियां',
      subtitle: 'डिजिटल फाइल्स से लेकर पारंपरिक कलाकृतियों तक सब कुछ',
      all: 'सभी श्रेणियां',
      ebooks: 'ई-बुक्स एवं पीडीएफ',
      storybooks: 'कहानियां एवं साहित्य',
      education: 'शैक्षणिक व परीक्षा नोट्स',
      templates: 'टेम्प्लेट्स एवं ग्राफिक्स',
      courses: 'कोर्सेस एवं वीडियो किट',
      software: 'सॉफ्टवेयर एवं कोड',
      artisan_crafts: 'पारंपरिक पीतल व हस्तशिल्प',
      physical_goods: 'भौतिक उत्पाद',
    },
    product: {
      digitalInstant: 'तुरंत डिजिटल डाउनलोड',
      physicalItem: 'पार्सल द्वारा डिलीवरी',
      addToCart: 'कार्ट में डालें',
      buyNow: 'अभी खरीदें',
      downloadSample: 'नमूना देखें',
      secureDownload: 'फाइल डाउनलोड करें',
      downloadsRemaining: 'डाउनलोड बाकी',
      by: 'रचयिता',
      reviews: 'समीक्षाएं',
      ratings: 'रेटिंग',
      affiliateShare: 'यह प्रोडक्ट शेयर करें और 3% एफिलिएट कमीशन कमाएं',
      generateRefLink: 'एफिलिएट लिंक पाएं',
      copyLink: 'लिंक कॉपी करें',
      linkCopied: 'लिंक कॉपी हो गई!',
      inStock: 'स्टॉक में उपलब्ध',
      outOfStock: 'स्टॉक खत्म',
      verifiedSeller: 'प्रमाणित विक्रेता',
    },
    checkout: {
      cartTitle: 'शॉपिंग कार्ट',
      emptyCart: 'आपकी कार्ट खाली है।',
      subtotal: 'उप-योग',
      tax: 'कर एवं भुगतान शुल्क',
      total: 'कुल देय राशि',
      proceedToCheckout: 'सुरक्षित चेकआउट पर जाएं',
      secureCheckoutTitle: 'सुरक्षित चेकआउट व भुगतान',
      customerInfo: 'ग्राहक विवरण',
      fullName: 'पूरा नाम',
      email: 'ईमेल पता (डाउनलोड लिंक प्राप्त करने हेतु)',
      phone: 'मोबाइल नंबर (वैकल्पिक)',
      shippingAddress: 'डिलीवरी पता (भौतिक सामान हेतु)',
      paymentMode: 'भुगतान का तरीका चुनें',
      demoModeNotice: 'डेमो मोड सक्रिय: आप सुरक्षित रूप से रेज़रपे भुगतान का परीक्षण कर सकते हैं।',
      payWithRazorpay: 'रेज़रपे / यूपीआई द्वारा भुगतान करें',
      payDemo: 'डेमो भुगतान का अनुकरण करें (सिमुलेशन)',
      processingPayment: 'भुगतान सत्यापन और सुरक्षित टोकन जनरेट किया जा रहा है...',
      orderSuccessTitle: 'भुगतान सफल रहा!',
      orderSuccessDesc: 'आपका लेन-देन सत्यापित हो गया है। आपकी डाउनलोड फाइलें नीचे उपलब्ध हैं।',
      viewDownloads: 'मेरी डाउनलोड लाइब्रेरी खोलें',
    },
    seller: {
      dashboardTitle: 'सेलर क्रिएटर स्टूडियो',
      totalSales: 'कुल बिक्री (GMV)',
      grossRevenue: 'कुल राजस्व',
      platformFeePaid: 'मार्केटप्लेस फीस (10%)',
      netEarnings: 'क्रिएटर की शुद्ध कमाई',
      payoutAvailable: 'बैंक में ट्रांसफर हेतु उपलब्ध',
      requestPayout: 'पेआउट का अनुरोध करें',
      myProducts: 'मेरे उत्पाद',
      addNewProduct: 'नया उत्पाद जोड़ें',
      storeSettings: 'स्टोर सेटिंग्स',
      payoutSettings: 'बैंक खाता व केवाईसी',
    },
    affiliate: {
      portalTitle: 'एफिलिएट पार्टनर पोर्टल',
      tagline: 'उत्पाद शेयर करें और हर वास्तविक बिक्री पर 3% कमीशन कमाएं',
      totalClicks: 'कुल क्लिक्स',
      validConversions: 'सत्यापित ऑर्डर्स',
      pendingEarnings: 'लंबित कमीशन',
      approvedEarnings: 'स्वीकृत कमाई',
      paidEarnings: 'बैंक में जमा की गई कमाई',
      yourRefLink: 'आपका मुख्य रेफरल कोड',
    },
  },
};
