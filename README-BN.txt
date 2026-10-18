LoveVerse AI — NJR RUBAYET
============================

প্রজেক্ট: সম্পূর্ণ বাংলা, মোবাইল-ফ্রেন্ডলি রোমান্টিক ওয়েবসাইট
Owner: NJR RUBAYET
Facebook: https://www.facebook.com/share/1Ezh5b6AJR/

ফিচার
-----
১. লাভ ম্যাচ স্কোর (শুধুই বিনোদন; বাস্তব সামঞ্জস্য মাপে না)
২. কাল্পনিক লাভ প্রেডিকশন
৩. Fun / Romantic / Playful Truth or Dare
৪. চার ধরনের বাংলা গল্প; API না থাকলে স্থানীয় fallback
৫. বাংলা লাভ-ফ্রেন্ড চ্যাট; API না থাকলে fallback reply
৬. লাভ লেটার জেনারেটর (কপি করার সুবিধাসহ)
৭. লাভ অ্যানিভার্সারি কাউন্টার
৮. সিক্রেট ইমোজি মেসেজ (মজার কোড; নিরাপদ এনক্রিপশন নয়)
৯. লাভ ল্যাঙ্গুয়েজ কুইজ
১০. দৈনিক ভালোবাসার/নিজের যত্নের চ্যালেঞ্জ
১১. পছন্দের রোমান্টিক লাইন সেভ/ডিলিট (ব্রাউজারের localStorage)
১২. Netlify Functions দিয়ে ঐচ্ছিক OpenAI সংযোগ

ফোল্ডার গঠন
-----------
index.html
assets/style.css
assets/app.js
netlify.toml
netlify/functions/chat.js
netlify/functions/story.js
README-BN.txt

Android ফোন থেকে Netlify-তে প্রকাশ
-----------------------------------
পদ্ধতি A — সবচেয়ে সহজ (ZIP Extract করে ফোল্ডার আপলোড)
১. ফোনে NJR-Bangla-Love-AI.zip ডাউনলোড করো।
২. Files / My Files অ্যাপ খুলে ZIP ফাইলটি খুঁজে বের করো।
৩. ZIP-এ চাপ দিয়ে Extract / Extract here নির্বাচন করো। যদি ফোল্ডারের নাম NJR-Bangla-Love-AI হয়, সেটি খোলো।
৪. Netlify-তে লগইন করো: https://app.netlify.com/
৫. নতুন সাইট তৈরি করার সময় “Deploy manually” বা Netlify Drop-এর নির্দেশনা অনুসরণ করো।
৬. গুরুত্বপূর্ণ: এই প্রজেক্টে Netlify Functions আছে। শুধু সাধারণ static folder drag-and-drop দিয়ে ফাইল প্রকাশ করলে Functions সবসময় build নাও হতে পারে। সবচেয়ে নির্ভরযোগ্য পদ্ধতি হলো GitHub-এ প্রজেক্ট আপলোড করে Netlify-তে “Add new site / Import an existing project” দিয়ে repository connect করা।
৭. GitHub ব্যবহার করলে repository-তে এই ফোল্ডারের ভেতরের সব ফাইল আপলোড করো (index.html যেন publish root-এ থাকে)।
৮. Netlify-তে Build settings-এ Publish directory হিসেবে . এবং Functions directory হিসেবে netlify/functions রাখো। netlify.toml-এ সেটিংস আগে থেকেই আছে।
৯. Deploy site চাপো। Deploy complete হলে Netlify যে ওয়েবসাইট URL দেবে সেটি খোলো।

Environment Variables ও নিরাপদ API Key
-------------------------------------
১. OpenAI API Key ঐচ্ছিক। API Key না দিলেও লাভ ম্যাচ, প্রেডিকশন, Truth or Dare এবং fallback গল্প/চ্যাট কাজ করবে।
২. OpenAI API ব্যবহার করতে OpenAI Platform-এ নিজের API Key তৈরি করো: https://platform.openai.com/api-keys
৩. Netlify Dashboard-এ তোমার সাইট খুলে Site configuration (কিছু অ্যাকাউন্টে Project configuration) → Environment variables-এ যাও।
৪. Add a variable নির্বাচন করো:
   Key: OPENAI_API_KEY
   Value: তোমার OpenAI secret key
৫. আরেকটি variable যোগ করো:
   Key: OPENAI_MODEL
   Value: gpt-4o-mini
   (চাইলে তোমার অ্যাকাউন্টে উপলভ্য অন্য chat-completions-compatible model দিতে পারো।)
