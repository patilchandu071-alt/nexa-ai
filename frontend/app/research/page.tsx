"use client";

import { useState } from "react";

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function research() {
    if (!topic.trim() || loading) return;

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Research and explain this topic clearly:

${topic}

Give:
1. Overview
2. Important concepts
3. Key points
4. Practical applications
5. Advantages
6. Limitations
7. Future possibilities`,
          mode: "Research",
        }),
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();
      setResult(data.reply);
    } catch {
      setResult(
        "NEXA connection is unavailable. Please make sure the FastAPI backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020509] text-white">

      {/* HEADER */}

      <header className="flex h-20 items-center justify-between border-b border-white/[0.07] bg-black/30 px-6 backdrop-blur-xl">

        <div className="flex items-center gap-3">

          <button
            onClick={() => (window.location.href = "/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-cyan-300 font-black text-black"
          >
            N
          </button>

          <div>
            <div className="font-bold">
              NEXA <span className="text-amber-300">RESEARCH</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-gray-600">
              RESEARCH STUDIO
            </div>
          </div>

        </div>

        <button
          onClick={() => (window.location.href = "/tools")}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:border-amber-400/30 hover:text-white"
        >
          ← Tools
        </button>

      </header>

      {/* CONTENT */}

      <section className="mx-auto max-w-6xl px-6 py-12">

        <div className="mb-10">

          <p className="text-[10px] tracking-[0.4em] text-amber-300">
            KNOWLEDGE EXPLORATION
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.04em]">
            Explore deeper.
          </h1>

          <p className="mt-5 max-w-2xl text-gray-500">
            Ask NEXA about a topic and receive a structured
            explanation inside your research workspace.
          </p>

        </div>

        {/* SEARCH */}

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5">

          <div className="flex flex-col gap-3 md:flex-row">

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  research();
                }
              }}
              placeholder="What do you want to research?"
              className="flex-1 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none placeholder:text-gray-700 focus:border-amber-400/30"
            />

            <button
              onClick={research}
              disabled={!topic.trim() || loading}
              className="rounded-2xl bg-gradient-to-r from-amber-300 to-cyan-300 px-7 py-4 font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-30"
            >
              {loading ? "Researching..." : "🔎 Research"}
            </button>

          </div>

          <div className="mt-4 flex flex-wrap gap-2">

            {[
              "Artificial Intelligence",
              "Python",
              "Machine Learning",
              "Web Development",
              "Cybersecurity",
            ].map((item) => (

              <button
                key={item}
                onClick={() => {
                  setTopic(item);
                }}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-gray-500 transition hover:border-amber-400/30 hover:text-amber-300"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        {/* RESULT */}

        <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02]">

          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-5">

            <div>

              <p className="text-[9px] tracking-[0.35em] text-gray-600">
                NEXA RESEARCH
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Research Result
              </h2>

            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[9px] text-emerald-300">
              AI POWERED
            </span>

          </div>

          <div className="min-h-[430px] p-6">

            {loading ? (

              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">

                <div className="flex gap-1">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300 [animation-delay:150ms]" />

                  <span className="h-2 w-2 animate-bounce rounded-full bg-amber-300 [animation-delay:300ms]" />

                </div>

                <p className="mt-5 text-sm text-gray-500">
                  NEXA is researching your topic...
                </p>

              </div>

            ) : result ? (

              <div className="whitespace-pre-wrap text-sm leading-8 text-gray-300">
                {result}
              </div>

            ) : (

              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-amber-400/20 bg-amber-400/5 text-3xl text-amber-300">
                  ⌁
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  Start your research
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                  Enter a topic above and let NEXA organize
                  the information for you.
                </p>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
}