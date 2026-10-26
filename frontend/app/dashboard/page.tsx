"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  route: string;
  accent: string;
  status: "LIVE" | "READY" | "BETA";
};

const tools: Tool[] = [
  {
    id: "chat",
    name: "NEXA Chat",
    description:
      "Talk with your private local AI assistant.",
    icon: "✦",
    category: "AI",
    route: "/chat",
    accent: "cyan",
    status: "LIVE",
  },
  {
    id: "code",
    name: "Code Studio",
    description:
      "Write, debug and improve production-ready code.",
    icon: "</>",
    category: "DEVELOP",
    route: "/chat?mode=code",
    accent: "blue",
    status: "LIVE",
  },
  {
    id: "research",
    name: "Deep Research",
    description:
      "Analyze topics and organize complex information.",
    icon: "⌕",
    category: "RESEARCH",
    route: "/chat?mode=research",
    accent: "violet",
    status: "LIVE",
  },
  {
    id: "writer",
    name: "AI Writer",
    description:
      "Create reports, articles, emails and professional content.",
    icon: "Aa",
    category: "CREATE",
    route: "/chat?mode=create",
    accent: "pink",
    status: "LIVE",
  },
  {
    id: "website",
    name: "Website Builder",
    description:
      "Turn an idea into a modern website with AI.",
    icon: "⌘",
    category: "BUILD",
    route: "/chat?mode=create",
    accent: "emerald",
    status: "LIVE",
  },
  {
    id: "documents",
    name: "Document AI",
    description:
      "Upload PDFs and TXT files and ask questions.",
    icon: "◇",
    category: "KNOWLEDGE",
    route: "/documents",
    accent: "emerald",
    status: "LIVE",
  },
  {
    id: "study",
    name: "Study AI",
    description:
      "Learn concepts, generate notes and prepare for exams.",
    icon: "▤",
    category: "LEARN",
    route: "/chat?mode=research",
    accent: "amber",
    status: "LIVE",
  },
  {
    id: "data",
    name: "Data Analyst",
    description:
      "Understand tables, numbers, patterns and datasets.",
    icon: "⌁",
    category: "ANALYZE",
    route: "/chat?mode=think",
    accent: "cyan",
    status: "LIVE",
  },

  // =========================================================
  // MEDIA
  // =========================================================

  {
    id: "image",
    name: "Image Studio",
    description:
      "Generate, edit and transform images with AI.",
    icon: "▧",
    category: "MEDIA",
    route: "/image",
    accent: "fuchsia",
    status: "READY",
  },
  {
    id: "vision",
    name: "Vision AI",
    description:
      "Upload an image and ask NEXA to understand it.",
    icon: "◉",
    category: "MEDIA",
    route: "/vision",
    accent: "cyan",
    status: "READY",
  },
  {
    id: "video",
    name: "Video Studio",
    description:
      "Create scripts, scenes, storyboards and video concepts.",
    icon: "▶",
    category: "MEDIA",
    route: "/video",
    accent: "violet",
    status: "READY",
  },
  {
    id: "design",
    name: "Design Studio",
    description:
      "Create visual concepts, layouts and design directions.",
    icon: "✧",
    category: "MEDIA",
    route: "/design",
    accent: "amber",
    status: "READY",
  },
  {
    id: "media-analyzer",
    name: "Media Analyzer",
    description:
      "Analyze and understand your media files with AI.",
    icon: "⌁",
    category: "MEDIA",
    route: "/media",
    accent: "sky",
    status: "BETA",
  },

  // =========================================================
  // AUDIO
  // =========================================================

  {
    id: "voice",
    name: "Voice Studio",
    description:
      "Create voice workflows and text-to-speech content.",
    icon: "◉",
    category: "AUDIO",
    route: "/voice",
    accent: "emerald",
    status: "READY",
  },
  {
    id: "audio",
    name: "Audio Studio",
    description:
      "Work with speech, recordings and audio content.",
    icon: "♫",
    category: "AUDIO",
    route: "/audio",
    accent: "orange",
    status: "READY",
  },
  {
    id: "music",
    name: "Music Lab",
    description:
      "Develop lyrics, music ideas and sound concepts.",
    icon: "♪",
    category: "AUDIO",
    route: "/music",
    accent: "pink",
    status: "READY",
  },

  // =========================================================
  // THINKING
  // =========================================================

  {
    id: "brainstorm",
    name: "Brainstorm Lab",
    description:
      "Generate ideas, concepts and project directions.",
    icon: "✧",
    category: "THINK",
    route: "/chat?mode=think",
    accent: "yellow",
    status: "LIVE",
  },
  {
    id: "solver",
    name: "Problem Solver",
    description:
      "Break difficult problems into practical steps.",
    icon: "◎",
    category: "THINK",
    route: "/chat?mode=think",
    accent: "rose",
    status: "LIVE",
  },
  {
    id: "summarizer",
    name: "Smart Summarizer",
    description:
      "Turn long content into clear useful summaries.",
    icon: "≡",
    category: "KNOWLEDGE",
    route: "/chat?mode=research",
    accent: "sky",
    status: "LIVE",
  },
  {
    id: "translator",
    name: "Translator",
    description:
      "Translate and improve content across languages.",
    icon: "文",
    category: "LANGUAGE",
    route: "/chat?mode=create",
    accent: "indigo",
    status: "LIVE",
  },
  {
    id: "presentation",
    name: "Presentation AI",
    description:
      "Plan slides, presentations and speaking content.",
    icon: "▥",
    category: "CREATE",
    route: "/chat?mode=create",
    accent: "orange",
    status: "LIVE",
  },
];

