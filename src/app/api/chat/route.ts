import { NextResponse } from "next/server";
import { INVESTIGATIONS } from "@/data/investigations";

// Ask-the-SI proxy. Keeps the key server-side. Works with any OpenAI-compatible
// endpoint configured via AI_API_KEY / AI_BASE_URL / AI_MODEL in .env.
export async function POST(req: Request) {
  const key = process.env.AI_API_KEY;
  if (!key || key.startsWith("paste_")) {
    return NextResponse.json({ error: "LLM not configured" }, { status: 501 });
  }
  const base = process.env.AI_BASE_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  const { messages } = await req.json();
  const system = [
    "You are the SI of Ember Index, a NASA Space Apps 2026 project on spacecraft fire safety.",
    "Answer ONLY from the dataset below (curated NASA PSI microgravity combustion investigations).",
    "Cite investigations by name in every factual claim. If the dataset lacks the answer, say so and",
    "point to the relevant gap (e.g. no partial-gravity data until LUCI/FM2). Be concise.",
    "",
    "DATASET:",
    JSON.stringify(INVESTIGATIONS),
  ].join("\n");

  try {
    const r = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        messages: [{ role: "system", content: system }, ...messages],
      }),
    });
    const j = await r.json();
    const content = j?.choices?.[0]?.message?.content ?? JSON.stringify(j);
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "upstream failure" }, { status: 502 });
  }
}
