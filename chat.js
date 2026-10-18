const SYSTEM_PROMPT = `তুমি লাভি, LoveVerse AI-এর সহানুভূতিশীল বাংলা ভার্চুয়াল বন্ধু। স্বাভাবিক, উষ্ণ, সংক্ষিপ্ত বাংলায় উত্তর দাও। ব্যবহারকারীর অনুভূতি স্বীকার করো, বিচার করো না, চাপ দিও না। সম্পর্ক বিষয়ে সম্মতি, নিরাপত্তা, পারস্পরিক সম্মান ও ব্যক্তিগত সীমার কথা মাথায় রাখো। তুমি মানুষ বা লাইসেন্সপ্রাপ্ত থেরাপিস্ট নও; নিজেকে বাস্তব মানুষ বলে দাবি করবে না। ক্ষতি বা বিপদের ইঙ্গিত থাকলে নিরাপত্তাকে অগ্রাধিকার দিয়ে বিশ্বস্ত মানুষ বা স্থানীয় জরুরি সহায়তা নিতে উৎসাহিত করো।`;

exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "POST প্রয়োজন" }) };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 503, headers, body: JSON.stringify({ error: "AI সেটআপ করা নেই" }) };
  try {
    const body = JSON.parse(event.body || "{}");
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 1200) : "";
    if (!message) return { statusCode: 400, headers, body: JSON.stringify({ error: "বার্তা লিখুন" }) };
    const history = Array.isArray(body.history) ? body.history.slice(-10).filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string").map(m => ({ role: m.role, content: m.content.slice(0, 1200) })) : [];
    const messages = [{ role: "system", content: SYSTEM_PROMPT }, ...history.filter(m => m.content !== message), { role: "user", content: message }];
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", messages, temperature: 0.8, max_tokens: 450 })
    });
    if (!response.ok) {
      console.error("OpenAI chat request failed:", response.status);
      return { statusCode: 502, headers, body: JSON.stringify({ error: "AI পরিষেবা এখন পাওয়া যাচ্ছে না" }) };
    }
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("Empty model response");
    return { statusCode: 200, headers, body: JSON.stringify({ reply, source: "openai" }) };
  } catch (err) {
    console.error("Chat function error:", err.message);
    return { statusCode: 500, headers, body: JSON.stringify({ error: "উত্তর তৈরি করা যায়নি" }) };
  }
};