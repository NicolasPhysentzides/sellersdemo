import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const FEATURES = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    color: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    title: "Ζωντανά Αναλυτικά",
    points: [
      "Άμεση ενημέρωση KPI και γραφημάτων καθώς φιλτράρετε.",
      "Ορατότητα σε πραγματικό χρόνο για γρήγορες αποφάσεις.",
    ],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20",
    title: "Διαχείριση Ομάδας",
    points: [
      "Ορατότητα σε κάθε Πωλητή.",
      "Πίνακες ελέγχου ανά Πωλητή και επισκόπηση ομάδας.",
    ],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "Αναφορές PDF",
    points: [
      "Εξαγωγή σε PDF με ένα κλικ.",
      "Έτοιμο για εκτύπωση και κοινοποίηση.",
    ],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
    ),
    color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "Έξυπνο Φιλτράρισμα",
    points: [
      "Φιλτράρισμα κατά ημερομηνία, πελάτη ή προϊόν.",
      "Αποτελέσματα σε πραγματικό χρόνο.",
    ],
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Adaptive grid background */}
      <div className="absolute inset-0 bg-grid" />
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/8 dark:bg-violet-600/6 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/60 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="Aura Services"
            width={80}
            height={80}
            className="rounded-xl"
          />
          <span className="font-semibold text-white text-sm tracking-tight">
            Aura Services
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.theauraservices.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-200 dark:hover:text-white text-sm transition-colors"
          >
            theauraservices.com ↗
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center px-4">
        {/* Hero */}
        <section className="flex flex-col items-center text-center max-w-2xl pt-16 pb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">Απόδοση Πωλητών</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
            Όλα σε μία πλατφόρμα — απόδοση πωλητών και διαχείριση ομάδας.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2.5 bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 text-sm"
            >
              Δείτε το Demo
              <svg
                className="w-4 h-4"
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
            </Link>
          </div>
        </section>

        {/* Feature grid */}
        <section className="w-full max-w-4xl pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-slate-700 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.color}`}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {f.title}
                  </h3>
                  <ul className="text-xs text-slate-500 leading-relaxed space-y-1 list-disc list-inside">
                    {f.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-800/60 py-5 text-center text-slate-500 text-xs flex flex-col items-center gap-1">
        <span>
          © {new Date().getFullYear()} Aura Services. Με επιφύλαξη παντός
          δικαιώματος.
        </span>
        <a
          href="https://www.theauraservices.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-400 transition-colors"
        >
          theauraservices.com
        </a>
      </footer>
    </div>
  );
}
