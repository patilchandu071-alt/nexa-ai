"use client";

import { useState } from "react";

export default function CodeStudio() {
  const [code, setCode] = useState(
`def main():
    print("Hello from NEXA AI")

if __name__ == "__main__":
    main()`
  );

  const [output, setOutput] = useState(
    "Run your code to see the output here..."
  );

  const [language, setLanguage] = useState("Python");
  const [running, setRunning] = useState(false);

  function runCode() {
    setRunning(true);

    setTimeout(() => {
      setOutput(
`NEXA CODE STUDIO

Language: ${language}

✓ Code received
✓ Workspace ready

Execution engine will be connected to NEXA Core next.`
      );

      setRunning(false);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#020509] text-white">

      {/* HEADER */}

      <header className="flex h-20 items-center justify-between border-b border-white/[0.07] bg-black/30 px-6 backdrop-blur-xl">

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-black"
          >
            N
          </button>

          <div>

            <div className="font-bold">
              NEXA <span className="text-cyan-400">CODE</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-gray-600">
              CODE STUDIO
            </div>

          </div>

        </div>

        <button
          onClick={() => {
            window.location.href = "/tools";
          }}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition hover:border-cyan-400/30 hover:text-white"
        >
          ← Tools
        </button>

      </header>

      {/* WORKSPACE */}

      <section className="flex min-h-[calc(100vh-80px)] flex-col">

        {/* TOP BAR */}

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] px-6 py-4">

          <div>

            <p className="text-[9px] tracking-[0.35em] text-gray-600">
              DEVELOPMENT WORKSPACE
            </p>

            <h1 className="mt-1 text-xl font-bold">
              Build with NEXA
            </h1>

          </div>

          <div className="flex items-center gap-2">

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#080e15] px-4 py-2.5 text-sm text-gray-300 outline-none"
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>C++</option>
            </select>

            <button
              onClick={runCode}
              disabled={running}
              className="rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-2.5 text-sm font-bold text-black transition hover:scale-105 disabled:opacity-40"
            >
              {running ? "Running..." : "▶ Run"}
            </button>

          </div>

        </div>

        {/* MAIN */}

        <div className="grid flex-1 lg:grid-cols-[1fr_380px]">

          {/* EDITOR */}

          <section className="flex min-h-[650px] flex-col border-r border-white/[0.06]">

            <div className="flex h-12 items-center justify-between border-b border-white/[0.06] px-5">

              <div className="flex items-center gap-2">

                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

              </div>

              <span className="text-[9px] tracking-[0.3em] text-gray-700">
                NEXA EDITOR
              </span>

            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none bg-[#05090e] p-6 font-mono text-sm leading-7 text-cyan-100 outline-none"
            />

          </section>

          {/* SIDE PANEL */}

          <aside className="bg-[#060b11]">

            {/* AI ASSISTANT */}

            <div className="border-b border-white/[0.06] p-6">

              <p className="text-[9px] tracking-[0.35em] text-cyan-400">
                NEXA ASSIST
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Code Intelligence
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Use NEXA to understand, improve and debug your code.
              </p>

              <div className="mt-5 grid gap-2">

                <button className="rounded-xl border border-white/10 px-4 py-3 text-left text-xs text-gray-400 transition hover:border-cyan-400/30 hover:text-white">
                  ✦ Explain Code
                </button>

                <button className="rounded-xl border border-white/10 px-4 py-3 text-left text-xs text-gray-400 transition hover:border-cyan-400/30 hover:text-white">
                  ⚙ Improve Code
                </button>

                <button className="rounded-xl border border-white/10 px-4 py-3 text-left text-xs text-gray-400 transition hover:border-cyan-400/30 hover:text-white">
                  ◌ Find Bugs
                </button>

              </div>

            </div>

            {/* OUTPUT */}

            <div className="p-6">

              <div className="flex items-center justify-between">

                <p className="text-[9px] tracking-[0.35em] text-gray-600">
                  TERMINAL
                </p>

                <button
                  onClick={() => setOutput("")}
                  className="text-[10px] text-gray-700 hover:text-white"
                >
                  Clear
                </button>

              </div>

              <pre className="mt-4 min-h-[250px] whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-black/30 p-5 font-mono text-xs leading-6 text-gray-400">
                {output}
              </pre>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}