৬. Save করো। এরপর Deploys → Trigger deploy → Deploy site দিয়ে নতুন deploy করো।
৭. API Key কখনো index.html, assets/app.js, GitHub public repository, screenshot বা কাউকে পাঠানো মেসেজে রাখবে না। শুধু Netlify Environment Variables-এ রাখবে।
৮. API key থাকলে OpenAI ব্যবহারের জন্য খরচ হতে পারে। OpenAI Platform-এ Usage / Billing / Limits পর্যবেক্ষণ করো। প্রয়োজন হলে spending limit সেট করো।

AI কীভাবে কাজ করে
-----------------
- OPENAI_API_KEY ও OPENAI_MODEL ঠিকভাবে সেট করা থাকলে লাভ-ফ্রেন্ড এবং গল্প ফিচার Netlify Functions থেকে OpenAI API-তে অনুরোধ পাঠায়।
- API অনুপলব্ধ, key না থাকা, quota/permission/model error বা নেটওয়ার্ক সমস্যা হলে UI fallback ব্যবহার করে।
- Fallback উত্তরগুলো আসল AI তৈরি করা উত্তর নয়; এগুলো ওয়েবসাইটে আগে থেকে লেখা সাধারণ উত্তর/গল্প।
- লাভ ম্যাচ স্কোর, প্রেডিকশন ও Truth or Dare স্থানীয় JavaScript দিয়ে কাজ করে। এগুলো বাস্তব ভবিষ্যদ্বাণী বা বৈজ্ঞানিক মূল্যায়ন নয়।

সমস্যা সমাধান
--------------
• পেজ খুলছে না: Netlify Deploys-এ সর্বশেষ deploy সফল কি না দেখো; Publish directory-তে index.html আছে কি না নিশ্চিত করো।
• CSS/ডিজাইন আসছে না: assets/style.css এবং assets/app.js ঠিক ফোল্ডারে আছে কি না দেখো। পুরো project structure অক্ষুণ্ণ রাখো।
• AI উত্তর আসছে না: API Key ও Model variable-এর বানান পরীক্ষা করো; তারপর নতুন deploy করো।
• Function 404: শুধু static drag-and-drop নয়, Git-connected Netlify build ব্যবহার করো; Functions directory netlify/functions কি না দেখো।
• API error: Netlify Functions logs দেখো। OpenAI account-এর billing, quota, model access এবং API key যাচাই করো।
• Copy বাটন কাজ করছে না: কিছু ব্রাউজারে clipboard-এর জন্য HTTPS দরকার; Netlify HTTPS URL ব্যবহার করো।
• পুরোনো পেজ দেখাচ্ছে: browser refresh করো বা Netlify-তে নতুন deploy করো।
• ফোনে মেনু: উপরের ☰ বাটনে চাপ দাও।

গোপনীয়তা ও নিরাপত্তা
-------------------
- চ্যাট ইতিহাস শুধু বর্তমান পেজের JavaScript memory-তে রাখা হয়; পেজ refresh/বন্ধ করলে তা মুছে যায়। এই প্রজেক্ট নিজে কোনো chat database-এ ইতিহাস সংরক্ষণ করে না।
- AI চালু থাকলে পাঠানো বার্তা/গল্পের অনুরোধ OpenAI API-তে যায়। ব্যক্তিগত, পাসওয়ার্ড, আর্থিক বা অতিসংবেদনশীল তথ্য পাঠিও না।
- এই সাইট বিনোদন ও সৃজনশীলতার জন্য; চিকিৎসা, মানসিক স্বাস্থ্য, আইনি বা জরুরি পরামর্শের বিকল্প নয়।

© LoveVerse AI — Made with 💜 by NJR RUBAYET


মোবাইল অপ্টিমাইজেশন
-------------------
- ছোট স্ক্রিনে এক-কলামের কার্ড, বড় ট্যাপ টার্গেট ও মোবাইল নেভিগেশন।
- ফর্মে মোবাইল-উপযোগী ইনপুট সাইজ, safe-area padding এবং কম মোশনের পছন্দকে সম্মান।
- নতুন টুলগুলো API ছাড়াও কাজ করে; সেভ করা পছন্দের লাইন একই ব্রাউজারে থাকে।

নোট
----
এই প্রজেক্টে নিরাপদ অ্যাডমিন ড্যাশবোর্ড নেই। শুধু HTML/JavaScript দিয়ে বানানো অ্যাডমিন প্যানেল নিরাপদ নয়; ব্যবহারকারী/কনটেন্ট ম্যানেজমেন্ট লাগলে authenticated backend যোগ করতে হবে।
