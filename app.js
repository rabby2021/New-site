(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const show = (el, html) => { el.innerHTML = html; el.classList.remove("hidden"); };
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  $("year").textContent = new Date().getFullYear();

  $("menuToggle").addEventListener("click", () => $("mainNav").classList.toggle("open"));
  $("mainNav").querySelectorAll("a").forEach(a => a.addEventListener("click", () => $("mainNav").classList.remove("open")));

  $("matchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const a = $("nameOne").value.trim(), b = $("nameTwo").value.trim();
    if (!a || !b) return;
    // Stable playful score: deliberately not a scientific or relationship assessment.
    const seed = [...(a.toLocaleLowerCase("bn") + "|" + b.toLocaleLowerCase("bn"))].reduce((n, c) => (n * 31 + c.codePointAt(0)) % 9973, 7);
    const reverse = [...(b.toLocaleLowerCase("bn") + "|" + a.toLocaleLowerCase("bn"))].reduce((n, c) => (n * 31 + c.codePointAt(0)) % 9973, 7);
    const score = 35 + ((seed + reverse) % 66);
    const msg = score > 88 ? "উফ! কল্পনার আকাশে আতশবাজি! ✨" : score > 72 ? "মিষ্টি কেমিস্ট্রির দারুণ গল্প হতে পারে! 💗" : score > 54 ? "বন্ধুত্ব, বোঝাপড়া আর হাসি—সবই গুরুত্বপূর্ণ। 💜" : "স্কোর যাই হোক, বাস্তবের যত্নই আসল জাদু। 🌷";
    show($("matchResult"), `<div class="score-row"><div><b>${escapeHTML(a)} + ${escapeHTML(b)}</b><div class="result-message">${msg}</div></div><div class="score-number">${score}%</div></div><div class="score-track"><div class="score-fill" id="scoreFill"></div></div><div class="tiny">এই স্কোরটি নামভিত্তিক মজার র‌্যান্ডম-ধাঁচের হিসাব, বাস্তব সামঞ্জস্যের মাপ নয়।</div>`);
    requestAnimationFrame(() => { const f = $("scoreFill"); if (f) f.style.width = score + "%"; });
  });

  const predictions = {
    single: ["এই কল্পনার অধ্যায়ে নিজের জন্য সময় রাখো—নতুন শখেই হয়তো দারুণ কারও সঙ্গে পরিচয়ের গল্প শুরু হবে। 🌷","তোমার পরের রোমান্টিক দৃশ্য? নিজের সঙ্গে এক কাপ চা, পছন্দের গান, আর আত্মবিশ্বাসের ঝলক! ☕","আজকের কাল্পনিক বার্তা: তাড়াহুড়ো নয়, নিজের মতো করে জ্বলে ওঠো। ✨"],
    crush: ["কল্পনায় তোমাদের দেখা হলো বইয়ের দোকানে—একটা হাসি, তারপর স্বাভাবিক একটা কথোপকথন। বাস্তবে হলে সম্মান রেখে ধীরে এগিও। 💌","তোমার গল্পের পরের দৃশ্য হতে পারে ছোট্ট একটা ‘হাই’। অনুমান নয়, আন্তরিক কথাই মানুষকে কাছাকাছি আনে। 💗","আজকের ফ্যান্টাসি: একই গানের প্রতি ভালোবাসা থেকে শুরু হলো মিষ্টি আলাপ। 🎧"],
    relationship: ["তোমাদের কল্পিত পরের অধ্যায়—ফোন দূরে রেখে একসঙ্গে সময় কাটানো, আর মন দিয়ে একে অপরের কথা শোনা। 💞","একটা ছোট্ট কৃতজ্ঞতার বার্তা আজকের গল্পে বড় হাসি এনে দিল। বাস্তবেও যত্নের ছোট কাজ অনেক মূল্যবান। 🌙","রোমান্টিক দৃশ্য: বৃষ্টির শব্দ, গরম চা, আর দুজনের খোলামেলা আলাপ। ☔"],
    complicated: ["এই কল্পনার গল্পে প্রথম জাদু হলো পরিষ্কার কথা আর নিজের সীমা বোঝা। তোমার অনুভূতিও সমান গুরুত্বপূর্ণ। 💜","আজকের কাল্পনিক অধ্যায় বলছে—সব উত্তর এখনই পেতে হবে না। একটু সময় নিয়ে নিজের চাওয়া বোঝো। 🌌","একটি শান্ত আলাপ হয়তো গল্পের মোড় ঘুরিয়ে দিতে পারে—যদি দুজনেই প্রস্তুত ও সম্মানজনকভাবে কথা বলতে চাও। 🌷"]
  };
  $("predictBtn").addEventListener("click", () => {
    const status = $("loveStatus").value;
    show($("predictionResult"), `<div class="result-message">${escapeHTML(pick(predictions[status]))}</div><div class="tiny" style="margin-top:10px">🔮 কল্পনাভিত্তিক বার্তা • বাস্তব ভবিষ্যৎ জানার উপায় নয়</div>`);
  });

  const challenges = {
    fun: {
      truth:["তোমার সবচেয়ে হাস্যকর ভুল বোঝাবুঝির গল্প কী?","কোন গান শুনলে অকারণে নাচতে ইচ্ছে করে?","ছোটবেলার কোন অভ্যাসটা এখনও আছে?","কোন সিনেমার চরিত্রের সঙ্গে নিজেকে মেলাও?"],
      dare:["২০ সেকেন্ডে তিনটি মজার মুখভঙ্গি করো!","একটি আবহাওয়ার খবর নাটকীয়ভাবে পড়ে শোনাও।","পাশের কোনো জিনিসের জন্য বিজ্ঞাপন বানাও।","নিজের নাম দিয়ে ছন্দ মিলিয়ে একটি লাইন বলো।"]
    },
    romantic: {
      truth:["কারও কোন ছোট্ট যত্ন তোমার মন ছুঁয়ে যায়?","তোমার কাছে আদর্শ ডেট কেমন?","ভালোবাসা বোঝানোর সবচেয়ে সুন্দর উপায় কী?","কোন গান তোমাকে রোমান্টিক মুডে আনে?"],
      dare:["কাউকে আন্তরিক একটি প্রশংসা বলো—সে স্বচ্ছন্দ হলে।","তোমার আদর্শ ডেটের তিনটি জিনিস বর্ণনা করো।","একটি কাল্পনিক প্রেমের সিনেমার নাম বানাও।","একটি মিষ্টি, সম্মানজনক প্রশংসার লাইন তৈরি করো।"]
    },
    playful: {
      truth:["তোমার সবচেয়ে অদ্ভুত কিন্তু নিরীহ ক্রাশ ছিল কিসে?","কোন মেসেজ পাঠিয়ে পরে লজ্জা পেয়েছিলে?","তোমার গোপন প্রতিভা কী?","একটি মজার ডাকনাম কী হতে পারে তোমার?"],
      dare:["একটি রোবটের মতো ১০ সেকেন্ড কথা বলো।","পরের বাক্যটি গানের সুরে বলো।","তিনটি ইমোজি দিয়ে তোমার আজকের মুড বোঝাও।","একটি কাল্পনিক সুপারপাওয়ারের নাম ও ব্যবহার বলো।"]
    }
  };
  const challenge = (kind) => {
    const item = pick(challenges[$("gameMode").value][kind]);
    const label = kind === "truth" ? "💬 TRUTH" : kind === "dare" ? "⚡ DARE" : "🎲 RANDOM";
    show($("challengeResult"), `<div class="tiny" style="color:#d3a8ff;margin-bottom:5px">${label}</div>${escapeHTML(item)}`);
  };
  $("truthBtn").addEventListener("click", () => challenge("truth"));
  $("dareBtn").addEventListener("click", () => challenge("dare"));
  $("randomChallenge").addEventListener("click", () => challenge(Math.random() < .5 ? "truth" : "dare"));

  const storyTemplates = {
    romantic: (a,b) => `${a} আর ${b}-এর প্রথম দেখা হয়েছিল এক বৃষ্টিভেজা বিকেলে। পুরোনো বইয়ের দোকানে একই বইয়ের দিকে হাত বাড়াতে গিয়ে দুজনের চোখাচোখি হলো। ছোট্ট হাসি থেকে শুরু হলো গল্প, গল্প থেকে বন্ধুত্ব।\n\nদিন যেতে যেতে ${a} বুঝল, ${b}-এর সঙ্গে কথা বললে সাধারণ দিনও একটু রঙিন হয়ে ওঠে। একদিন ছাদের কিনারায় দাঁড়িয়ে শহরের আলো দেখতে দেখতে ${b} বলল, “সব সুন্দর মুহূর্ত বড় হতে হয় না—কিছু মুহূর্ত শুধু সত্যি হলেই চলে।”\n\n${a} মৃদু হেসে উত্তর দিল, “তাহলে এই মুহূর্তটা মনে রাখি।” বাতাসে ভেসে এল বৃষ্টির গন্ধ। তাদের গল্পের শেষ লেখা হলো না—কারণ সবচেয়ে সুন্দর গল্পগুলো প্রতিদিন একটু একটু করে লেখা হয়। 💗`,
    comedy: (a,b) => `${a} ঠিক করল, ${b}-কে মুগ্ধ করার জন্য নিজে হাতে কেক বানাবে। রেসিপিতে লেখা ছিল “এক চিমটি লবণ”, কিন্তু উত্তেজনায় সে দিয়ে ফেলল প্রায় এক মুঠো! কেকের প্রথম কামড় খেয়ে ${b} এমন মুখ করল যে দুজনেই হেসে গড়িয়ে পড়ল।\n\nপরিস্থিতি সামলাতে ${a} ঘোষণা করল, “এটা আসলে সমুদ্র-থিমের বিশেষ কেক!” ${b} বলল, “বাহ, তাহলে পানির বোতলটাও কি ডেজার্টের অংশ?”\n\nশেষ পর্যন্ত কেকের বদলে তারা বানাল গরম চা আর টোস্ট। সেই দিন থেকে তাদের নিয়ম—রান্নায় পরীক্ষা চলবে, তবে ফায়ার এক্সটিংগুইশার আর হাসি দুটোই কাছে থাকবে। ভালোবাসা? সেটাও একটু পোড়া, একটু মিষ্টি—একদম তাদের মতো! 😂`,
    mystery: (a,b) => `রাত ঠিক বারোটায় ${a}-এর ফোনে একটি অচেনা বার্তা এল: “পুরোনো ঘড়ির নিচে তাকাও।” বার্তাটি পাঠিয়েছে ${b}, অথচ ${b} শপথ করে বলল সে কিছুই জানে না। দুজন মিলে পুরোনো বাড়ির ঘড়ির নিচে খুঁজে পেল একটি ছোট বাক্স, তার ভেতরে একটি নীল চাবি আর হাতে লেখা মানচিত্র।\n\nমানচিত্রটি তাদের নিয়ে গেল ছাদের এক কোণে, যেখানে বহুদিনের ধুলোয় ঢাকা একটি ডায়েরি লুকানো ছিল। পাতার পর পাতা জুড়ে ছিল শহরের অজানা গল্প—আর শেষ পাতায় লেখা, “রহস্যের সমাধান সবসময় কোনো বস্তু নয়; কখনও তা সেই মানুষ, যার ওপর তুমি ভরসা করো।”\n\n${a} আর ${b} একে অপরের দিকে তাকাল। চাবির দরজা তারা এখনও খুঁজে পায়নি। কিন্তু রহস্যটা এখন আর ভয়ংকর নয়—এটি তাদের পরের অভিযানের আমন্ত্রণ। 🌙`,
    emotional: (a,b) => `অনেক দিন ধরে ${a} নিজের মনের কথা ঠিকভাবে বলতে পারছিল না। বাইরে থেকে সব স্বাভাবিক, অথচ ভেতরে জমে ছিল না-বলা অনেক অনুভূতি। এক সন্ধ্যায় ${b} শুধু পাশে বসে বলল, “তুমি চাইলে বলতে পারো, আর না চাইলে আমরা চুপচাপ বসেও থাকতে পারি।”\n\nএই সহজ কথাটুকুতেই ${a}-এর বুকের ভার একটু হালকা হলো। কোনো বড় প্রতিশ্রুতি নয়, কোনো সিনেমার মতো দৃশ্য নয়—শুধু মন দিয়ে শোনা আর বিচার না করার আশ্বাস। ${a} বুঝল, যত্ন কখনও কখনও সমাধান দেওয়ার মধ্যে নয়; পাশে থাকার মধ্যেই থাকে।\n\nসেদিন তারা সব সমস্যার উত্তর খুঁজে পায়নি। কিন্তু দুজনেই জানল, কঠিন দিনের মাঝেও কোমলতা সম্ভব। আর সেটাই ছিল তাদের গল্পের সবচেয়ে উজ্জ্বল আলো। 💜`
  };
  let latestStory = "";
  $("generateStory").addEventListener("click", async () => {
    const a = $("storyNameOne").value.trim() || "নীল", b = $("storyNameTwo").value.trim() || "মেঘ";
    const mode = $("storyMode").value, btn = $("generateStory");
    btn.disabled = true; btn.textContent = "গল্প তৈরি হচ্ছে…";
    try {
      const response = await fetch("/.netlify/functions/story", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nameOne:a,nameTwo:b,mode})});
      if (response.ok) {
        const data = await response.json();
        if (data.story && data.source === "openai") {
          latestStory = data.story; $("storyText").textContent = latestStory; $("storySource").textContent = "• OpenAI"; $("copyStory").disabled = false; return;
        }
      }
    } catch (_) { /* fallback below */ }
    latestStory = storyTemplates[mode](a,b);
    $("storyText").textContent = latestStory; $("storySource").textContent = "• অফলাইন ফallback"; $("copyStory").disabled = false;
    btn.disabled = false; btn.textContent = "✦ গল্প তৈরি করো";
  });
  // Restore button on successful API response as well.
  const storyButtonObserver = new MutationObserver(() => { if ($("generateStory").disabled) { $("generateStory").disabled = false; $("generateStory").textContent = "✦ গল্প তৈরি করো"; } });
  storyButtonObserver.observe($("storyText"), {childList:true,subtree:true});
  $("copyStory").addEventListener("click", async () => {
    if (!latestStory) return;
    try { await navigator.clipboard.writeText(latestStory); $("copyStory").textContent = "✓ কপি হয়েছে"; }
    catch (_) { const area = document.createElement("textarea"); area.value = latestStory; document.body.appendChild(area); area.select(); try { document.execCommand("copy"); $("copyStory").textContent = "✓ কপি হয়েছে"; } catch(e) { $("copyStory").textContent = "লেখা সিলেক্ট করে কপি করো"; } area.remove(); }
    setTimeout(() => $("copyStory").textContent = "▣ গল্প কপি করো", 1800);
  });

  const chat = [];
  const fallbackReplies = [
    "তোমার কথাটা শুনে মনে হচ্ছে বিষয়টি তোমার কাছে সত্যিই গুরুত্বপূর্ণ। 💜 তুমি চাইলে একটু বিস্তারিত বলো—কোন অংশটা তোমাকে সবচেয়ে বেশি ভাবাচ্ছে?",
    "এমন অনুভূতি হওয়া অস্বাভাবিক নয়। নিজের অনুভূতিকে ছোট করে দেখো না, আর অন্য মানুষটির সীমা ও অনুভূতিকেও সম্মান দিও। 🌷",
    "আমি তোমার কথা শুনছি। তাড়াহুড়ো করে সিদ্ধান্ত নেওয়ার দরকার নেই—তোমার কাছে কোন ফলাফলটা সবচেয়ে ভালো মনে হয়?",
    "সম্পর্কে খোলামেলা, শান্ত ও সম্মানজনক কথা বলা অনেক সময় সাহায্য করে। তুমি কী বলতে চাও, সেটা আগে নিজের কাছে পরিষ্কার করে নিতে পারো। 💗",
    "তোমার অনুভূতিটা গুরুত্বপূর্ণ। মনে রেখো, অন্যের প্রতিক্রিয়া তুমি নিয়ন্ত্রণ করতে পারবে না, কিন্তু নিজের যত্ন নেওয়া আর সৎ থাকা তোমার হাতে আছে।"
  ];
  function addBubble(text, who) {
    const div = document.createElement("div"); div.className = "bubble " + who; div.textContent = text;
    $("chatMessages").appendChild(div); $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
    return div;
  }
  $("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = $("chatInput").value.trim(); if (!message) return;
    $("chatInput").value = ""; addBubble(message, "user"); chat.push({role:"user",content:message});
    const typing = addBubble("লাভি ভাবছে…", "bot typing");
    const send = $("chatForm").querySelector("button"); send.disabled = true;
    let reply = "";
    try {
      const response = await fetch("/.netlify/functions/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,history:chat.slice(-10)})});
      if (response.ok) { const data = await response.json(); if (data.reply && data.source === "openai") reply = data.reply; }
    } catch (_) {}
    if (!reply) reply = pick(fallbackReplies);
    typing.remove(); addBubble(reply, "bot"); chat.push({role:"assistant",content:reply});
    send.disabled = false; $("chatInput").focus();
  });
  $("clearChat").addEventListener("click", () => {
    chat.length = 0; $("chatMessages").innerHTML = '<div class="bubble bot">আবার শুরু করি! 💜 আজ কী নিয়ে কথা বলতে চাও?</div>';
  });

  // Extra mobile-first love tools: all lightweight and usable without an API.
  const letterTemplates = {
    sweet:(n,f)=>`প্রিয় ${n},

তোমার সঙ্গে কথা বললে সাধারণ দিনটাও একটু সুন্দর হয়ে যায়। তোমার ছোট্ট হাসি, যত্ন আর সহজ কথাগুলো মনে থেকে যায় অনেকক্ষণ। তোমাকে কোনো বড় প্রতিশ্রুতি দিয়ে নয়, বরং প্রতিদিন সম্মান, সততা আর যত্ন দিয়ে ভালো রাখতে চাই।

ভালো থেকো, আর নিজের মতো করেই সুন্দর থেকো। 💗

${f||'তোমার একজন আপন মানুষ'}`,
    deep:(n,f)=>`প্রিয় ${n},

কিছু মানুষ জীবনে এসে শব্দের অর্থ বদলে দেয়। তোমার সঙ্গে কাটানো ছোট ছোট মুহূর্তগুলো আমাকে মনে করিয়ে দেয়—ভালোবাসা মানে শুধু বলা নয়, মন দিয়ে শোনা, পাশে থাকা আর একে অপরকে নিজের মতো থাকতে দেওয়া।

আমি চাই আমাদের কথাগুলো সৎ হোক, যত্নটা পারস্পরিক হোক, আর প্রতিটি সিদ্ধান্তে দুজনের অনুভূতির মূল্য থাকুক।

অনেক আন্তরিকতা নিয়ে,
${f||'তোমার একজন আপন মানুষ'} 💜`,
    apology:(n,f)=>`প্রিয় ${n},

আমার কোনো কথা বা কাজে তোমার কষ্ট হয়ে থাকলে আমি আন্তরিকভাবে দুঃখিত। নিজের ভুল বোঝার চেষ্টা করছি, আর শুধু “সরি” বলেই থেমে থাকতে চাই না—আচরণেও পরিবর্তন আনতে চাই।

তুমি যখন স্বচ্ছন্দ বোধ করবে, তখন তোমার কথা শুনতে চাই। তোমাকে তাড়াহুড়ো করে ক্ষমা করতে বলছি না; তোমার অনুভূতি ও সময়কে সম্মান করি।

আন্তরিকভাবে,
${f||'আমি'}`,
    confess:(n,f)=>`প্রিয় ${n},

অনেক দিন ধরে একটা কথা সুন্দর করে বলতে চাইছিলাম। তোমার সঙ্গে কথা বলতে ভালো লাগে, তোমার উপস্থিতি আমার দিনকে আনন্দময় করে। তাই নিজের অনুভূতিটা সৎভাবে জানালাম।

তোমার অনুভূতি আলাদা হলেও আমি সেটাকে সম্মান করব—তোমার ওপর কোনো চাপ নেই। শুধু মনে হলো, কথাটা সত্যি করে বলা উচিত।

— ${f||'একজন শুভাকাঙ্ক্ষী'} 💌`,
    birthday:(n,f)=>`শুভ জন্মদিন, ${n}! 🎂

তোমার নতুন বছরটা হাসি, শান্তি, সুন্দর সুযোগ আর ভালো মানুষের সঙ্গ নিয়ে আসুক। নিজের স্বপ্নগুলোর দিকে এগিয়ে যাও, নিজের যত্ন নিও, আর মনে রেখো—তুমি যেমন, তেমনভাবেই মূল্যবান।

আজকের দিনটা তোমার মতোই সুন্দর হোক!

ভালোবাসা ও শুভকামনায়,
${f||'তোমার একজন আপন মানুষ'} 💗`
  };
  let latestLetter='';
  $('makeLetter').addEventListener('click',()=>{const n=$('letterTo').value.trim()||'প্রিয় মানুষ', f=$('letterFrom').value.trim(), mood=$('letterMood').value;latestLetter=letterTemplates[mood](n,f);$('letterOutput').textContent=latestLetter;$('copyLetter').disabled=false;});
  $('copyLetter').addEventListener('click',async()=>{if(!latestLetter)return;try{await navigator.clipboard.writeText(latestLetter);$('copyLetter').textContent='✓ কপি হয়েছে';}catch(_){$('letterOutput').focus();}setTimeout(()=>$('copyLetter').textContent='▣ চিঠি কপি করো',1500);});

  $('countDays').addEventListener('click',()=>{const raw=$('anniversaryDate').value;if(!raw){$('anniversaryDate').focus();return;}const start=new Date(raw+'T00:00:00');const today=new Date();today.setHours(0,0,0,0);const days=Math.floor((today-start)/86400000);if(days<0){show($('anniversaryResult'),'<b>তারিখটি এখনও আসেনি।</b> 💗');return;}show($('anniversaryResult'),`<div class="score-number">${days.toLocaleString('bn-BD')} দিন</div><div class="result-message">${days===0?'আজই সেই বিশেষ দিন! 💖':`এই বিশেষ দিন থেকে ${days.toLocaleString('bn-BD')} দিন পেরিয়েছে। একসঙ্গে কাটানো মুহূর্তগুলো যত্নে রেখো। 💗`}</div>`);});

  const secretMap={' ':'🤍','া':'🌸','ি':'🌷','ে':'✨','ত':'💗','ম':'🌙','ভ':'💜','ল':'♡','ক':'🌼','র':'⭐','ন':'🫶','য':'💌','স':'🌹','ো':'☁️','আ':'💖','ই':'🦋','ু':'🍀','হ':'🌈','প':'🎀','দ':'🌻','ব':'🩷','গ':'🌺','চ':'🍓','ও':'🌟','য়':'🫧','থ':'🌼','এ':'💫','ং':'💞','ঃ':'💐','খ':'🪷','উ':'🪻','ফ':'🩵','ড':'🎧','জ':'🪄','শ':'🕊️','ছ':'🍒','ঋ':'🌿','অ':'🌱','ঘ':'🍁','ধ':'🧸','ট':'🍬','ড়':'🪻','ঢ়':'🪷','ঔ':'🌠','ঈ':'🪷','ঊ':'🌙','ঐ':'🦄','ৃ':'🍀','ৈ':'🌼','ৌ':'🌸','্':'·'};
  const reverseSecret=Object.fromEntries(Object.entries(secretMap).map(([k,v])=>[v,k]));
  $('encodeSecret').addEventListener('click',()=>{const value=$('secretInput').value;if(!value.trim())return;const encoded=[...value].map(ch=>secretMap[ch]||secretMap[ch.toLowerCase()]||`〔${ch}〕`).join(' ');show($('secretOutput'),`<div>${escapeHTML(encoded)}</div><button class="btn btn-ghost full" id="copySecret">কোড কপি করো</button>`);$('copySecret').addEventListener('click',()=>navigator.clipboard?.writeText(encoded));});
  $('decodeSecret').addEventListener('click',()=>{const value=$('secretInput').value.trim();if(!value)return;const decoded=value.split(/\s+/).map(token=>reverseSecret[token]||token.replace(/^〔|〕$/g,'')).join('');show($('secretOutput'),escapeHTML(decoded||'এই কোডটি চিনতে পারিনি।'));});

  const quizResults={words:'তোমার ভালোবাসার ভাষা সম্ভবত প্রশংসার কথা—সৎ ও আন্তরিক কথায় তুমি যত্ন অনুভব করো। 💌',time:'তোমার কাছে মানসম্মত সময় খুব গুরুত্বপূর্ণ—মনোযোগ দিয়ে একসঙ্গে থাকা তোমাকে আনন্দ দেয়। 🌷',help:'কাজে সাহায্য আর ছোট ছোট যত্ন তোমার কাছে ভালোবাসার সুন্দর প্রকাশ। 💜',gift:'ভাবনা দিয়ে বেছে নেওয়া ছোট্ট উপহার তোমাকে বিশেষ অনুভব করায়। 🎁',touch:'পারস্পরিক সম্মতিতে স্নেহপূর্ণ স্পর্শ তোমার কাছে ভালোবাসার প্রকাশ হতে পারে। 🫶'};
  $('runQuiz').addEventListener('click',()=>show($('quizResult'),escapeHTML(quizResults[$('quizAnswer').value])+'<div class="tiny">এটি মজার আত্ম-অন্বেষণ, বৈজ্ঞানিক মূল্যায়ন নয়।</div>'));

  const dailyItems=['আজ কাউকে আন্তরিকভাবে ধন্যবাদ দাও।','নিজের জন্য ১০ মিনিট বিরতি রাখো।','একজন প্রিয় মানুষকে চাপ না দিয়ে খোঁজ নাও।','আজ নিজের একটি ভালো গুণ লিখে রাখো।','একটি সুন্দর গান শোনো এবং মনটা হালকা করো।','কাউকে একটি সৎ প্রশংসা করো—সে স্বচ্ছন্দ হলে।','আজ মন খারাপ হলে নিজেকে বিশ্রাম নিতে দাও।','নিজের পছন্দের কিছু করে ছোট্ট আনন্দ তৈরি করো।'];
  $('newDaily').addEventListener('click',()=>{$('dailyChallenge').textContent=pick(dailyItems);});

  const quoteItems=['“ভালোবাসা মানে প্রতিদিন নতুন করে একে অপরকে বেছে নেওয়া।”','“যেখানে সম্মান আছে, সেখানেই ভালোবাসা সুন্দর।”','“ছোট্ট যত্নই অনেক সময় সবচেয়ে বড় উপহার।”','“নিজেকে ভালোবাসাও ভালোবাসারই একটি রূপ।”','“সত্যিকারের কাছের মানুষ তোমার কথাও শুনবে, নীরবতাও বুঝতে চাইবে।”','“ভালোবাসা চাপ নয়—নিরাপদে নিজের মতো থাকার জায়গা।”'];
  const savedKey='loveverse-saved-quotes';
  function renderSaved(){let arr=[];try{arr=JSON.parse(localStorage.getItem(savedKey)||'[]')}catch(_){};$('savedQuotes').innerHTML=arr.length?arr.map((q,i)=>`<div class="saved-quote">${escapeHTML(q)} <button class="remove-quote" data-index="${i}" aria-label="লাইন মুছুন">×</button></div>`).join(''):'<div class="tiny">এখনও কোনো লাইন সেভ করা হয়নি।</div>';}
  $('newQuote').addEventListener('click',()=>{$('favoriteQuote').textContent=pick(quoteItems);});
  $('saveQuote').addEventListener('click',()=>{let arr=[];try{arr=JSON.parse(localStorage.getItem(savedKey)||'[]')}catch(_){}const q=$('favoriteQuote').textContent;if(!arr.includes(q))arr.unshift(q);try{localStorage.setItem(savedKey,JSON.stringify(arr.slice(0,20)));}catch(_){}renderSaved();$('saveQuote').textContent='✓ সেভ হয়েছে';setTimeout(()=>$('saveQuote').textContent='♡ সেভ',1300);});
  $('savedQuotes').addEventListener('click',e=>{if(!e.target.matches('.remove-quote'))return;let arr=[];try{arr=JSON.parse(localStorage.getItem(savedKey)||'[]')}catch(_){}arr.splice(Number(e.target.dataset.index),1);try{localStorage.setItem(savedKey,JSON.stringify(arr));}catch(_){}renderSaved();});renderSaved();

})();