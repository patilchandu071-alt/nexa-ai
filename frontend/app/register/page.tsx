"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-3">Create Account</h1>
        <p className="mb-6 text-gray-500">
          Registration is not available yet. Please sign in if you already have an account.
        </p>
        <Link
          href="/login"
          className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-white"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}
