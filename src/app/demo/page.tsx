"use client";

import { useState } from "react";
import { DEMO_SELLERS } from "@/lib/mock-data";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

function getInitials(name: string) {
  const parts = name.split(" ").slice(0, 2);
  return parts
    .map((p) => (/^\d+$/.test(p) ? p : p[0]))
    .join("")
    .toUpperCase();
}

const AVATAR_COLOR = "from-sky-400 to-sky-600";

export default function DemoPage() {
  const [showSellers, setShowSellers] = useState(false);

  const renderSellerPicker = (className = "") => (
    <div className={`animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-px flex-1 bg-slate-800" />
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          Επιλέξτε Πωλητή
        </span>
        <div className="h-px flex-1 bg-slate-800" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {DEMO_SELLERS.map((seller) => {
          const initials = getInitials(seller.name);
          const color = AVATAR_COLOR;
          return (
            <Link
              key={seller.id}
              href={`/demo/seller/${seller.id}`}
              className="group bg-sky-950 border border-sky-800/50 rounded-xl p-4 hover:border-sky-500/60 hover:bg-sky-900/60 dark:hover:bg-sky-900/60 transition-all duration-150 flex flex-col items-center text-center gap-2.5"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-linear-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-md`}
              >
                {initials}
              </div>
              <p className="text-white text-xs font-semibold leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
                {seller.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Adaptive grid background */}
      <div className="absolute inset-0 bg-grid" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.svg"
            alt="Aura Services Demo"
            width={56}
            height={56}
            className="rounded-xl"
          />
          <span className="font-semibold text-white text-sm tracking-tight">
            Aura Services Demo
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-500 hover:text-slate-200 dark:hover:text-white text-xs sm:text-sm transition-colors flex items-center gap-1 sm:gap-1.5"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Πίσω
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 py-12 max-w-5xl mx-auto w-full">
        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="sm:contents">
            {/* Seller card */}
            <button
              onClick={() => setShowSellers((v) => !v)}
              className={`group text-left bg-slate-900 border rounded-2xl p-8 transition-all duration-200 hover:border-blue-500/40 hover:bg-slate-900/80 ${
                showSellers
                  ? "border-blue-500/60 shadow-lg shadow-blue-500/10"
                  : "border-slate-700/60"
              }`}
            >
              <div className="w-16 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                <svg
                  className="w-8 h-8 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="font-bold text-white text-xl mb-2">
                Πίνακας Πωλητή
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-5">
                Δείτε γραμμές πωλήσεων, φιλτράρετε συναλλαγές και εξάγετε αναφορές
                PDF ως ένας από τους 20 δείγματα Πωλητές.
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${showSellers ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-300"}`}
              >
                {showSellers ? "Απόκρυψη Πωλητών" : "Επιλέξτε Πωλητή"}
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showSellers ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {showSellers && renderSellerPicker("sm:hidden")}
          </div>

          {/* Admin card */}
          <Link
            href="/demo/admin"
            className="group text-left bg-slate-900 border border-slate-700/60 rounded-2xl p-8 transition-all duration-200 hover:border-violet-500/40 hover:bg-slate-900/80 block"
          >
            <div className="w-16 h-16 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
              <svg
                className="w-8 h-8 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="font-bold text-white text-xl mb-2">
              Πλατφόρμα Διαχείρισης
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-5">
              Διαχειριστείτε και τους 20 Πωλητές, δείτε επισκόπηση απόδοσης
              ομάδας και πρόσβαση σε μεμονωμένους πίνακες ελέγχου.
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              Μπείτε στην πλατφόρμα διαχείρισης
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Seller picker — shown when Seller card is clicked */}
        {showSellers && renderSellerPicker("hidden sm:block")}
      </main>
    </div>
  );
}
