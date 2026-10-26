"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Signup failed.");
        return;
      }

      setMessage("Account created successfully! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch {
      setError(
        "Cannot connect to NEXA server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020509] text-white">

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">

        <div className="absolute left-[-180px] top-[-180px] h-[550px] w-[550px] rounded-full bg-emerald-400/10 blur-[150px]" />

        <div className="absolute right-[-180px] bottom-[-180px] h-[600px] w-[600px] rounded-full bg-cyan-400/10 blur-[160px]" />

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

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-emerald-300 font-black text-black">
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

      {/* SIGNUP */}

      <section className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/5 text-2xl text-emerald-300">
              ✦
            </div>

            <h1 className="mt-7 text-3xl font-black">
              Create your NEXA.
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              Start building with your intelligent workspace.
            </p>

          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-[#080e15]/90 p-7 shadow-2xl backdrop-blur-2xl">

            <form onSubmit={handleSignup}>

              <label className="text-[9px] tracking-[0.3em] text-gray-600">
                NAME
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-emerald-400/30"
              />

              <label className="mt-6 block text-[9px] tracking-[0.3em] text-gray-600">
                EMAIL
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-emerald-400/30"
              />

              <label className="mt-6 block text-[9px] tracking-[0.3em] text-gray-600">
                PASSWORD
              </label>

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 transition focus:border-emerald-400/30"
              />

              <button
                type="submit"
                disabled={loading}
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-emerald-300 to-cyan-300 py-3.5 font-bold text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating account..."
                  : "Create NEXA Account →"}
              </button>

            </form>

            {/* SUCCESS */}

            {message && (
              <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center text-xs text-emerald-300">
                ✓ {message}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-center text-xs text-red-300">
                {error}
              </div>
            )}

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

              Already have an account?{" "}

              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="text-emerald-300 hover:text-emerald-200"
              >
                Sign in
              </button>

            </p>

          </div>

        </div>

      </section>

    </main>
  );
} 