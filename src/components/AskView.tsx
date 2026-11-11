"use client";

import { useState } from "react";
import type { Investigation } from "@/data/investigations";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function AskView({ investigations }: { investigations: Investigation[] }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput("");
    setError(null);
    const next = [...messages, { role: "user" as const, content: q }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-8) }),
      });
      if (res.status === 501) {
        setError("Ask-the-SI needs an LLM key. Set AI_API_KEY (and AI_BASE_URL / AI_MODEL) in .env and restart — everything else works without it.");
        return;
      }
      const data = await res.json();
      const reply = typeof data === "string" ? data : data.content ?? data.message?.content ?? "…";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setError("Could not reach the SI service. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-300">Ask the SI</h2>
        <p className="text-xs text-slate-500 mt-1">
          A chat over the entire Ember Index dataset. The SI is instructed to answer from the curated
          investigations and to cite them. LLM optional — see notice below if unconfigured.
        </p>
      </div>

      {error && (
        <div className="card border-amber-700/40 bg-amber-950/10 text-sm text-amber-200">{error}</div>
      )}

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`card ${m.role === "user" ? "border-slate-700" : "border-orange-500/30"}`}>
            <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-1">{m.role}</p>
            <p className="text-sm whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. Which experiments inform suppression in a 32% oxygen Moon base?"
          className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm outline-none focus:border-orange-500/50"
        />
        <button onClick={send} disabled={busy} className="px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 font-semibold text-sm">
          {busy ? "…" : "Ask"}
        </button>
      </div>
    </div>
  );
}
