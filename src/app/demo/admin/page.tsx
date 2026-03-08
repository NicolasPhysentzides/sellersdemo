"use client";

import { useMemo, useState } from "react";
import {
  DEMO_SELLERS,
  DEMO_SALES_LINES,
  TOTAL_DEMO_LINES,
  TOTAL_DEMO_VALUE,
} from "@/lib/mock-data";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

// ── Constants & helpers ────────────────────────────────────────
const DELPHI_EPOCH = new Date(1899, 11, 30).getTime();
const MONTHS_SHORT = [
  "Ιαν",
  "Φεβ",
  "Μάρ",
  "Απρ",
  "Μάι",
  "Ιουν",
  "Ιουλ",
  "Αυγ",
  "Σεπ",
  "Οκτ",
  "Νοέ",
  "Δεκ",
];

function delphiToDate(d: number): Date {
  return new Date(DELPHI_EPOCH + d * 86400000);
}

function fmtCurrency(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(2)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

function getInitials(name: string) {
  const parts = name.split(" ").slice(0, 2);
  return parts
    .map((p) => (/^\d+$/.test(p) ? p : p[0]))
    .join("")
    .toUpperCase();
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function getReportWindow() {
  const now = new Date();
  const endMonth0 = now.getMonth();
  const endYear = now.getFullYear();
  const startMonth0 = (endMonth0 + 1) % 12;
  const startYear = endMonth0 === 11 ? endYear : endYear - 1;
  return {
    label: `${MONTHS_SHORT[startMonth0]} ${startYear} – ${MONTHS_SHORT[endMonth0]} ${endYear}`,
    startMonth0,
    startYear,
    endMonth0,
    endYear,
  };
}

// ── Types ──────────────────────────────────────────────────────
interface SellerStats {
  seller: (typeof DEMO_SELLERS)[0];
  lineCount: number;
  revenue: number;
  uniqueCustomers: number;
  uniqueItems: number;
  avgLineValue: number;
  revenueRank: number;
  perf: "top" | "strong" | null;
}

// ── Team Monthly Chart ─────────────────────────────────────────
function TeamRevenueChart({
  data,
}: {
  data: { label: string; revenue: number; lines: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 800,
    H = 160;
  const pad = { t: 16, b: 30, l: 8, r: 8 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const n = data.length;
  const maxRev = Math.max(...data.map((d) => d.revenue), 1);

  const pts = data.map((d, i) => ({
    x: pad.l + (n < 2 ? iW / 2 : (i / (n - 1)) * iW),
    y: pad.t + iH - (d.revenue / maxRev) * iH,
    ...d,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${pts[n - 1].x.toFixed(1)},${(pad.t + iH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + iH).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 160 }}
      onMouseLeave={() => setHovered(null)}
    >
      <defs>
        <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + iH * (1 - t)}
          y2={pad.t + iH * (1 - t)}
          style={{ stroke: "var(--chart-grid-stroke)" }}
          strokeWidth="1"
        />
      ))}

      <path d={areaPath} fill="url(#adminRevGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#38bdf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {hovered !== null && (
        <line
          x1={pts[hovered].x}
          x2={pts[hovered].x}
          y1={pad.t}
          y2={pad.t + iH}
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.4"
        />
      )}

      {pts.map((p, i) => {
        const isHov = hovered === i;
        const tx = Math.min(Math.max(p.x, 80), W - 80);
        const ty = Math.max(p.y - 14, pad.t + 2);
        return (
          <g key={i}>
            <rect
              x={p.x - iW / n / 2}
              y={pad.t}
              width={iW / n}
              height={iH}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              style={{ cursor: "crosshair" }}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={isHov ? 5 : 3.5}
              stroke="#38bdf8"
              strokeWidth="2"
              style={{ fill: isHov ? "#38bdf8" : "var(--chart-dot-inactive)" }}
            />
            <text
              x={p.x}
              y={H - 5}
              textAnchor="middle"
              fontSize="9.5"
              style={{ fill: isHov ? "var(--chart-label-active)" : "var(--chart-label-inactive)" }}
            >
              {p.label}
            </text>
            {isHov && (
              <g>
                <rect
                  x={tx - 80}
                  y={ty - 16}
                  width={160}
                  height={22}
                  rx="5"
                  ry="5"
                  style={{ fill: "var(--chart-tooltip-bg)", stroke: "var(--chart-tooltip-border)" }}
                  strokeWidth="1"
                />
                <text
                  x={tx}
                  y={ty - 1}
                  textAnchor="middle"
                  fontSize="10"
                  style={{ fill: "var(--chart-tooltip-text)" }}
                  fontWeight="600"
                >
                  {fmtCurrency(p.revenue)} · {p.lines} γραμμές
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Stat card ──────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  colorClass = "border-slate-700/60",
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  colorClass?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-slate-900 border rounded-2xl p-5 flex flex-col gap-2 ${colorClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

// ── Performance badge ──────────────────────────────────────────
function PerfBadge({ perf }: { perf: "top" | "strong" | null }) {
  if (perf === "top")
    return (
      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
        ★ Κορυφή
      </span>
    );
  if (perf === "strong")
    return (
      <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
        On Target
      </span>
    );
  return null;
}

// ── Main page ──────────────────────────────────────────────────
export default function DemoAdminPage() {
  const {
    label: reportPeriod,
    startMonth0,
    startYear,
    endMonth0,
    endYear,
  } = getReportWindow();

  const { sellerStats, monthly, topSeller } = useMemo(() => {
    // Per-seller stats
    const stats: SellerStats[] = DEMO_SELLERS.map((seller) => {
      const lines = DEMO_SALES_LINES[seller.spCode] ?? [];
      const revenue = lines.reduce((s, l) => s + (l.line_value ?? 0), 0);
      const uniqueCustomers = new Set(lines.map((l) => String(l.customer_code)))
        .size;
      const uniqueItems = new Set(lines.map((l) => l.item_code)).size;
      const avgLineValue = lines.length > 0 ? revenue / lines.length : 0;
      return {
        seller,
        lineCount: lines.length,
        revenue,
        uniqueCustomers,
        uniqueItems,
        avgLineValue,
        revenueRank: 0,
        perf: null as "top" | "strong" | null,
      };
    });

    // Assign ranks and perf tiers
    const byRevenue = [...stats].sort((a, b) => b.revenue - a.revenue);
    byRevenue.forEach((s, i) => {
      s.revenueRank = i + 1;
    });
    const avgRev = TOTAL_DEMO_VALUE / DEMO_SELLERS.length;
    stats.forEach((s) => {
      if (s.revenue >= avgRev * 1.12) s.perf = "top";
      else if (s.revenue >= avgRev * 0.88) s.perf = "strong";
    });

    const topSeller = byRevenue[0];

    // Monthly team totals
    const allLines = DEMO_SELLERS.flatMap(
      (seller) => DEMO_SALES_LINES[seller.spCode] ?? [],
    );
    const monthMap: Record<string, { revenue: number; lines: number }> = {};
    for (const line of allLines) {
      if (!line.trndate_line) continue;
      const d = delphiToDate(line.trndate_line);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthMap[key]) monthMap[key] = { revenue: 0, lines: 0 };
      monthMap[key].revenue += line.line_value ?? 0;
      monthMap[key].lines++;
    }

    const monthly = Array.from({ length: 12 }, (_, i) => {
      const month0 = (startMonth0 + i) % 12;
      const year = startMonth0 + i >= 12 ? endYear : startYear;
      const key = `${year}-${month0}`;
      const data = monthMap[key] ?? { revenue: 0, lines: 0 };
      return {
        label: MONTHS_SHORT[month0],
        revenue: data.revenue,
        lines: data.lines,
      };
    });

    return { sellerStats: stats, monthly, topSeller };
  }, [startMonth0, startYear, endMonth0, endYear]);

  const [sellerSort, setSellerSort] = useState<"name" | "revenue">("name");
  const sellersSorted = useMemo(() => {
    const arr = [...sellerStats];
    if (sellerSort === "name") {
      arr.sort((a, b) => a.seller.name.localeCompare(b.seller.name));
    } else {
      arr.sort((a, b) => b.revenue - a.revenue);
    }
    return arr;
  }, [sellerStats, sellerSort]);

  const avgRevenuePerSeller = TOTAL_DEMO_VALUE / DEMO_SELLERS.length;
  const peakMonth = monthly.reduce(
    (best, m) => (m.revenue > best.revenue ? m : best),
    monthly[0],
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Demo banner */}
      <div className="bg-violet-500/10 border-b border-violet-500/20 px-6 py-2 flex items-center justify-center gap-2 text-xs text-violet-600 dark:text-violet-400/80">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 shrink-0" />
        <span>
          Πλατφόρμα Διαχείρισης —{" "}
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            Επισκόπηση Διαχείρισης
          </span>
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Aura Services"
              width={96}
              height={96}
              className="rounded-xl mt-1"
            />
            <span className="font-semibold text-white tracking-tight">
              Aura Services
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-slate-500 text-sm hidden sm:inline">
              Πλατφόρμα Διαχείρισης
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 dark:hover:text-white transition-colors border border-slate-700/60 hover:border-slate-600 px-3.5 py-1.5 rounded-xl"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Πίσω
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Page title */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Επισκόπηση Πωλητών</h1>
          </div>
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            {reportPeriod}
          </span>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Σύνολο Πωλητών"
            value={String(DEMO_SELLERS.length)}
            sub="Ενεργοί αντιπρόσωποι"
            colorClass="border-slate-700/60"
            icon={
              <svg
                className="w-4 h-4 text-slate-600"
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
            }
          />
          <StatCard
            label="Σύνολο Συναλλαγών"
            value={TOTAL_DEMO_LINES.toLocaleString()}
            sub={`~${Math.round(TOTAL_DEMO_LINES / 12)} ανά μήνα`}
            colorClass="border-sky-500/30"
            icon={
              <svg
                className="w-4 h-4 text-sky-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
          <StatCard
            label="Σύνολο Εσόδων"
            value={fmtCurrency(TOTAL_DEMO_VALUE)}
            sub={`Peak: ${peakMonth?.label ?? "—"} · ${fmtCurrency(peakMonth?.revenue ?? 0)}`}
            colorClass="border-emerald-500/30"
            icon={
              <svg
                className="w-4 h-4 text-emerald-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <StatCard
            label="Μέσος Όρος Εσόδων / Πωλητή"
            value={fmtCurrency(avgRevenuePerSeller)}
            sub={`Κορυφή: ${topSeller?.seller.name ?? ""} · ${fmtCurrency(topSeller?.revenue ?? 0)}`}
            colorClass="border-amber-500/30"
            icon={
              <svg
                className="w-4 h-4 text-amber-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
        </div>

        {/* ── Team Revenue Trend Chart ── */}
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Έσοδα Πωλητών
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {reportPeriod} · συνδυασμός όλων των Πωλητών
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <span className="w-3 h-0.5 bg-sky-400 rounded inline-block" />{" "}
                Μηνιαία έσοδα
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                {fmtCurrency(TOTAL_DEMO_VALUE)} σύνολο
              </span>
            </div>
          </div>
          <TeamRevenueChart data={monthly} />
        </div>

        {/* ── Seller Grid ── */}
        <div>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-white">
                Όλοι οι Πωλητές
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {sellerSort === "name"
                  ? "Ταξινομημένοι αλφαβητικά"
                  : "Ταξινομημένοι κατά έσοδα"}
                {" · "}κλικ σε οποιαδήποτε κάρτα για άνοιγμα πίνακα Πωλητή
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-medium">
                Ταξινόμηση:
              </span>
              <div className="flex rounded-lg border border-slate-700/60 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSellerSort("name")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sellerSort === "name"
                      ? "bg-sky-500/20 text-sky-400 border-r border-slate-700/60"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  Αλφαβητικά
                </button>
                <button
                  type="button"
                  onClick={() => setSellerSort("revenue")}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sellerSort === "revenue"
                      ? "bg-sky-500/20 text-sky-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  Έσοδα
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />{" "}
                Κορυφαίος
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />{" "}
                Στόχος
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sellersSorted.map(
              ({
                seller,
                lineCount,
                revenue,
                uniqueCustomers,
                avgLineValue,
                perf,
              }) => {
                const initials = getInitials(seller.name);
                const actPct = Math.round(
                  (lineCount /
                    sellerStats.reduce((m, s) => Math.max(m, s.lineCount), 1)) *
                    100,
                );
                return (
                  <Link
                    key={seller.id}
                    href={`/demo/seller/${seller.id}`}
                    className="group bg-slate-900 border border-slate-700/60 rounded-2xl p-5 hover:border-sky-500/40 hover:bg-slate-800/40 transition-all duration-150 flex flex-col gap-4"
                  >
                    {/* Header row */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-white text-sm leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors truncate">
                            {seller.name}
                          </p>
                          <PerfBadge perf={perf} />
                        </div>
                        <p className="text-slate-600 text-[10px] font-mono mt-0.5">
                          {seller.spCode}
                        </p>
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-800/50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">
                          Έσοδα
                        </p>
                        <p className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-400">
                          {fmtCurrency(revenue)}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">
                          Αριθμός συναλλαγών
                        </p>
                        <p className="text-sm font-bold text-white">
                          {lineCount}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">
                          Πελάτες
                        </p>
                        <p className="text-sm font-bold text-white">
                          {uniqueCustomers}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-2.5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-0.5">
                          Δραστηριότητα
                        </p>
                        <p className="text-sm font-bold text-white">
                          {actPct}%
                        </p>
                      </div>
                    </div>

                    {/* Activity bar */}
                    <div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-sky-500/55 group-hover:bg-sky-400/75 transition-colors duration-300"
                          style={{ width: `${actPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end">
                      <span className="text-xs text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1">
                        Άνοιγμα πίνακα
                        <svg
                          className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
