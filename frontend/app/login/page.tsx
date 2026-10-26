"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // Authentication will be connected later.
    console.log("Login:", email);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020509] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[-180px] top-[-180px] h-[550px] w-[550px] rounded-full bg-cyan-400/10 blur-[150px]" />

        <div className="absolute right-[-180px] bottom-[-180px] h-[600px] w-[600px] rounded-full bg-violet-500/10 blur-[160px]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

      </div>

      {/* LOGO */}

      <header className="absolute left-0 right-0 top-0 z-20 flex h-20 items-center px-6 md:px-10">

        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-3"
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-black shadow-[0_0_30px_rgba(34,211,238,.12)]">
            N
          </div>

          <div className="text-left">

            <div className="font-bold">
              NEXA <span className="text-cyan-400">AI</span>
            </div>

            <div className="text-[8px] tracking-[0.35em] text-gray-600">
              INTELLIGENT WORKSPACE
            </div>

          </div>

        </button>

      </header>

      {/* LOGIN */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/5 text-2xl text-cyan-300 shadow-[0_0_50px_rgba(34,211,238,.08)]">
              ✦
            </div>

            <h1 className="mt-7 text-3xl font-black">
              Welcome back.
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Enter your details to continue to NEXA AI.
            </p>

          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#080e15]/90 p-7 shadow-2xl backdrop-blur-2xl">

            <form onSubmit={handleLogin}>

              <label className="text-[9px] tracking-[0.3em] text-gray-600">
                EMAIL
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-cyan-400/30"
              />

              <div className="mt-6 flex items-center justify-between">

                <label className="text-[9px] tracking-[0.3em] text-gray-600">
                  PASSWORD
                </label>

                <button
                  type="button"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </button>

              </div>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-cyan-400/30"
              />

              <button
                type="submit"
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-300 to-emerald-300 py-3.5 font-bold text-black transition hover:scale-[1.01]"
              >
                Continue to NEXA →
              </button>

            </form>

            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[0.06]" />

              <span className="text-[9px] text-gray-700">
                OR
              </span>

              <div className="h-px flex-1 bg-white/[0.06]" />

            </div>

            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] py-3.5 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
            >
              Continue with Google
            </button>

            <p className="mt-7 text-center text-xs text-gray-600">

              Don't have an account?{" "}

              <button
                type="button"
                onClick={() => (window.location.href = "/signup")}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Create account
              </button>

            </p>

          </div>

          <p className="mt-6 text-center text-[9px] tracking-[0.2em] text-gray-700">
            NEXA AI • INTELLIGENCE • CREATIVITY • AUTOMATION
          </p>

        </div>

      </section>

    </main>
  );
}