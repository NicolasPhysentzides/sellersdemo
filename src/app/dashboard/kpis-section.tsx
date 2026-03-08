"use client";

import { useMemo, useState } from "react";
import type { SalesLine } from "./sales-table";

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

function pctChange(a: number, b: number): number | null {
  if (a === 0) return null;
  return Math.round(((b - a) / a) * 100);
}

// ── Trend badge ─────────────────────────────────────────────────
function TrendBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
        up ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-red-500/15 text-red-700 dark:text-red-400"
      }`}
    >
      {up ? "↑" : "↓"} {Math.abs(pct)}%
    </span>
  );
}

// ── Stat card ──────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  colorClass,
  trend,
}: {
  label: string;
  value: string;
  sub?: string;
  colorClass: string;
  trend?: number | null;
}) {
  return (
    <div
      className={`bg-slate-800/60 border rounded-2xl p-5 flex flex-col gap-1.5 ${colorClass}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {label}
        </p>
        {trend !== undefined && <TrendBadge pct={trend} />}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

// ── SVG area / line chart with hover tooltips ──────────────────
interface ChartPoint {
  label: string;
  value: number;
  tooltip: string;
}

const CHART_COLORS = {
  sky: {
    main: "#38bdf8",
    grad: ["#38bdf8", "#7dd3fc", "#0ea5e9"],
    glow: "#38bdf8",
  },
  emerald: {
    main: "#34d399",
    grad: ["#34d399", "#6ee7b7", "#10b981"],
    glow: "#34d399",
  },
} as const;

