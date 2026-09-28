# CHAKRA मार्केटप्लेस: नवशिक्यांसाठी परिपूर्ण मराठी इन्स्टॉलेशन गाइड
> **टॅगलाइन:** "Create • Sell • Earn (निर्मिती करा • विक्री करा • कमवा)"  
> **लेखक:** CHAKRA Architecture Team

नमस्कार! जर तुम्ही तंत्रज्ञानात नवीन असाल आणि तुम्हाला स्वतःची ई-बुक्स, कोर्सेस, नोट्स किंवा हस्तकला विकण्यासाठी **CHAKRA** सारखे आधुनिक मल्टिव्हेंडर मार्केटप्लेस सुरू करायचे असेल, तर हे मार्गदर्शक तुमच्यासाठी आहे. खालील १६ पायऱ्या अत्यंत सोप्या भाषेत दिलेल्या आहेत.

---

## अनुक्रमणिका
1. प्रकल्प डाऊनलोड करणे (Download the Project)
2. Node.js इन्स्टॉल करणे
3. VS Code मध्ये प्रकल्प उघडणे
4. \`npm install\` चालवणे
5. Supabase वर मोफत डेटाबेस तयार करणे
6. डेटाबेस मायग्रेशन्स (SQL Migrations) लागू करणे
7. प्रायव्हेट स्टोरेज (Private Storage) आणि ऑथेंटिकेशन सेट करणे
8. एन्व्हायर्नमेंट व्हेरिएबल्स (\`.env.local\`) सेट करणे
9. स्थानिक पातळीवर (Localhost) वेबसाईट चालवणे
10. GitHub वर कोड अपलोड करणे
11. Netlify ला GitHub शी जोडणे
12. वेबसाईट जगभरात डिप्लॉय (Deploy) करणे
13. स्वतःचे कस्टम डोमेन (Custom Domain) जोडणे
14. रेझरपे (Razorpay) पेमेंट गेटवे आणि वेबहूक सेट करणे
15. विक्रेता, खरेदीदार, अॅफिलिएट आणि डाऊनलोड्सची चाचणी घेणे
16. डेमो मोडवरून थेट लाईव्ह (Live Production) मोडवर जाणे

---

### १. प्रकल्प डाऊनलोड करणे
GitHub वरून \`chakra-marketplace\` प्रकल्पाची ZIP फाइल डाऊनलोड करा किंवा तुमच्या संगणकावर Git टर्मिनल उघडून खालील कमांड द्या:
\`\`\`bash
git clone https://github.com/your-username/chakra-marketplace.git
cd chakra-marketplace
\`\`\`

---

### २. Node.js इन्स्टॉल करणे
वेबसाईट चालवण्यासाठी **Node.js (आवृत्ती 20 किंवा नवीन)** आवश्यक आहे.
1. अधिकृत वेबसाइटवर जा: **[nodejs.org](https://nodejs.org)**
2. **LTS (Recommended For Most Users)** डाऊनलोड करा आणि इन्स्टॉल करा.
3. इन्स्टॉलेशन यशस्वी झाले का पाहण्यासाठी टर्मिनलमध्ये हे टाइप करा:
\`\`\`bash
node -v
npm -v
\`\`\`

---

### ३. VS Code मध्ये प्रकल्प उघडणे
1. **Visual Studio Code** सॉफ्टवेअर सुरू करा.
2. \`File\` -> \`Open Folder\` वर क्लिक करून \`chakra-marketplace\` फोल्डर निवडा.
3. वरच्या मेनूतील \`Terminal\` -> \`New Terminal\` वर क्लिक करा.

---

### ४. \`npm install\` चालवणे
प्रकल्पातील सर्व लायब्ररी (React, Next.js, Tailwind, Lucide Icons) इन्स्टॉल करण्यासाठी टर्मिनलमध्ये कमांड टाका:
\`\`\`bash
npm install
\`\`\`
*(टीप: इंटरनेटचा वेग चांगला असल्यास १-२ मिनिटांत सर्व पॅकेजेस इन्स्टॉल होतील.)*

---

### ५. Supabase वर मोफत डेटाबेस तयार करणे
1. **[supabase.com](https://supabase.com)** वर जा आणि Google किंवा GitHub ने मोफत साइन अप करा.
2. **"New Project"** वर क्लिक करा.
3. प्रकल्पाचे नाव द्या: \`chakra-marketplace\`.
4. एक सुरक्षित पासवर्ड टाका.
5. **Region:** भारतासाठी **"South Asia (Mumbai)"** निवडा.
6. **"Create new project"** बटण दाबा.

---

### ६. डेटाबेस मायग्रेशन्स (SQL Migrations) लागू करणे
1. Supabase डॅशबोर्डमध्ये डाव्या बाजूला असलेल्या **SQL Editor** आयकॉनवर क्लिक करा.
2. तुमच्या प्रकल्पातील \`/supabase/migrations/20250101_chakra_schema.sql\` ही फाइल उघडा आणि त्यातील संपूर्ण कोड कॉपी करा.
3. Supabase SQL Editor मध्ये पेस्ट करा आणि खाली उजवीकडे **Run** बटण दाबा.
4. सर्व टेबल्स, RLS सिक्युरिटी रूल्स आणि फंक्शन्स तयार होतील.
5. यानंतर \`/supabase/seed.sql\` मधील कोड चालवून सुरुवातीच्या ८ कॅटेगरी लोड करा.

---

### ७. प्रायव्हेट स्टोरेज (Private Storage) सेट करणे
विक्रेत्यांच्या पीडीएफ (PDF) फाइल्स सुरक्षित ठेवण्यासाठी:
1. Supabase मधील **Storage** मेनूवर क्लिक करा.
2. **"New Bucket"** वर क्लिक करा.
3. बकेटचे नाव \`product-files\` ठेवा.
4. **"Public Bucket" हा पर्याय बंद ठेवा (Private)**. यामुळे केवळ पैसे भरलेल्या ग्राहकांनाच तात्पुरत्या सुरक्षित टोकनद्वारे फाइल डाऊनलोड करता येईल.

---

### ८. एन्व्हायर्नमेंट व्हेरिएबल्स (\`.env.local\`) सेट करणे
प्रकल्पाच्या मुख्य फोल्डरमध्ये \`.env.example\` फाइलची प्रत बनवून तिचे नाव \`.env.local\` ठेवा. त्यात खालील माहिती भरा:
\`\`\`env
# Supabase सार्वजनिक माहिती (Frontend साठी सुरक्षित)
NEXT_PUBLIC_SUPABASE_URL=https://तुमचा-प्रकल्प-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=तुमची-anon-key

# Supabase गुप्त माहिती (केवळ Server-Side साठी, कधीही कोणाला दाखवू नका)
SUPABASE_SERVICE_ROLE_KEY=तुमची-service-role-key

# Razorpay कीज
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=तुमचा-secret-key

# वेबसाइट URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

---

### ९. स्थानिक पातळीवर (Localhost) वेबसाईट चालवणे
सर्व सेटिंग्ज झाल्यावर टर्मिनलमध्ये ही कमांड द्या:
\`\`\`bash
npm run dev
\`\`\`
तुमच्या ब्राऊझरमध्ये **http://localhost:3000** उघडा. तुमचे CHAKRA मार्केटप्लेस दिसेल!

---

### १०. GitHub वर कोड अपलोड करणे
1. **[github.com](https://github.com)** वर नवीन Repository तयार करा.
2. टर्मिनलमध्ये खालीलप्रमाणे कोड पाठवा:
\`\`\`bash
git init
git add .
git commit -m "CHAKRA Marketplace v1"
git branch -M main
git remote add origin https://github.com/तुमचे-नाव/chakra-marketplace.git
git push -u origin main
\`\`\`

---

### ११. Netlify ला GitHub शी जोडणे
1. **[netlify.com](https://netlify.com)** वर मोफत खाते उघडा.
2. **Add new site** -> **Import an existing project** निवडा.
3. **GitHub** निवडून तुमची रिपॉझिटरी सिलेक्ट करा.

---

### १२. वेबसाईट जगभरात डिप्लॉय करणे
Netlify डिप्लॉयमेंट सेटिंग्स:
* **Build Command:** \`npm run build\`
* **Publish directory:** \`.next\`
* **Environment variables:** \`.env.local\` मधील सर्व कीज Netlify मध्ये जोडा.
* **Deploy Site** वर क्लिक करा. २ मिनिटांत तुमची वेबसाइट इंटरनेटवर मोफत लाइव्ह होईल!

---

### १३. स्वतःचे कस्टम डोमेन जोडणे
1. GoDaddy, Hostinger किंवा Namecheap वरून डोमेन विकत घ्या (उदा. \`mychakra.in\`).
2. Netlify मधील **Domain management** मध्ये जाऊन डोमेनचे नाव टाका.
3. Netlify चे DNS किंवा CNAME रेकॉर्ड्स तुमच्या डोमेन प्रदाता साइटवर अपडेट करा.
4. २४ तासांत मोफत HTTPS/SSL आपोआप सुरू होईल.

---

### १४. रेझरपे (Razorpay) पेमेंट गेटवे जोडणे
1. **[razorpay.com](https://razorpay.com)** वर भारतीय व्यवसाय किंवा वैयक्तिक खाते उघडा.
2. **Settings -> API Keys** वरून Key ID आणि Key Secret मिळवा.
3. **Webhooks** मध्ये \`https://तुमची-वेबसाइट.com/api/verify-payment\` ही लिंक टाका आणि \`payment.captured\` इव्हेंट चालू करा.

---

### १५. खरेदी आणि डाऊनलोड चाचणी
1. **सेलर स्टुडिओ (Seller Studio)** मध्ये जाऊन ₹५०० किमतीचे ई-बुक जोडा.
2. **अॅफिलिएट पोर्टल** मध्ये जाऊन त्याची रेफरल लिंक मिळवा.
3. खरेदीदार म्हणून **डेमो पेमेंट (Demo Simulation)** निवडून खरेदी करा.
4. खरेदी होताच **"My Downloads"** मध्ये पीडीएफ सुरक्षितपणे उघडते का ते तपासा.
5. सेलर डॅशबोर्डमध्ये ९०% (₹४५०) आणि अॅफिलिएटला ३% (₹१५) बरोबर जमा झाले का ते तपासा.

---

### १६. डेमो मोडवरून लाईव्ह मोडवर जाणे
1. रेझरपेची KYC पूर्ण झाल्यावर **Live Key** मिळवा (\`rzp_live_...\`).
2. Netlify Environment Variables मध्ये \`NEXT_PUBLIC_RAZORPAY_KEY_ID\` आणि \`RAZORPAY_KEY_SECRET\` या लाइव्ह कीजने अपडेट करा.
3. Admin Console मध्ये जाऊन डेमो मोड बंद करा.
4. अभिनंदन! आता तुमचे भारतीय डिजिटल मार्केटप्लेस खऱ्याखुऱ्या UPI पेमेंट्स स्वीकारण्यासाठी सज्ज आहे!
