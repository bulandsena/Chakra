'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Terminal,
  Database,
  Cloud,
  CreditCard,
  ExternalLink,
  Copy,
  FolderGit2,
  KeyRound,
  ShieldCheck,
  Building,
  TrendingUp,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const MarathiGuideView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      num: 1,
      title: '१. मालक खाते व कमाई (Owner Account & Earnings)',
      content: `
CHAKRA मध्ये तुम्ही या संपूर्ण मार्केटप्लेसचे **मालक (Root Owner/Admin)** आहात:
* **एकूण विक्री (Gross Sales):** ग्राहकांनी खरेदी केलेल्या डिजिटल किंवा भौतिक वस्तूंचे एकूण मूल्य.
* **मार्केटप्लेस कमिशन (१०%):** प्रत्येक यशस्वी विक्रीवर मालकाचा सुरुवातीचा १०% हिस्सा.
* **विक्रेत्याचा वाटा (९०%):** उर्वरित ९०% वाटा थेट विक्रेत्याला मिळतो.
* **महत्त्वाचा आर्थिक नियम:** कधीही अंदाजित किंवा भविष्यातील महसूल हा प्रत्यक्ष मिळालेले पैसे म्हणून दाखवू नका. जोपर्यंत पैसे Razorpay कडून कापले जात नाहीत व बँकेत RBI UTR द्वारे जमा होत नाहीत, तोपर्यंत ते फक्त प्रक्रिया सुरू असलेले व्यवहार मानले जातात.
      `,
    },
    {
      num: 2,
      title: '२. कमिशन रचना व सेटिंग्ज (Commission Settings)',
      content: `
CHAKRA मधील कमिशन अत्यंत पारदर्शक आणि बहुस्तरीय (Multi-tier) आहे:
१. **डीफॉल्ट कमिशन:** सुरुवातीला हे **१०%** वर सेट केले आहे.
२. **कॅटेगरीनुसार कमिशन:**
   * ई-बुक्स, कथासंग्रह आणि शैक्षणिक नोट्स: १०%
   * ऑनलाइन कोर्सेस: १२% (जास्त सर्व्हर बँडविड्थ व व्हिडिओंसाठी)
   * हस्तकला आणि फिजिकल उत्पादने: ८% (निर्मिती खर्च जास्त असल्यामुळे)
३. **उत्पादनानुसार सवलत (Product Override):** कोणत्याही विशिष्ट उत्पादनासाठी तुम्ही ५% किंवा सानुकूल दर निश्चित करू शकता.
४. **अपरिवर्तनीय स्नॅपशॉट (Immutable Snapshot):** ग्राहकाने खरेदी करताच त्या वेळचा कमिशन दर \`order_commissions\` टेबलमध्ये कायमस्वरूपी नोंदवला जातो.
      `,
    },
    {
      num: 3,
      title: '३. व्यवसाय बँक खाते सुरक्षितपणे जोडणे (Owner Bank Account)',
      content: `
**अत्यंत महत्त्वाची सुरक्षा खबरदारी:**
* **तुमच्या बँकेचा लॉगिन आयडी, पासवर्ड किंवा यूपीआय पिन कधीही या वेबसाईटवर टाकू नका.**
* बँक पडताळणी थेट अधिकृत **Razorpay Merchant Portal** वरून केली जाते:
  १. **dashboard.razorpay.com** वर लॉगिन करा.
  २. **Settings -> Bank Account** मध्ये जाऊन तुमच्या कंपनीचा किंवा वैयक्तिक बँक खाते नंबर आणि IFSC कोड टाका.
  ३. Razorpay आपोआप **Penny Drop** (₹१ जमा करून) खात्याचे नाव व पॅन कार्ड पडताळून पाहील.
  ४. पडताळणी झाल्यावर दररोजचे कमिशन थेट तुमच्या बँकेत RBI UTR नंबरसह जमा होते.
      `,
    },
    {
      num: 4,
      title: '४. Razorpay Test Mode आणि Live Mode सेट करणे',
      content: `
सुरक्षेसाठी सर्व API कीज केवळ Netlify Environment Variables मध्ये साठवल्या जातात:
* **Test Mode:** \`rzp_test_...\` की वापरून बनावट कार्ड किंवा UPI द्वारे चाचणी घेता येते.
* **Live Mode:** \`rzp_live_...\` की द्वारे खरोखरचे पैसे स्वीकारले जातात.
* **महत्त्वाचा नियम:** *लाईव्ह मोडमध्ये कधीही खोटा किंवा बनावट व्यवहार 'यशस्वी' म्हणून दाखवला जात नाही.* जर लाईव्ह पेमेंट अयशस्वी झाले, तर स्पष्ट त्रुटी दाखवली जाते.
      `,
      command: `RAZORPAY_KEY_ID=rzp_test_...\nRAZORPAY_KEY_SECRET=...\nRAZORPAY_WEBHOOK_SECRET=...\nRAZORPAY_LIVE_MODE=false`,
    },
    {
      num: 5,
      title: '५. Razorpay Route व स्प्लिट पेमेंट्स (Marketplace Split)',
      content: `
* **Razorpay Route म्हणजे काय?**
  ग्राहकाने भरलेल्या ₹१,००० मधून ₹१०० मार्केटप्लेसच्या खात्यात राहतात आणि ₹९०० आपोआप विक्रेत्याच्या **Linked Account** मध्ये ट्रान्सफर होतात.
* **महत्त्वाची अट:**
  साधारण Razorpay खात्यात Route सुविधा लगेच नसते. Razorpay कडे Route साठी अर्ज करून मंजुरी मिळाल्यावरच \`RAZORPAY_ROUTE_ENABLED="true"\` करा.
      `,
      command: `RAZORPAY_ROUTE_ENABLED=true`,
    },
    {
      num: 6,
      title: '६. पर्यायी मॅन्युअल पेआउट पद्धत (Alternative Workflow)',
      content: `
जर तुमचे Razorpay Route अद्याप मंजूर झाले नसेल, तरी काही अडचण नाही:
१. सर्व ग्राहकांचे पैसे तुमच्या मुख्य मर्चंट खात्यात जमा होतात.
२. मालकाचे १०% कमिशन तुमच्या खात्यात वेगळे राहते.
३. **Seller Payouts** डॅशबोर्डमध्ये जाऊन **"Export Statement CSV"** बटण दाबा.
४. ही फाईल वापरून तुमच्या बँकेच्या नेटबँकिंगमधून (NEFT/RTGS/बल्क UPI) विक्रेत्यांना थेट ९०% रक्कम पाठवा आणि पेआउटला **"Disburse"** किंवा **"Completed"** मार्क करा.
      `,
    },
    {
      num: 7,
      title: '७. सेलर डॅशबोर्ड व इनव्हॉइसेस (Seller Dashboard)',
      content: `
विक्रेत्यांना त्यांच्या डॅशबोर्डमध्ये पुढील सुविधा मिळतात:
१. **KYC आणि बँक माहिती जोडणे:** बँक खाते, IFSC, पॅन कार्ड आणि UPI आयडी नोंदवणे.
२. **कमाई आणि शिल्लक:** १०% कमिशन कपात व ९०% नेट कमाईचे थेट आकडे.
३. **ग्राहक इनव्हॉइस:** प्रत्येक ऑर्डरचे कायदेशीर टॅक्स इनव्हॉइस पाहणे आणि प्रिंट करणे.
४. **स्टेटमेंट डाऊनलोड:** संपूर्ण विक्रीचा एक्सेल/CSV रिपोर्ट एका क्लिकवर डाऊनलोड करणे.
५. **सुरक्षा अलगीकरण:** एका विक्रेत्याला दुसऱ्या विक्रेत्याची आर्थिक माहिती कधीही दिसत नाही.
      `,
    },
    {
      num: 8,
      title: '८. Supabase डेटाबेस मायग्रेशन्स (SQL Migrations)',
      content: `
१. **https://supabase.com** वर जाऊन मोफत प्रकल्प तयार करा (Region: South Asia Mumbai निवडा).
२. डाव्या बाजूच्या **SQL Editor** वर क्लिक करा.
३. आपल्या प्रकल्पातील \`/supabase/migrations/20260101_commission_payouts_route.sql\` फाईल उघडा आणि त्यातील सर्व कोड कॉपी करून SQL Editor मध्ये पेस्ट करा.
४. **Run** दाबा. यामुळे खालील ८ सुरक्षित टेबल्स तयार होतील:
   * \`commission_rules\` (१०% डीफॉल्ट व कॅटेगरी कमिशन)
   * \`payment_transactions\` (पेमेंट व्यवहार)
   * \`order_commissions\` (कमिशन स्नॅपशॉट्स)
   * \`seller_payouts\` (विक्रेत्यांचे पेआउट्स)
   * \`affiliate_commissions\` (अॅफिलिएट कमिशन)
   * \`refunds\` (परतावा हिशोब)
   * \`settlement_records\` (बँक सेटलमेंट नोंदी)
   * \`audit_logs\` (सुरक्षा ऑडिट नोंदी)
      `,
    },
    {
      num: 9,
      title: '९. ₹१,००० उत्पादन चाचणी परिस्थिती (Testing)',
      content: `
मार्केटप्लेसचे हिशोब बरोबर चालत आहेत का हे तपासण्यासाठी Admin Console मधील **"Run Test Scenarios"** बटण दाबा:
* **₹१,००० किमतीचे ई-बुक चाचणी:**
  * ग्राहक भरतो: **₹१,०००** (१,००,००० पैसे)
  * प्लॅटफॉर्म हिस्सा (१०%): **₹१००** (१०,००० पैसे)
  * विक्रेत्याचा वाटा (९०%): **₹९००** (९०,००० पैसे)
  * पेमेंट गेटवे फी (~२.३६% MDR): **₹२३.६०**
  * चाचणीमध्ये हे सर्व हिशोब, डुप्लिकेट वेबहूक संरक्षण, रिफंड कपात आणि बँक UTR सेटलमेंट हिरव्या रंगात **"PASSED"** म्हणून तपासले जातात.
      `,
    },
    {
      num: 10,
      title: '१०. Netlify वर मोफत वेबसाईट व फंक्शन्स डिप्लॉय करणे',
      content: `
१. कोड GitHub वर अपलोड करा:
   \`\`\`bash
   git add .
   git commit -m "CHAKRA Marketplace v2"
   git push origin main
   \`\`\`
२. **https://netlify.com** वर लॉगिन करा आणि **"Add new site" -> "Import from Git"** निवडा.
३. **Site configuration -> Environment variables** मध्ये खालील व्हेरिएबल्स जोडा:
   * \`NEXT_PUBLIC_SUPABASE_URL\`
   * \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   * \`SUPABASE_SERVICE_ROLE_KEY\`
   * \`RAZORPAY_KEY_ID\`
   * \`RAZORPAY_KEY_SECRET\`
   * \`RAZORPAY_WEBHOOK_SECRET\`
   * \`RAZORPAY_ROUTE_ENABLED\` = \`false\`
४. **Deploy Site** दाबा. Netlify तुमचे Next.js ॲप आणि सर्व्हरलेस फंक्शन्स स्वयंचलितपणे इंटरनेटवर मोफत लाईव्ह करेल!
      `,
      command: `git add .\ngit commit -m "CHAKRA Marketplace with Owner Commission & Route"\ngit push origin main`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>सुलभ मराठी संपूर्ण मार्गदर्शिका</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
          CHAKRA मार्केटप्लेस: मालक कमिशन, पेआउट्स व डिप्लॉयमेंट गाइड
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
          १०% मालक कमिशन, विक्रेत्यांचे पेआउट्स, Razorpay Route स्प्लिट पेमेंट्स आणि Netlify वर मोफत वेबसाईट कशी चालवावी याची सोपी माहिती.
        </p>
      </div>

      {/* Step selector pills / navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => setActiveStep(s.num)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              activeStep === s.num
                ? 'bg-[#132C28] text-chakra-ivory dark:bg-chakra-gold dark:text-stone-950 font-bold shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
            }`}
          >
            टप्पा {s.num}
          </button>
        ))}
      </div>

      {/* Active Step Card */}
      {(() => {
        const step = steps.find((s) => s.num === activeStep) || steps[0];
        return (
          <div className="p-6 sm:p-8 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-chakra-gold text-stone-950 font-bold flex items-center justify-center text-sm">
                  {step.num}
                </span>
                <h2 className="text-xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
                  {step.title}
                </h2>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                टप्पा {step.num} / १०
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
              {step.content}
            </div>

            {step.command && (
              <div className="relative group">
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={() => copyCode(step.command!, step.num)}
                    className="p-1.5 bg-stone-800 text-stone-300 hover:text-white rounded-md text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedIndex === step.num ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>कॉपी झाले!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>कोड कॉपी करा</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 bg-stone-950 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-stone-800">
                  {step.command}
                </pre>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <button
                disabled={activeStep <= 1}
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-xs font-semibold rounded-lg disabled:opacity-30 cursor-pointer"
              >
                ← मागील टप्पा
              </button>
              <button
                disabled={activeStep >= steps.length}
                onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
                className="px-5 py-2 bg-chakra-gold text-stone-950 text-xs font-bold rounded-lg hover:bg-chakra-gold-light disabled:opacity-30 cursor-pointer"
              >
                पुढील टप्पा →
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
