"use client";

import { useRouter } from "next/navigation";

const tools = [
  ["✦", "AI Chat", "Think, ask and explore"],
  ["⌘", "Code Studio", "Build and debug"],
  ["◈", "Website Builder", "Create digital experiences"],
  ["▤", "Document AI", "Understand your files"],
  ["✍", "Writing Studio", "Write and transform"],
  ["⌁", "Research", "Explore knowledge"],
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#020509] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0">

        <div className="absolute left-[-180px] top-[-180px] h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[150px]" />

        <div className="absolute right-[-180px] top-[20%] h-[650px] w-[650px] rounded-full bg-violet-500/10 blur-[160px]" />

        <div className="absolute bottom-[-250px] left-[30%] h-[600px] w-[600px] rounded-full bg-emerald-400/10 blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      {/* NAVBAR */}

      <nav className="relative z-20 flex h-20 items-center justify-between border-b border-white/[0.06] px-6 md:px-12">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-black shadow-[0_0_30px_rgba(34,211,238,.15)]">
            N
          </div>

          <div>
            <div className="font-bold tracking-wide">
              NEXA <span className="text-cyan-400">AI</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-gray-600">
              INTELLIGENT WORKSPACE
            </div>
          </div>

        </div>

        <div className="hidden items-center gap-8 text-sm text-gray-500 md:flex">
          <a href="#tools" className="transition hover:text-white">
            Tools
          </a>

          <a href="#vision" className="transition hover:text-white">
            Vision
          </a>

          <a href="#features" className="transition hover:text-white">
            Features
          </a>

          <a href="#pricing" className="transition hover:text-white">
            Pricing
          </a>
        </div>

        <button
          onClick={() => router.push("/chat")}
          className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105"
        >
          Open NEXA
        </button>

      </nav>

      {/* HERO */}

      <section className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">

        <div className="mb-7 rounded-full border border-cyan-400/20 bg-cyan-400/[0.04] px-5 py-2 text-[10px] tracking-[0.3em] text-cyan-300">
          ✦ THE NEXT GENERATION AI WORKSPACE
        </div>

        <h1 className="max-w-5xl text-6xl font-black leading-[0.95] tracking-[-0.06em] md:text-8xl">

          One intelligence.

          <br />

          <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
            Infinite creation.
          </span>

        </h1>

        <p className="mt-8 max-w-2xl text-base leading-8 text-gray-500 md:text-lg">
          NEXA AI brings conversation, coding, creation,
          research and intelligent tools into one powerful
          digital workspace.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={() => router.push("/chat")}
            className="rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-8 py-4 font-bold text-black shadow-[0_0_40px_rgba(34,211,238,.12)] transition hover:scale-105"
          >
            Start Creating →
          </button>

          <button
            onClick={() => router.push("/tools")}
            className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 font-semibold text-gray-300 backdrop-blur-xl transition hover:border-cyan-400/30 hover:text-white"
          >
            Explore Tools
          </button>

        </div>

        {/* CORE VISUAL */}

        <div className="relative mt-24">

          <div className="absolute inset-[-80px] rounded-full bg-cyan-400/10 blur-[80px]" />

          <div className="relative flex h-40 w-40 items-center justify-center rounded-[48px] border border-cyan-300/20 bg-[#07131b]/90 shadow-[0_0_100px_rgba(34,211,238,.12)]">

            <div className="text-6xl text-cyan-300">
              ✦
            </div>

          </div>

          <div className="absolute -right-24 top-8 rounded-2xl border border-white/10 bg-[#080e15]/90 px-4 py-3 text-left backdrop-blur-xl">
            <div className="text-[9px] tracking-widest text-gray-600">
              CORE
            </div>
            <div className="mt-1 text-xs text-emerald-300">
              ● ONLINE
            </div>
          </div>

          <div className="absolute -left-28 bottom-8 rounded-2xl border border-white/10 bg-[#080e15]/90 px-4 py-3 text-left backdrop-blur-xl">
            <div className="text-[9px] tracking-widest text-gray-600">
              MODE
            </div>
            <div className="mt-1 text-xs text-cyan-300">
              THINK
            </div>
          </div>

        </div>

      </section>

      {/* TOOLS */}

      <section
        id="tools"
        className="relative z-10 mx-auto max-w-7xl px-6 py-24"
      >

        <div className="mb-12">

          <p className="text-[10px] tracking-[0.4em] text-cyan-400">
            NEXA TOOLSPACE
          </p>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Everything you need.
          </h2>

          <p className="mt-4 max-w-xl text-gray-600">
            Multiple intelligent workspaces connected through
            one NEXA experience.
          </p>

        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {tools.map(([icon, title, description]) => (

            <button
              key={title}
              onClick={() => router.push("/tools")}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.045]"
            >

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl transition group-hover:bg-cyan-400/15" />

              <div className="relative">

                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl">
                  {icon}
                </div>

                <h3 className="text-xl font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  {description}
                </p>

                <div className="mt-7 text-xs text-cyan-400 opacity-0 transition group-hover:opacity-100">
                  Explore workspace →
                </div>

              </div>

            </button>

          ))}

        </div>

      </section>

      {/* VISION */}

      <section
        id="vision"
        className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center"
      >

        <p className="text-[10px] tracking-[0.4em] text-violet-300">
          THE NEXA VISION
        </p>

        <h2 className="mt-6 text-4xl font-black md:text-6xl">
          AI should feel like a
          <span className="text-cyan-300"> workspace</span>,
          not another app.
        </h2>

        <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-600">
          NEXA is designed around the idea that intelligence,
          creativity and productivity should exist together
          in one environment.
        </p>

      </section>

      {/* FEATURES */}

      <section
        id="features"
        className="relative z-10 border-y border-white/[0.06] bg-white/[0.01] px-6 py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-6 md:grid-cols-3">

            <Feature
              icon="◉"
              title="One Core"
              text="A connected intelligence layer powering the NEXA ecosystem."
            />

            <Feature
              icon="∞"
              title="Built to Create"
              text="Move from an idea to code, content, websites and documents."
            />

            <Feature
              icon="✦"
              title="Always Evolving"
              text="A growing ecosystem of intelligent tools inside one workspace."
            />

          </div>

        </div>

      </section>

      {/* PRICING PLACEHOLDER */}

      <section
        id="pricing"
        className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center"
      >

        <p className="text-[10px] tracking-[0.4em] text-emerald-300">
          NEXA PLANS
        </p>

        <h2 className="mt-5 text-4xl font-black md:text-5xl">
          Built for the future.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-gray-600">
          Flexible plans and advanced capabilities will be
          introduced as the NEXA platform grows.
        </p>

        <button
          onClick={() => router.push("/chat")}
          className="mt-9 rounded-2xl bg-white px-8 py-4 font-bold text-black transition hover:scale-105"
        >
          Try NEXA Free
        </button>

      </section>

      {/* FOOTER */}

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-10">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-gray-700 md:flex-row">

          <div>
            © 2026 NEXA AI
          </div>

          <div className="tracking-[0.2em]">
            INTELLIGENCE • CREATIVITY • AUTOMATION
          </div>

        </div>

      </footer>

    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7">

      <div className="text-2xl text-cyan-300">
        {icon}
      </div>

      <h3 className="mt-7 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-600">
        {text}
      </p>

    </div>
  );
}