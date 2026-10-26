"use client";

import { BrainCircuit } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07131F]/70 border-b border-white/10">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}

        <div className="flex items-center gap-3">

          <div className="bg-emerald-500 p-2 rounded-xl">

            <BrainCircuit className="w-6 h-6 text-white"/>

          </div>

          <h1 className="text-2xl font-black tracking-wide">

            NEXA <span className="text-emerald-400">AI</span>

          </h1>

        </div>

        {/* Menu */}

        <div className="hidden md:flex gap-8">

          <a href="#" className="hover:text-emerald-400 transition">
            Home
          </a>

          <a href="#" className="hover:text-emerald-400 transition">
            Features
          </a>

          <a href="#" className="hover:text-emerald-400 transition">
            AI Apps
          </a>

          <a href="#" className="hover:text-emerald-400 transition">
            Pricing
          </a>

        </div>

        {/* Buttons */}

        <div className="flex gap-3">

          <button className="px-5 py-2 rounded-xl border border-white/20 hover:border-emerald-400">

            Login

          </button>

          <button className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl">

            Get Started

          </button>

        </div>

      </nav>

    </header>
  );
}