function smoothCurveThroughPoints(
  pts: { x: number; y: number }[],
  tension = 0.3
): string {
  if (pts.length < 2) return "";
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${cp2x.toFixed(1)} ${cp2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function AreaChart({
  data,
  color = "sky",
  showNumbers = false,
  formatValue = (v) => String(v),
}: {
  data: ChartPoint[];
  color?: keyof typeof CHART_COLORS;
  showNumbers?: boolean;
  formatValue?: (v: number) => string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const W = 520;
  const H = 150;
  const pad = { t: 18, b: 28, l: 8, r: 8 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;
  const n = data.length;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const colors = CHART_COLORS[color];

  const pts = data.map((d, i) => ({
    x: pad.l + (n < 2 ? iW / 2 : (i / (n - 1)) * iW),
    y: pad.t + iH - (d.value / maxVal) * iH,
    ...d,
  }));

  const linePath = smoothCurveThroughPoints(pts);
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(pad.t + iH).toFixed(1)} L${pts[0].x.toFixed(1)},${(pad.t + iH).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: 150 }}
      onMouseLeave={() => setHovered(null)}
    >
      <defs>
        <style type="text/css">{`*{--chart-dot-inactive:#0f172a;--chart-label-inactive:#475569;--chart-label-active:#94a3b8;--chart-tooltip-bg:#0f172a;--chart-tooltip-border:#334155;--chart-tooltip-text:#e2e8f0}`}</style>
        <linearGradient
          id={`kpiAreaGrad-${color}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={colors.grad[0]} stopOpacity="0.45" />
          <stop offset="50%" stopColor={colors.grad[1]} stopOpacity="0.15" />
          <stop offset="100%" stopColor={colors.grad[2]} stopOpacity="0.02" />
        </linearGradient>
        <filter id={`chartGlow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Gridlines */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={pad.l}
          x2={W - pad.r}
          y1={pad.t + iH * (1 - t)}
          y2={pad.t + iH * (1 - t)}
          stroke="currentColor"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <path
        d={areaPath}
        fill={`url(#kpiAreaGrad-${color})`}
        style={{ transition: "opacity 0.2s" }}
      />

      {/* Glow line (blurred) */}
      <path
        d={linePath}
        fill="none"
        stroke={colors.main}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.25"
        filter={`url(#chartGlow-${color})`}
      />

      {/* Main line */}
      <path
        d={linePath}
        fill="none"
        stroke={colors.main}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Hover vertical line */}
      {hovered !== null && (
        <line
          x1={pts[hovered].x}
          x2={pts[hovered].x}
          y1={pad.t}
          y2={pad.t + iH}
          stroke={colors.main}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.5"
        />
      )}

      {/* Dots + labels + hover hit areas */}
      {pts.map((p, i) => {
        const isHov = hovered === i;
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
              r={isHov ? 6 : 4}
              stroke={colors.main}
              strokeWidth="2"
              style={{
                fill: isHov ? colors.main : "var(--chart-dot-inactive)",
                transition: "r 0.15s ease-out",
              }}
            />
            {showNumbers && (() => {
              const val = formatValue(p.value);
              const ty = Math.max(p.y - 12, pad.t + 6);
              const textW = Math.max(val.length * 6, 32);
              return (
                <g>
                  <rect
                    x={p.x - textW / 2}
                    y={ty - 10}
                    width={textW}
                    height={16}
                    rx="6"
                    ry="6"
                    fill="rgba(15, 23, 42, 0.92)"
                    stroke={colors.main}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <text
                    x={p.x}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="9"
                    fontWeight="600"
                    fill="#f8fafc"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {val}
                  </text>
                </g>
              );
            })()}
            <text
              x={p.x}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fontWeight={isHov ? "600" : "500"}
              style={{
                fill: isHov
                  ? "var(--chart-label-active)"
                  : "var(--chart-label-inactive)",
              }}
            >
              {p.label}
            </text>

            {isHov && (
              <g>
                <rect
                  x={Math.min(Math.max(p.x - 58, 4), W - 120)}
                  y={Math.max(p.y - 28, pad.t)}
                  width={116}
                  height={24}
                  rx="8"
                  ry="8"
                  style={{
                    fill: "var(--chart-tooltip-bg)",
                    stroke: "var(--chart-tooltip-border)",
                  }}
                  strokeWidth="1"
                />
                <text
                  x={Math.min(Math.max(p.x, 62), W - 62)}
                  y={Math.max(p.y - 11, pad.t + 10)}
                  textAnchor="middle"
                  fontSize="11"
                  style={{ fill: "var(--chart-tooltip-text)" }}
                  fontWeight="600"
                >
                  {p.tooltip}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── Horizontal bar row ─────────────────────────────────────────
const RANK_COLORS = [
  "linear-gradient(90deg, #38bdf8 0%, #0ea5e9 100%)",
  "linear-gradient(90deg, #7dd3fc 0%, #38bdf8 100%)",
  "linear-gradient(90deg, #bae6fd 0%, #7dd3fc 100%)",
  "linear-gradient(90deg, #93c5fd 0%, #60a5fa 100%)",
  "linear-gradient(90deg, #a5b4fc 0%, #818cf8 100%)",
];

function HBar({
  label,
  value,
  pct,
  rank,
}: {
  label: string;
  value: number;
  pct: number;
  rank: number;
}) {
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-[10px] font-bold font-mono text-slate-500 w-5 text-right shrink-0 tabular-nums">
        {rank + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-300 truncate group-hover:text-slate-200 transition-colors">
            {label}
          </span>
          <span className="text-xs font-semibold font-mono text-slate-400 ml-2 shrink-0 tabular-nums">
            {value}
          </span>
        </div>
        <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/30">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{
              width: `${pct}%`,
              background: RANK_COLORS[rank] ?? RANK_COLORS[4],
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── Mini value bar chart (per-month £ value) ───────────────────
function ValueBars({ data }: { data: { label: string; value: number }[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const isHov = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 group relative"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHov && d.value > 0 && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[10px] text-white font-semibold whitespace-nowrap shadow-lg z-10">
                {fmtCurrency(d.value)}
              </div>
            )}
            <div
              className="w-full rounded-t-sm transition-colors duration-150"
              style={{
                height: `${pct}%`,
                minHeight: pct > 0 ? 2 : 0,
                backgroundColor: isHov
                  ? "rgb(52 211 153 / 0.8)"
                  : "rgb(52 211 153 / 0.45)",
              }}
            />
            <span
              className={`text-[8px] transition-colors ${isHov ? "text-slate-400" : "text-slate-700"}`}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
interface Props {
  salesLines: SalesLine[];
  pdfUrl?: string | null;
  pdfName?: string | null;
  allowInlineView?: boolean;
}

export function KpisSection({ salesLines }: Props) {
  const [showNumbers, setShowNumbers] = useState(false);

  const kpis = useMemo(() => {
    const totalLines = salesLines.length;
    const totalValue = salesLines.reduce((s, l) => s + (l.line_value ?? 0), 0);
    const uniqueCustomers = new Set(
      salesLines.map((l) => String(l.customer_code)),
    ).size;
    const uniqueItems = new Set(salesLines.map((l) => l.item_code)).size;
    const avgLineValue = totalLines > 0 ? totalValue / totalLines : 0;

    // Dynamic 12-month window: trailing 12 months ending this month
    const now = new Date();
    const endMonth0 = now.getMonth(); // 0-based
    const endYear = now.getFullYear();
    const startMonth0 = (endMonth0 + 1) % 12;
    const startYear = endMonth0 === 11 ? endYear : endYear - 1;
    const periodLabel = `${MONTHS_SHORT[startMonth0]} ${startYear} – ${MONTHS_SHORT[endMonth0]} ${endYear}`;

    // Monthly breakdown across the trailing 12 months
    const monthMap: Record<string, { lines: number; value: number }> = {};
    for (const line of salesLines) {
      if (!line.trndate_line) continue;
      const d = delphiToDate(line.trndate_line);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthMap[key]) monthMap[key] = { lines: 0, value: 0 };
      monthMap[key].lines++;
      monthMap[key].value += line.line_value ?? 0;
    }

    // Build ordered 12-month arrays starting from startMonth
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const month0 = (startMonth0 + i) % 12;
      const year = startMonth0 + i >= 12 ? endYear : startYear;
      const key = `${year}-${month0}`;
      const data = monthMap[key] ?? { lines: 0, value: 0 };
      const yearShort = String(year).slice(-2);
      return {
        label: `${MONTHS_SHORT[month0]} '${yearShort}`,
        value: data.lines,
        valueGbp: data.value,
        tooltip: `${data.lines} συναλλαγές`,
      };
    });

    // Trend: compare first 6 months vs last 6 months
    const firstHalf = monthly.slice(0, 6);
    const secondHalf = monthly.slice(6, 12);
    const firstLines = firstHalf.reduce((s, m) => s + m.value, 0);
    const secondLines = secondHalf.reduce((s, m) => s + m.value, 0);
    const firstValue = firstHalf.reduce((s, m) => s + m.valueGbp, 0);
    const secondValue = secondHalf.reduce((s, m) => s + m.valueGbp, 0);
    const linesTrend = pctChange(firstLines, secondLines);
    const valueTrend = pctChange(firstValue, secondValue);

    const bestMonth = [...monthly].sort((a, b) => b.value - a.value)[0];
    const avgLinesPerMonth = Math.round(totalLines / 12);

    // Top 5 customers by line count
    const custMap: Record<string, { name: string; count: number }> = {};
    for (const l of salesLines) {
      const k = String(l.customer_code);
      if (!custMap[k]) custMap[k] = { name: l.customer_name, count: 0 };
      custMap[k].count++;
    }
    const topCust = Object.values(custMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const maxCust = topCust[0]?.count ?? 1;

    // Top 5 items by line count
    const itemMap: Record<string, { name: string; count: number }> = {};
    for (const l of salesLines) {
      if (!itemMap[l.item_code])
        itemMap[l.item_code] = { name: l.item_name, count: 0 };
      itemMap[l.item_code].count++;
    }
    const topItems = Object.values(itemMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const maxItem = topItems[0]?.count ?? 1;

    return {
      totalLines,
      totalValue,
      uniqueCustomers,
      uniqueItems,
      avgLineValue,
      monthly,
      bestMonth,
      avgLinesPerMonth,
      linesTrend,
      valueTrend,
      periodLabel,
      topCust,
      maxCust,
      topItems,
      maxItem,
    };
  }, [salesLines]);

  if (salesLines.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-slate-600"
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
        </div>
        <p className="text-slate-400 text-sm font-medium">
          Δεν υπάρχουν δεδομένα προς εμφάνιση
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Row 1: KPI stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Αριθμός συναλλαγών"
          value={String(kpis.totalLines)}
          sub={`~${kpis.avgLinesPerMonth} / μήνα μέσος`}
          colorClass="border-sky-500/30"
          trend={kpis.linesTrend}
        />
        <StatCard
          label="Πωλήσεις"
          value={fmtCurrency(kpis.totalValue)}
          sub={kpis.periodLabel}
          colorClass="border-emerald-500/30"
          trend={kpis.valueTrend}
        />
        <StatCard
          label="Πελάτες"
          value={String(kpis.uniqueCustomers)}
          sub="Ενεργοί Πελάτες"
          colorClass="border-slate-700/50"
        />
        <StatCard
          label="Προϊόντα"
          value={String(kpis.uniqueItems)}
          sub={`${fmtCurrency(kpis.avgLineValue)} μέση αξία`}
          colorClass="border-amber-500/30"
        />
      </div>

      {/* ── Row 2: Monthly lines activity (area chart) ── */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Μηνιαίες Συναλλαγές
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {kpis.periodLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNumbers((v) => !v)}
              className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                showNumbers
                  ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                  : "bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-400"
              }`}
            >
              Αριθμοί
            </button>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-sky-700 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
              {kpis.totalLines} σύνολο
            </span>
          </div>
        </div>
        <AreaChart
          data={kpis.monthly.map((m) => ({
            label: m.label,
            value: m.value,
            tooltip: m.tooltip,
          }))}
          showNumbers={showNumbers}
          formatValue={(v) => String(Math.round(v))}
        />
      </div>

      {/* ── Row 3: Monthly £ value bars ── */}
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Έσοδα ανά Μήνα
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{kpis.periodLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowNumbers((v) => !v)}
              className={`text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                showNumbers
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-400"
              }`}
            >
              Αριθμοί
            </button>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
              {fmtCurrency(kpis.totalValue)}
            </span>
          </div>
        </div>
        <AreaChart
          color="emerald"
          data={kpis.monthly.map((m) => ({
            label: m.label,
            value: m.valueGbp,
            tooltip: fmtCurrency(m.valueGbp),
          }))}
          showNumbers={showNumbers}
          formatValue={(v) => fmtCurrency(v)}
        />
      </div>

      {/* ── Row 4: Top customers + top products ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">
              Κορυφαίοι Πελάτες
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              κατά συναλλαγές
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {kpis.topCust.map((c, i) => (
              <HBar
                key={c.name}
                label={c.name}
                value={c.count}
                pct={(c.count / kpis.maxCust) * 100}
                rank={i}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">
              Κορυφαία Προϊόντα
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              κατά συναλλαγές
            </span>
          </div>
          <div className="flex flex-col gap-4">
            {kpis.topItems.map((item, i) => (
              <HBar
                key={item.name}
                label={item.name}
                value={item.count}
                pct={(item.count / kpis.maxItem) * 100}
                rank={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
