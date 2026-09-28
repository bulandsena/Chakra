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
      title: 'प्रकल्प डाऊनलोड करणे (Download Project)',
      content: `
CHAKRA चा संपूर्ण सोर्स कोड डाऊनलोड करण्यासाठी GitHub वरून ZIP फाइल डाऊनलोड करा किंवा \`git clone\` कमांड वापरा.

फाइल अनझिप (Unzip) करून संगणकावर सुरक्षित फोल्डरमध्ये ठेवा (उदा. \`D:/projects/chakra-marketplace\`).
      `,
      command: `git clone https://github.com/your-username/chakra-marketplace.git\ncd chakra-marketplace`,
    },
    {
      num: 2,
      title: 'Node.js इन्स्टॉल करणे (Install Node.js)',
      content: `
हा प्रकल्प चालवण्यासाठी तुमच्या कॉम्प्युटरवर **Node.js (Version 20 किंवा त्याहून नवीन)** असणे आवश्यक आहे.

१. अधिकृत वेबसाइटवर जा: **https://nodejs.org**
२. **LTS (Long Term Support)** आवृत्ती डाऊनलोड करून Next, Next क्लिक करून इन्स्टॉल करा.
३. इन्स्टॉलेशन तपासण्यासाठी टर्मिनलमध्ये कमांड चालवा.
      `,
      command: `node -v\nnpm -v`,
    },
    {
      num: 3,
      title: 'VS Code मध्ये प्रकल्प उघडणे',
      content: `
१. **Visual Studio Code** सॉफ्टवेअर उघडा (नसल्यास code.visualstudio.com वरून डाऊनलोड करा).
२. \`File\` -> \`Open Folder\` वर क्लिक करा आणि \`chakra-marketplace\` फोल्डर निवडा.
३. \`Ctrl + \`\` (किंवा Terminal -> New Terminal) दाबून अंतर्गत टर्मिनल उघडा.
      `,
    },
    {
      num: 4,
      title: 'डिपेंडन्सीज इन्स्टॉल करणे (npm install)',
      content: `
प्रकल्पातील Next.js, Tailwind, Lucide Icons आणि सर्व आवश्यक लायब्ररी स्वयंचलितरीत्या इन्स्टॉल करण्यासाठी खालील कमांड चालवा:
      `,
      command: `npm install`,
    },
    {
      num: 5,
      title: 'सुपाबेस (Supabase) वर डेटाबेस तयार करणे',
      content: `
CHAKRA चा डेटा साठवण्यासाठी आणि सुरक्षित ऑथेंटिकेशनसाठी मोफत Supabase चा वापर केला जातो:

१. **https://supabase.com** वर जा आणि मोफत अकाउंट उघडा.
२. **New Project** वर क्लिक करा.
३. प्रकल्पाचे नाव \`chakra-marketplace\` द्या आणि एक मजबूत डेटाबेस पासवर्ड सेट करा.
४. Region मध्ये **South Asia (Mumbai)** निवडा जेणेकरून भारतातील युजर्ससाठी साईट अत्यंत वेगवान चालेल.
      `,
    },
    {
      num: 6,
      title: 'डेटाबेस मायग्रेशन लागू करणे (SQL Migrations)',
      content: `
१. Supabase डॅशबोर्डमध्ये डाव्या बाजूला असलेल्या **SQL Editor** वर क्लिक करा.
२. आपल्या प्रकल्पातील \`/supabase/migrations/20250101_chakra_schema.sql\` फाइलमधील सर्व कोड कॉपी करा.
३. SQL Editor मध्ये पेस्ट करून खाली उजवीकडे **Run** बटण दाबा.
४. सर्व टेबल्स (Products, Orders, Profiles, Commissions, Downloads) आणि सुरक्षित RLS Policies लगेच तयार होतील!
      `,
    },
    {
      num: 7,
      title: 'प्रायव्हेट स्टोरेज बकेट तयार करणे (Private Storage)',
      content: `
विक्रेत्यांच्या पीडीएफ (PDF) आणि डिजिटल फाइल्स सुरक्षित ठेवण्यासाठी:
१. Supabase डॅशबोर्डमध्ये **Storage** टॅबवर जा.
२. **New Bucket** वर क्लिक करा. बकेटचे नाव \`product-files\` ठेवा.
३. **Public Bucket बंद ठेवा** (Private ठेवा), जेणेकरून केवळ पैसे भरलेल्या ग्राहकांनाच डाऊनलोड करता येईल.
      `,
    },
    {
      num: 8,
      title: '.env.local फाइल तयार करणे (Environment Variables)',
      content: `
प्रकल्पाच्या मुख्य फोल्डरमध्ये \`.env.example\` फाइलची प्रत बनवून तिचे नाव \`.env.local\` ठेवा आणि त्यात तुमच्या चाव्या भरा:
      `,
      command: `NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...\nSUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...\nRAZORPAY_KEY_ID=rzp_test_...\nRAZORPAY_KEY_SECRET=...\nNEXT_PUBLIC_APP_URL=http://localhost:3000`,
    },
    {
      num: 9,
      title: 'स्थानिक संगणकावर वेबसाईट सुरू करणे (Localhost)',
      content: `
सर्व सेटिंग्ज झाल्यावर वेबसाईट कॉम्प्युटरवर चालवण्यासाठी खालील कमांड टाका:
      `,
      command: `npm run dev`,
    },
    {
      num: 10,
      title: 'GitHub वर कोड अपलोड करणे',
      content: `
१. **github.com** वर जाऊन \`New Repository\` तयार करा (उदा. \`chakra-marketplace\`).
२. तुमच्या टर्मिनलमध्ये खालीलप्रमाणे कोड पुश करा:
      `,
      command: `git init\ngit add .\ngit commit -m "Initial CHAKRA marketplace setup"\ngit branch -M main\ngit remote add origin https://github.com/your-username/chakra-marketplace.git\ngit push -u origin main`,
    },
    {
      num: 11,
      title: 'Netlify वर कनेक्ट करून डिप्लॉय करणे',
      content: `
१. **https://netlify.com** वर मोफत लॉग इन करा.
२. **Add new site** -> **Import an existing project** निवडा.
३. GitHub निवडून तुमचा \`chakra-marketplace\` प्रकल्प निवडा.
४. Build Command: \`npm run build\` आणि Publish directory: \`.next\` ठेवा.
५. **Environment Variables** मध्ये तुमचे Supabase आणि Razorpay चे कीज भरा.
६. **Deploy site** वर क्लिक करा! अवघ्या २ मिनिटांत तुमची वेबसाइट जगभरात लाइव्ह होईल.
      `,
    },
    {
      num: 12,
      title: 'कस्टम डोमेन जोडणे (Domain Setup)',
      content: `
तुमची स्वतःची वेबसाइट (उदा. \`www.mychakra.in\`) जोडण्यासाठी:
१. Netlify डॅशबोर्डमध्ये **Domain management** -> **Add domain** वर जा.
२. तुमच्या डोमेन रजिस्ट्रार (GoDaddy, Namecheap किंवा Hostinger) मध्ये जाऊन Netlify चे CNAME किंवा DNS रेकॉर्ड्स जोडा.
३. मोफत SSL Certificate आपोआप ऍक्टिव्हेट होईल.
      `,
    },
    {
      num: 13,
      title: 'रेझरपे पेमेंट गेटवे जोडणे (Razorpay Integration)',
      content: `
१. **https://razorpay.com** वर भारतीय व्यवसाय / व्यक्तिगत खाते उघडा.
२. **Settings** -> **API Keys** वरून Key ID आणि Key Secret मिळवा.
३. प्रथम Test Mode मध्ये तपासा, नंतर बँकेची KYC पूर्ण करून Live Mode चालू करा.
४. **Webhooks** मध्ये \`https://your-domain.com/api/verify-payment\` URL जोडा आणि \`payment.captured\` इव्हेंट निवडा.
      `,
    },
    {
      num: 14,
      title: 'विक्रेता आणि खरेदीदार चाचणी (Testing)',
      content: `
१. **विक्रेता म्हणून**: सेलर स्टुडिओमध्ये जाऊन नवीन ई-बुक किंवा कोर्स अपलोड करा. किंमत ₹499 ठेवा.
२. **अॅफिलिएट म्हणून**: त्या उत्पादनाची रेफरल लिंक तयार करा (उदा. \`?ref=aff_123\`).
३. **खरेदीदार म्हणून**: लिंकवरून उत्पादन टोपलीत टाका आणि पेमेंट करा.
४. **डाऊनलोड लायब्ररीमध्ये**: पैसे भरताच सुरक्षित टोकनाइज्ड डाऊनलोड फाइल अनलॉक होते का ते तपासा!
      `,
    },
    {
      num: 15,
      title: 'डेमो मोडमधून थेट लाइव्ह मोडवर जाणे (Live Transition)',
      content: `
१. \`.env.local\` आणि Netlify Environment मध्ये Razorpay ची Live Key (\`rzp_live_...\`) टाका.
२. Admin Dashboard मध्ये Demo Mode बंद करा.
३. आता ग्राहक खरोखर Google Pay, PhonePe किंवा कार्डने पैसे भरू शकतील आणि ९०% रक्कम थेट तुमच्या भारतीय बँक खात्यात जमा होईल!
      `,
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
          CHAKRA मार्केटप्लेस: नवशिक्यांसाठी मराठी इन्स्टॉलेशन गाइड
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
          कोणत्याही कठीण तांत्रिक ज्ञानाशिवाय स्वतःचा डिजिटल उत्पादनांचा व्यवसाय कसा सुरू करावा,
          डेटाबेस कसा जोडावा आणि Netlify वर मोफत वेबसाईट कशी लाइव्ह करावी याची टप्प्याटप्प्याने माहिती.
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
                टप्पा {step.num} / १५
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
                    className="p-1.5 bg-stone-800 text-stone-300 hover:text-white rounded-md text-[11px] flex items-center gap-1 transition-colors"
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
                className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-xs font-semibold rounded-lg disabled:opacity-30"
              >
                ← मागील टप्पा
              </button>
              <button
                disabled={activeStep >= steps.length}
                onClick={() => setActiveStep((prev) => Math.min(steps.length, prev + 1))}
                className="px-5 py-2 bg-chakra-gold text-stone-950 text-xs font-bold rounded-lg hover:bg-chakra-gold-light disabled:opacity-30"
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
