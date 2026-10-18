const prompts = {
  romantic: "একটি কোমল, আশাবাদী বাংলা রোমান্টিক ছোটগল্প লেখো।",
  comedy: "একটি পরিষ্কার, মজার বাংলা রোমান্টিক কমেডি ছোটগল্প লেখো।",
  mystery: "একটি হালকা রহস্যময়, নিরাপদ ও কল্পনাপ্রসূত বাংলা ছোটগল্প লেখো।",
  emotional: "একটি আবেগঘন, সহানুভূতিশীল ও আশাবাদী বাংলা ছোটগল্প লেখো।"
};
exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "POST প্রয়োজন" }) };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 503, headers, body: JSON.stringify({ error: "AI সেটআপ করা নেই" }) };
  try {
    const body = JSON.parse(event.body || "{}");
    const clean = (v, fallback) => typeof v === "string" ? v.trim().slice(0, 40) || fallback : fallback;
    const a = clean(body.nameOne, "নীল"), b = clean(body.nameTwo, "মেঘ");
    const mode = Object.prototype.hasOwnProperty.call(prompts, body.mode) ? body.mode : "romantic";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "তুমি বাংলা সৃজনশীল লেখক। পরিষ্কার, মৌলিক, স্বাভাবিক বাংলায় ৩টি ছোট অনুচ্ছেদের একটি গল্প লেখো। ব্যবহারকারীর দেওয়া নাম ব্যবহার করো। বাস্তব ভবিষ্যদ্বাণী বা সত্য ঘটনা বলে দাবি করবে না।" },
          { role: "user", content: `${prompts[mode]}\nচরিত্র: ${a} এবং ${b}। গল্পটি বিনোদনের জন্য।` }
        ],
        temperature: 0.95, max_tokens: 650
      })
    });
    if (!response.ok) {
      console.error("OpenAI story request failed:", response.status);
      return { statusCode: 502, headers, body: JSON.stringify({ error: "AI গল্প এখন তৈরি করা যাচ্ছে না" }) };
    }
    const data = await response.json();
    const story = data.choices?.[0]?.message?.content?.trim();
    if (!story) throw new Error("Empty model response");
    return { statusCode: 200, headers, body: JSON.stringify({ story, source: "openai" }) };
  } catch (err) {
    console.error("Story function error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "গল্প তৈরি করা যায়নি" }) };
  }
};