const categories = [
  "ALL",
  "AI",
  "DEVELOP",
  "RESEARCH",
  "CREATE",
  "BUILD",
  "KNOWLEDGE",
  "LEARN",
  "ANALYZE",
  "MEDIA",
  "AUDIO",
  "THINK",
  "LANGUAGE",
];

export default function DashboardPage() {
  const [backendOnline, setBackendOnline] =
    useState(false);

  const [documentCount, setDocumentCount] =
    useState(0);

  const [selectedCategory, setSelectedCategory] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  // =========================================================
  // SYSTEM CHECK
  // =========================================================

  useEffect(() => {
    checkBackend();
    loadDocuments();
  }, []);

  async function checkBackend() {
    try {
      const response = await fetch(
        `${API_URL}/health`
      );

      setBackendOnline(response.ok);
    } catch {
      setBackendOnline(false);
    }
  }

  async function loadDocuments() {
    try {
      const response = await fetch(
        `${API_URL}/documents`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setDocumentCount(
        data.documents?.length || 0
      );
    } catch {
      setDocumentCount(0);
    }
  }

  // =========================================================
  // NAVIGATION
  // =========================================================

  function openTool(route: string) {
    window.location.href = route;
  }

  // =========================================================
  // FILTER
  // =========================================================

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const categoryMatch =
        selectedCategory === "ALL" ||
        tool.category === selectedCategory;

      const searchText =
        `${tool.name} ${tool.description} ${tool.category}`
          .toLowerCase();

      const searchMatch =
        searchText.includes(
          search.toLowerCase()
        );

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, search]);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#020508] text-white">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[-100px] top-[-100px] h-[520px] w-[520px] rounded-full bg-cyan-400/[0.045] blur-[150px]" />

        <div className="absolute right-[-120px] top-[10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.035] blur-[170px]" />

        <div className="absolute bottom-[-180px] left-[35%] h-[550px] w-[550px] rounded-full bg-emerald-400/[0.025] blur-[160px]" />

      </div>

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="relative z-30 flex h-[78px] items-center justify-between border-b border-white/[0.06] bg-[#03070a]/90 px-5 backdrop-blur-2xl md:px-8">

        {/* BRAND */}

        <div className="flex items-center gap-3">

          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] font-black text-cyan-300 shadow-[0_0_40px_rgba(34,211,238,.06)]">

            N

          </div>

          <div>

            <div className="text-sm font-black">

              NEXA
              <span className="text-cyan-300">
                .AI
              </span>

            </div>

            <div className="text-[8px] font-semibold tracking-[0.35em] text-slate-600">

              INTELLIGENT WORKSPACE

            </div>

          </div>

        </div>

        {/* STATUS */}

        <div className="flex items-center gap-3">

          <div
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 sm:flex ${
              backendOnline
                ? "border-emerald-400/15 bg-emerald-400/[0.035]"
                : "border-red-400/15 bg-red-400/[0.035]"
            }`}
          >

            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendOnline
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.8)]"
                  : "bg-red-400"
              }`}
            />

            <span
              className={`text-[10px] ${
                backendOnline
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >

              {backendOnline
                ? "SYSTEM ONLINE"
                : "SYSTEM OFFLINE"}

            </span>

          </div>

          <button
            onClick={() =>
              openTool("/chat")
            }
            className="rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:text-white"
          >
            Open NEXA
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="relative z-10 mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:px-10">

        {/* ===================================================
            HERO
        =================================================== */}

        <div className="mb-10">

          <div className="mb-5 flex items-center gap-3">

            <span className="h-px w-8 bg-cyan-300/50" />

            <span className="text-[9px] font-bold tracking-[0.45em] text-cyan-300">

              NEXA INTELLIGENCE OS

            </span>

          </div>

          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

            <div>

              <h1 className="max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.055em] md:text-7xl">

                One workspace.

                <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-400 bg-clip-text text-transparent">

                  Every AI tool.

                </span>

              </h1>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">

                Chat, code, research, create, analyze,
                understand images, work with audio and
                build your own AI-powered workspace.

              </p>

            </div>

            {/* STATS */}

            <div className="grid grid-cols-3 gap-2">

              <div className="min-w-[95px] rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">

                <div className="text-[8px] tracking-[0.25em] text-slate-700">
                  TOOLS
                </div>

                <div className="mt-2 text-2xl font-black">
                  {tools.length}
                </div>

              </div>

              <div className="min-w-[95px] rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">

                <div className="text-[8px] tracking-[0.25em] text-slate-700">
                  DOCS
                </div>

                <div className="mt-2 text-2xl font-black">
                  {documentCount}
                </div>

              </div>

              <div className="min-w-[95px] rounded-2xl border border-white/[0.07] bg-white/[0.018] p-4">

                <div className="text-[8px] tracking-[0.25em] text-slate-700">
                  ENGINE
                </div>

                <div className="mt-2 text-sm font-black text-emerald-300">
                  LOCAL
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ===================================================
            FEATURED TOOLS
        =================================================== */}

        <div className="mb-12 grid gap-4 lg:grid-cols-3">

          {/* NEXA CHAT */}

          <button
            onClick={() =>
              openTool("/chat")
            }
            className="group relative overflow-hidden rounded-[28px] border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[0.07] via-white/[0.018] to-transparent p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 lg:col-span-2"
          >

            <div className="absolute right-[-90px] top-[-90px] h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

            <div className="relative">

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] text-2xl text-cyan-300">
                  ✦
                </div>

                <span className="rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-1 text-[8px] tracking-[0.25em] text-cyan-300">
                  CORE AI
                </span>

              </div>

              <h2 className="mt-8 text-3xl font-black tracking-tight md:text-4xl">
                NEXA Chat
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Your primary AI workspace powered by
                your local Gemma engine. Think, code,
                research, create and solve problems.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">

                <span className="rounded-xl bg-cyan-300 px-5 py-3 text-xs font-bold text-black">
                  Start Chat →
                </span>

                <span className="text-[10px] text-slate-700">
                  LM Studio · Gemma · FastAPI
                </span>

              </div>

            </div>

          </button>

          {/* KNOWLEDGE */}

          <button
            onClick={() =>
              openTool("/documents")
            }
            className="group relative overflow-hidden rounded-[28px] border border-emerald-300/15 bg-gradient-to-br from-emerald-300/[0.055] to-transparent p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30"
          >

            <div className="absolute right-[-70px] top-[-70px] h-52 w-52 rounded-full bg-emerald-400/[0.07] blur-[70px]" />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] text-2xl text-emerald-300">
                  ◇
                </div>

                <span className="text-[9px] text-emerald-300">
                  {documentCount} FILES
                </span>

              </div>

              <h2 className="mt-8 text-2xl font-black">
                Knowledge Vault
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Upload documents and ask NEXA
                questions using your own knowledge.
              </p>

              <div className="mt-8 text-xs font-bold text-emerald-300">
                Open Vault →
              </div>

            </div>

          </button>

        </div>

        {/* ===================================================
            MEDIA HUB
        =================================================== */}

        <div className="mb-12">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <div className="text-[9px] font-bold tracking-[0.35em] text-violet-300">
                MULTIMODAL AI
              </div>

              <h2 className="mt-2 text-2xl font-black">
                Image · Video · Audio
              </h2>

            </div>

            <span className="hidden text-[10px] text-slate-700 sm:block">
              MEDIA INTELLIGENCE
            </span>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {/* IMAGE */}

            <button
              onClick={() =>
                openTool("/image")
              }
              className="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-fuchsia-300/15 bg-gradient-to-br from-fuchsia-400/[0.08] via-transparent to-transparent p-6 text-left transition hover:-translate-y-1 hover:border-fuchsia-300/30"
            >

              <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full bg-fuchsia-400/[0.09] blur-3xl" />

              <div className="relative">

                <div className="text-3xl text-fuchsia-300">
                  ▧
                </div>

                <div className="mt-7 text-xl font-black">
                  Image Studio
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-600">
                  Create and transform visual
                  concepts with AI.
                </p>

                <div className="mt-6 text-[10px] font-bold text-fuchsia-300">
                  OPEN STUDIO →
                </div>

              </div>

            </button>

            {/* VIDEO */}

            <button
              onClick={() =>
                openTool("/video")
              }
              className="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-violet-300/15 bg-gradient-to-br from-violet-400/[0.08] via-transparent to-transparent p-6 text-left transition hover:-translate-y-1 hover:border-violet-300/30"
            >

              <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full bg-violet-400/[0.09] blur-3xl" />

              <div className="relative">

                <div className="text-3xl text-violet-300">
                  ▶
                </div>

                <div className="mt-7 text-xl font-black">
                  Video Studio
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-600">
                  Build scripts, scenes,
                  storyboards and video ideas.
                </p>

                <div className="mt-6 text-[10px] font-bold text-violet-300">
                  OPEN STUDIO →
                </div>

              </div>

            </button>

            {/* AUDIO */}

            <button
              onClick={() =>
                openTool("/audio")
              }
              className="group relative min-h-[220px] overflow-hidden rounded-[26px] border border-orange-300/15 bg-gradient-to-br from-orange-400/[0.08] via-transparent to-transparent p-6 text-left transition hover:-translate-y-1 hover:border-orange-300/30"
            >

              <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full bg-orange-400/[0.08] blur-3xl" />

              <div className="relative">

                <div className="text-3xl text-orange-300">
                  ♫
                </div>

                <div className="mt-7 text-xl font-black">
                  Audio Studio
                </div>

                <p className="mt-2 text-xs leading-6 text-slate-600">
                  Work with voice, recordings,
                  speech and audio content.
                </p>

                <div className="mt-6 text-[10px] font-bold text-orange-300">
                  OPEN STUDIO →
                </div>

              </div>

            </button>

          </div>

        </div>

        {/* ===================================================
            TOOLKIT HEADER
        =================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <div className="text-[9px] font-bold tracking-[0.35em] text-slate-700">
              AI TOOLKIT
            </div>

            <h2 className="mt-2 text-2xl font-black">
              Explore NEXA
            </h2>

          </div>

          {/* SEARCH */}

          <div className="relative w-full lg:w-[320px]">

            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-700">
              ⌕
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search AI tools..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/20"
            />

          </div>

        </div>

        {/* ===================================================
            CATEGORY FILTERS
        =================================================== */}

        <div className="mb-7 flex gap-2 overflow-x-auto pb-2">

          {categories.map(
            (category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`shrink-0 rounded-lg px-4 py-2 text-[9px] font-bold tracking-[0.15em] transition ${
                  selectedCategory ===
                  category
                    ? "bg-cyan-300 text-black"
                    : "border border-white/[0.07] bg-white/[0.018] text-slate-600 hover:text-slate-300"
                }`}
              >
                {category}
              </button>

            )
          )}

        </div>

        {/* ===================================================
            ALL TOOLS
        =================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredTools.map(
            (tool) => (

              <button
                key={tool.id}
                onClick={() =>
                  openTool(tool.route)
                }
                className="group relative min-h-[215px] overflow-hidden rounded-[24px] border border-white/[0.07] bg-white/[0.018] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.028]"
              >

                <div className="absolute right-[-35px] top-[-35px] h-32 w-32 rounded-full bg-cyan-300/[0.025] blur-3xl transition group-hover:bg-cyan-300/[0.07]" />

                <div className="relative">

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-sm font-bold text-cyan-300 transition group-hover:border-cyan-300/20 group-hover:bg-cyan-300/[0.06]">
                      {tool.icon}
                    </div>

                    <div className="flex flex-col items-end gap-2">

                      <span className="text-[8px] tracking-[0.2em] text-slate-700">
                        {tool.category}
                      </span>

                      <span
                        className={`rounded-full px-2 py-1 text-[7px] font-bold tracking-[0.15em] ${
                          tool.status === "LIVE"
                            ? "bg-emerald-400/[0.07] text-emerald-300"
                            : tool.status === "READY"
                              ? "bg-cyan-400/[0.06] text-cyan-300"
                              : "bg-amber-400/[0.06] text-amber-300"
                        }`}
                      >
                        {tool.status}
                      </span>

                    </div>

                  </div>

                  <h3 className="mt-6 text-base font-bold">
                    {tool.name}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-xs leading-5 text-slate-600">
                    {tool.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">

                    <span className="text-[10px] font-semibold text-slate-600 transition group-hover:text-cyan-300">
                      Open tool
                    </span>

                    <span className="text-slate-700 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                      →
                    </span>

                  </div>

                </div>

              </button>

            )
          )}

        </div>

        {/* EMPTY */}

        {filteredTools.length === 0 && (

          <div className="rounded-3xl border border-dashed border-white/[0.08] py-20 text-center">

            <div className="text-3xl text-slate-800">
              ⌕
            </div>

            <div className="mt-4 text-sm font-semibold">
              No tools found
            </div>

            <div className="mt-2 text-xs text-slate-700">
              Try another search or category.
            </div>

          </div>

        )}

        {/* ===================================================
            SYSTEM ARCHITECTURE
        =================================================== */}

        <div className="mt-12 rounded-[28px] border border-white/[0.07] bg-gradient-to-r from-white/[0.025] to-transparent p-6 md:p-8">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div>

              <div className="text-[8px] font-bold tracking-[0.35em] text-slate-700">
                NEXA STACK
              </div>

              <h3 className="mt-3 text-xl font-black">
                Private multimodal intelligence
              </h3>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-600">
                Text intelligence is powered through
                your local NEXA backend and Gemma.
                Media tools are organized as separate
                AI workspaces ready for their respective
                generation and analysis engines.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              {[
                "Next.js",
                "FastAPI",
                "SQLite",
                "LM Studio",
                "Gemma",
                "Vision",
                "Image",
                "Audio",
                "Video",
              ].map((item) => (

                <div
                  key={item}
                  className="rounded-xl border border-white/[0.07] bg-black/20 px-4 py-3 text-[10px] font-semibold text-slate-500"
                >
                  {item}
                </div>

              ))}

            </div>

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-16 pb-8 text-center">

          <div className="text-[8px] font-semibold tracking-[0.45em] text-slate-800">
            NEXA AI · PRIVATE LOCAL INTELLIGENCE · 2026
          </div>

        </footer>

      </section>

    </main>
  );
}