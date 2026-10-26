"use client";

import { useState } from "react";

export default function WebsiteBuilder() {
  const [idea, setIdea] = useState("");
  const [generated, setGenerated] = useState(false);

  function generate() {
    if (!idea.trim()) return;
    setGenerated(true);
  }

  return (
    <main className="min-h-screen bg-[#020509] text-white">

      {/* HEADER */}

      <header className="flex h-20 items-center justify-between border-b border-white/[0.07] bg-black/30 px-6 backdrop-blur-xl">

        <div className="flex items-center gap-3">

          <button
            onClick={() => (window.location.href = "/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-black"
          >
            N
          </button>

          <div>
            <div className="font-bold">
              NEXA <span className="text-cyan-400">WEB</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-gray-600">
              WEBSITE BUILDER
            </div>
          </div>

        </div>

        <button
          onClick={() => (window.location.href = "/tools")}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 hover:border-cyan-400/30 hover:text-white"
        >
          ← Tools
        </button>

      </header>

      {/* WORKSPACE */}

      <section className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[360px_1fr]">

        {/* LEFT PANEL */}

        <aside className="border-r border-white/[0.06] bg-[#05090e] p-6">

          <p className="text-[9px] tracking-[0.4em] text-cyan-400">
            CREATE
          </p>

          <h1 className="mt-3 text-3xl font-black">
            Build your website.
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            Describe the website you want. NEXA will
            turn your idea into a visual concept.
          </p>

          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: Modern portfolio for a Python developer..."
            className="mt-7 h-44 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-sm leading-6 text-gray-300 outline-none placeholder:text-gray-700 focus:border-cyan-400/30"
          />

          <button
            onClick={generate}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 py-3.5 font-bold text-black transition hover:scale-[1.02]"
          >
            ✦ Generate
          </button>

          <div className="mt-8">

            <p className="text-[9px] tracking-[0.35em] text-gray-700">
              DESIGN
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">

              <button className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-cyan-300">
                Modern
              </button>

              <button className="rounded-xl border border-white/10 p-3 text-xs text-gray-500">
                Minimal
              </button>

              <button className="rounded-xl border border-white/10 p-3 text-xs text-gray-500">
                Creative
              </button>

              <button className="rounded-xl border border-white/10 p-3 text-xs text-gray-500">
                Business
              </button>

            </div>

          </div>

        </aside>

        {/* PREVIEW */}

        <section className="bg-[#020509] p-5 lg:p-8">

          <div className="mb-5 flex items-center justify-between">

            <div>
              <p className="text-[9px] tracking-[0.35em] text-gray-600">
                LIVE PREVIEW
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Your Website
              </h2>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-[10px] text-emerald-300">
              Preview
            </span>

          </div>

          <div className="min-h-[680px] overflow-hidden rounded-3xl border border-white/10 bg-[#080d13] shadow-2xl">

            {/* BROWSER */}

            <div className="flex h-12 items-center gap-2 border-b border-white/10 px-4">

              <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

              <div className="ml-4 flex-1 rounded-lg bg-black/30 px-4 py-1.5 text-[10px] text-gray-700">
                yourwebsite.nexa
              </div>

            </div>

            {generated ? (

              <div className="min-h-[628px] bg-gradient-to-b from-[#07151c] to-[#03070b]">

                <nav className="flex items-center justify-between px-8 py-6">

                  <div className="font-bold">
                    NEXA<span className="text-cyan-300">Studio</span>
                  </div>

                  <div className="hidden gap-7 text-xs text-gray-500 md:flex">
                    Home
                    About
                    Services
                    Contact
                  </div>

                  <button className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black">
                    Get Started
                  </button>

                </nav>

                <div className="flex min-h-[520px] flex-col items-center justify-center px-8 text-center">

                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[9px] tracking-[0.3em] text-cyan-300">
                    YOUR NEW WEBSITE
                  </div>

                  <h1 className="mt-7 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                    {idea}
                  </h1>

                  <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500">
                    A premium digital experience created
                    with the NEXA Website Builder.
                  </p>

                  <div className="mt-8 flex gap-3">

                    <button className="rounded-xl bg-cyan-300 px-6 py-3 text-sm font-bold text-black">
                      Explore
                    </button>

                    <button className="rounded-xl border border-white/10 px-6 py-3 text-sm text-gray-400">
                      Learn More
                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex min-h-[628px] flex-col items-center justify-center text-center">

                <div className="relative">

                  <div className="absolute inset-[-30px] rounded-full bg-cyan-400/10 blur-3xl" />

                  <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/5 text-4xl text-cyan-300">
                    ◈
                  </div>

                </div>

                <h3 className="mt-8 text-2xl font-bold">
                  Start with an idea
                </h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                  Describe your website on the left and
                  NEXA will create a visual preview.
                </p>

              </div>

            )}

          </div>

        </section>

      </section>

    </main>
  );
}