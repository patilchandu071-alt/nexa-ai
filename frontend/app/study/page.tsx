"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

type Action =
  | "teach"
  | "simple"
  | "notes"
  | "flashcards"
  | "exam";

export default function StudyPage() {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("beginner");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAction, setSelectedAction] =
    useState<string>("");

  async function runAction(action: Action) {
    if (!topic.trim()) {
      setError("Enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSelectedAction(action);

    try {
      const response = await fetch(
        `${API_URL}/study/action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: topic,
            mode: action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Server returned ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Study AI failed."
        );
      }

      setAnswer(data.reply || "");

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to NEXA."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateQuiz() {
    if (!topic.trim()) {
      setError("Enter a topic first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnswer("");
    setSelectedAction("quiz");

    try {
      const response = await fetch(
        `${API_URL}/study/quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: topic,
            number_of_questions: 10,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Server returned ${response.status}`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            "Quiz generation failed."
        );
      }

      setAnswer(data.quiz || "");

    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Quiz generation failed."
      );
    } finally {
      setLoading(false);
    }
  }

  function goDashboard() {
    window.location.href = "/dashboard";
  }

  function goChat() {
    window.location.href = "/chat";
  }

  return (
    <main className="min-h-screen bg-[#020508] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-400/[0.05] blur-[150px]" />

        <div className="absolute -right-40 top-[25%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.04] blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[35%] h-[400px] w-[400px] rounded-full bg-emerald-400/[0.03] blur-[150px]" />

      </div>

      {/* HEADER */}

      <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/[0.06] bg-[#030609]/90 px-5 backdrop-blur-xl md:px-8">

        <div className="flex items-center gap-3">

          <button
            onClick={goDashboard}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] text-slate-500 transition hover:border-cyan-300/20 hover:text-white"
          >
            ←
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.05] text-lg text-cyan-300">
            ✦
          </div>

          <div>
            <div className="text-sm font-black">
              NEXA
              <span className="text-cyan-300">
                .STUDY
              </span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-slate-600">
              PERSONAL AI TUTOR
            </div>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <div className="hidden rounded-full border border-emerald-300/10 bg-emerald-300/[0.02] px-4 py-2 text-[9px] text-emerald-300 sm:block">
            ● NEXA ONLINE
          </div>

          <button
            onClick={goChat}
            className="rounded-xl border border-white/[0.07] px-4 py-2 text-xs text-slate-500 transition hover:text-white"
          >
            NEXA Chat
          </button>

        </div>

      </header>

      {/* CONTENT */}

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-10 md:px-8">

        {/* HERO */}

        <div className="mb-9">

          <div className="text-[9px] font-bold tracking-[0.4em] text-cyan-300">
            INTELLIGENT LEARNING ENGINE
          </div>

          <h1 className="mt-4 text-5xl font-black tracking-[-0.06em] md:text-7xl">
            Learn with
            <span className="block bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-400 bg-clip-text text-transparent">
              NEXA.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
            Give NEXA a topic and choose what you want
            to do with it. Learn, revise, create notes,
            generate flashcards or prepare for your exam.
          </p>

        </div>

        {/* TOP INPUT */}

        <section className="rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-5">

          <div className="flex flex-col gap-5 md:flex-row md:items-end">

            <div className="flex-1">

              <div className="text-[9px] font-bold tracking-[0.3em] text-slate-600">
                STUDY TOPIC
              </div>

              <input
                value={topic}
                onChange={(e) =>
                  setTopic(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runAction("teach");
                  }
                }}
                placeholder="Example: DBMS Normalization"
                className="mt-3 w-full rounded-2xl border border-white/[0.07] bg-black/30 px-5 py-4 text-sm text-white outline-none placeholder:text-slate-700 focus:border-cyan-300/25"
              />

            </div>

            <div className="w-full md:w-48">

              <div className="text-[9px] font-bold tracking-[0.3em] text-slate-600">
                LEVEL
              </div>

              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value)
                }
                className="mt-3 w-full rounded-2xl border border-white/[0.07] bg-[#080d11] px-4 py-4 text-xs text-slate-300 outline-none"
              >
                <option value="beginner">
                  Beginner
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="advanced">
                  Advanced
                </option>
              </select>

            </div>

          </div>

        </section>

        {/* ACTIONS */}

        <section className="mt-7">

          <div className="mb-4 text-[9px] font-bold tracking-[0.3em] text-slate-700">
            WHAT SHOULD NEXA DO?
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <ActionCard
              icon="✦"
              title="Teach Me"
              description="Learn the topic step by step."
              active={selectedAction === "teach"}
              onClick={() =>
                runAction("teach")
              }
            />

            <ActionCard
              icon="◉"
              title="Explain Simply"
              description="Turn difficult concepts into simple explanations."
              active={selectedAction === "simple"}
              onClick={() =>
                runAction("simple")
              }
            />

            <ActionCard
              icon="▤"
              title="Make Notes"
              description="Create clean exam-ready study notes."
              active={selectedAction === "notes"}
              onClick={() =>
                runAction("notes")
              }
            />

            <ActionCard
              icon="◇"
              title="Flashcards"
              description="Create quick revision flashcards."
              active={selectedAction === "flashcards"}
              onClick={() =>
                runAction("flashcards")
              }
            />

            <ActionCard
              icon="⚡"
              title="Exam Mode"
              description="Prepare important questions and revision points."
              active={selectedAction === "exam"}
              onClick={() =>
                runAction("exam")
              }
            />

            <ActionCard
              icon="?"
              title="Quiz Me"
              description="Generate 10 questions and test yourself."
              active={selectedAction === "quiz"}
              purple
              onClick={generateQuiz}
            />

          </div>

        </section>

        {/* ERROR */}

        {error && (

          <div className="mt-6 rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4 text-xs leading-6 text-red-300">
            {error}
          </div>

        )}

        {/* RESPONSE */}

        <section className="mt-6 rounded-[28px] border border-white/[0.07] bg-white/[0.018] p-5">

          <div className="flex items-center justify-between">

            <div className="text-[9px] font-bold tracking-[0.3em] text-slate-700">
              NEXA LEARNING SESSION
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-[9px] text-cyan-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                NEXA IS THINKING
              </div>
            )}

          </div>

          <div className="mt-4 min-h-[400px] rounded-2xl border border-white/[0.06] bg-black/25 p-6">

            {loading ? (

              <div className="flex min-h-[350px] items-center justify-center">

                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] text-2xl text-cyan-300">
                    ✦
                  </div>

                  <div className="mt-6 text-sm text-slate-500">
                    NEXA is preparing your lesson...
                  </div>

                  <div className="mt-2 text-[9px] text-slate-700">
                    Understanding · Organizing · Teaching
                  </div>

                </div>

              </div>

            ) : answer ? (

              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] text-cyan-300">
                    ✦
                  </div>

                  <div>

                    <div className="text-xs font-bold">
                      NEXA
                    </div>

                    <div className="text-[8px] tracking-widest text-slate-700">
                      AI TUTOR
                    </div>

                  </div>

                </div>

                <div className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {answer}
                </div>

                {/* FOLLOW UP ACTIONS */}

                <div className="mt-8 border-t border-white/[0.06] pt-5">

                  <div className="mb-3 text-[8px] font-bold tracking-[0.3em] text-slate-700">
                    CONTINUE LEARNING
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      onClick={() =>
                        runAction("simple")
                      }
                      className="rounded-xl border border-white/[0.07] px-4 py-2 text-[9px] text-slate-500 hover:text-white"
                    >
                      Explain simpler
                    </button>

                    <button
                      onClick={generateQuiz}
                      className="rounded-xl border border-violet-300/10 px-4 py-2 text-[9px] text-violet-300 hover:border-violet-300/30"
                    >
                      Quiz me
                    </button>

                    <button
                      onClick={() =>
                        runAction("flashcards")
                      }
                      className="rounded-xl border border-white/[0.07] px-4 py-2 text-[9px] text-slate-500 hover:text-white"
                    >
                      Make flashcards
                    </button>

                    <button
                      onClick={() =>
                        runAction("exam")
                      }
                      className="rounded-xl border border-white/[0.07] px-4 py-2 text-[9px] text-slate-500 hover:text-white"
                    >
                      Exam mode
                    </button>

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex min-h-[350px] items-center justify-center text-center">

                <div>

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.025] text-3xl text-slate-800">
                    ✦
                  </div>

                  <div className="mt-6 text-sm text-slate-600">
                    Your AI lesson will appear here.
                  </div>

                  <div className="mt-2 text-[9px] text-slate-800">
                    Enter a topic and choose an action.
                  </div>

                </div>

              </div>

            )}

          </div>

        </section>

        {/* FEATURES */}

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <Feature
            title="Personal Tutor"
            text="NEXA adapts explanations to your level."
          />

          <Feature
            title="Exam Ready"
            text="Create revision material and important questions."
          />

          <Feature
            title="Active Learning"
            text="Use quizzes and flashcards instead of passive reading."
          />

          <Feature
            title="One Workspace"
            text="Learn, revise and practice from one place."
          />

        </section>

      </section>

    </main>
  );
}


/* ========================================================
   ACTION CARD
======================================================== */

function ActionCard({
  icon,
  title,
  description,
  active,
  purple,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  active: boolean;
  purple?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-2xl border p-5 text-left transition ${
        active
          ? purple
            ? "border-violet-300/30 bg-violet-300/[0.06]"
            : "border-cyan-300/30 bg-cyan-300/[0.05]"
          : "border-white/[0.06] bg-white/[0.015] hover:border-cyan-300/20 hover:bg-white/[0.025]"
      }`}
    >

      <div className="flex items-center justify-between">

        <div
          className={`text-xl ${
            purple
              ? "text-violet-300"
              : "text-cyan-300"
          }`}
        >
          {icon}
        </div>

        <div className="text-slate-800 transition group-hover:text-cyan-300">
          →
        </div>

      </div>

      <div className="mt-5 text-sm font-bold">
        {title}
      </div>

      <div className="mt-2 text-[10px] leading-5 text-slate-700">
        {description}
      </div>

    </button>
  );
}


/* ========================================================
   FEATURE
======================================================== */

function Feature({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">

      <div className="text-xs font-bold">
        {title}
      </div>

      <div className="mt-2 text-[10px] leading-5 text-slate-700">
        {text}
      </div>

    </div>
  );
}