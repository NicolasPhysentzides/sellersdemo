"use client";

import { useState, useMemo } from "react";

export interface SalesLine {
  customer_code: number | string; // NUMERIC in DB
  customer_name: string;
  item_code: string;
  item_name: string;
  trndate_line?: number; // Delphi TDateTime: days since December 30, 1899
  line_value?: number;   // estimated line value (qty × unit price)
}

const ROWS_PER_PAGE = 30;
const DELPHI_EPOCH = new Date(1899, 11, 30).getTime();

function fmtCurrency(v: number): string {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(2)}m`;
  if (v >= 1_000) return `€${(v / 1_000).toFixed(1)}k`;
  return `€${v.toFixed(0)}`;
}

function formatDate(delphiDay: number): string {
  const d = new Date(DELPHI_EPOCH + delphiDay * 86400000);
  if (isNaN(d.getTime())) return String(delphiDay);
  return d.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateInputToDelphiDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.round((new Date(y, m - 1, d).getTime() - DELPHI_EPOCH) / 86400000);
}

function getTimestamp(): { display: string; tz: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("el-GR", {
    timeZone: "UTC",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const display = `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}`;
  const tz =
    new Intl.DateTimeFormat("el", {
      timeZone: "UTC",
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "UTC";
  return { display, tz };
}

async function loadImageAsDataUrl(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Convert SVG data URL to PNG data URL via canvas (jsPDF does not support SVG). */
async function svgToPngDataUrl(svgDataUrl: string, size = 64): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2d context unavailable"));
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load SVG image"));
    img.src = svgDataUrl;
  });
}

async function loadFontAsBase64(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      resolve(base64 ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

const ROBOTO_FONT = "Roboto-Regular";

async function downloadPDF(filtered: SalesLine[]) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const { display: timestamp } = getTimestamp();

  // ── Add Roboto font for Greek support ───────────────────────
  const fontUrls = [
    "/Roboto-Regular.ttf",
    "https://cdn.jsdelivr.net/npm/roboto-regular@1.0.0/fonts/Roboto-Regular.ttf",
  ];
  let fontLoaded = false;
  for (const url of fontUrls) {
    try {
      const fontBase64 = await loadFontAsBase64(url);
      if (fontBase64) {
        doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
        doc.addFont("Roboto-Regular.ttf", ROBOTO_FONT, "normal");
        fontLoaded = true;
        break;
      }
    } catch {
      continue;
    }
  }
  if (!fontLoaded) {
    console.warn("PDF: Roboto font failed to load, Greek text may display incorrectly.");
  }

  // ── Colour palette ─────────────────────────────────────────
  const slate950 = [15, 23, 42] as [number, number, number];
  const slate800 = [30, 41, 59] as [number, number, number];
  const slate600 = [71, 85, 105] as [number, number, number];
  const slate200 = [226, 232, 240] as [number, number, number];
  const slate50  = [248, 250, 252] as [number, number, number];
  const white    = [255, 255, 255] as [number, number, number];

  // ── Header banner ──────────────────────────────────────────
  doc.setFillColor(...slate950);
  doc.rect(0, 0, W, 28, "F");

  // Aura logo (convert SVG to PNG for jsPDF compatibility)
  try {
    const logoDataUrl = await loadImageAsDataUrl("/logo.svg");
    const pngDataUrl = logoDataUrl.startsWith("data:image/svg")
      ? await svgToPngDataUrl(logoDataUrl, 64)
      : logoDataUrl;
    doc.addImage(pngDataUrl, "PNG", 10, 5, 18, 18);
  } catch {
    // fallback: just leave the space empty if logo fails to load
  }

  // Company name + report title (Roboto for Greek text)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...white);
  doc.text("AURA SERVICES DEMO", 28, 12);
  doc.setFont(ROBOTO_FONT, "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Αναφορά Γραμμών Πωλήσεων", 28, 19);

  // Timestamp block (right-aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text(timestamp, W - 12, 12, { align: "right" });
  doc.setFont(ROBOTO_FONT, "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`${filtered.length} εγγραφές`, W - 12, 18, { align: "right" });

  // ── Table ───────────────────────────────────────────────────
  autoTable(doc, {
    startY: 33,
    head: [["Ημ/νία Παραγγελίας", "Κωδικός Πελάτη", "Όνομα Πελάτη", "Κωδικός Προϊόντος", "Όνομα Προϊόντος", "Αξία"]],
    body: filtered.map((line) => [
      line.trndate_line ? formatDate(line.trndate_line) : "—",
      String(line.customer_code),
      line.customer_name ?? "",
      line.item_code ?? "",
      line.item_name ?? "",
      line.line_value != null ? fmtCurrency(line.line_value) : "—",
    ]),
    styles: {
      font: ROBOTO_FONT,
      fontSize: 8.5,
      cellPadding: { top: 3.5, bottom: 3.5, left: 5, right: 5 },
      textColor: slate800,
      lineColor: slate200,
      lineWidth: 0.2,
    },
    headStyles: {
      font: ROBOTO_FONT,
      fontStyle: "normal", // must match loaded font; "bold" falls back to built-in font that doesn't support Greek
      fillColor: slate800,
      textColor: white,
      fontSize: 8,
      cellPadding: { top: 4, bottom: 4, left: 5, right: 5 },
    },
    columnStyles: {
      0: { cellWidth: 30, font: ROBOTO_FONT },
      1: { cellWidth: 28, font: ROBOTO_FONT },
      2: { cellWidth: "auto", font: ROBOTO_FONT },
      3: { cellWidth: 28, font: ROBOTO_FONT },
      4: { cellWidth: "auto", font: ROBOTO_FONT },
      5: { cellWidth: 28, halign: "right", font: ROBOTO_FONT },
    },
    alternateRowStyles: { fillColor: slate50 },
    tableLineColor: slate200,
    tableLineWidth: 0.2,
    margin: { left: 12, right: 12 },
    // Footer: page numbers
    didDrawPage: (data) => {
      const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
      const currentPage = data.pageNumber;
      const footerY = doc.internal.pageSize.getHeight() - 7;

      doc.setFont(ROBOTO_FONT, "normal");
      doc.setFontSize(7);
      doc.setTextColor(...slate600);
      doc.text("Aura Services Demo  —  Αναφορά Πωλήσεων", 12, footerY);
      doc.text(
        `Σελίδα ${currentPage} από ${pageCount}`,
        W - 12,
        footerY,
        { align: "right" }
      );

      // thin footer line
      doc.setDrawColor(...slate200);
      doc.setLineWidth(0.3);
      doc.line(12, footerY - 3, W - 12, footerY - 3);
    },
  });

  const fileDate = timestamp.replace(/[/:]/g, "-").replace(" ", "_");
  doc.save(`aura-services-sales-lines-${fileDate}.pdf`);
}

export function SalesTable({ salesLines }: { salesLines: SalesLine[] }) {
  const [filterCustomerCode, setFilterCustomerCode] = useState("");
  const [filterCustomerName, setFilterCustomerName] = useState("");
  const [filterItemCode, setFilterItemCode] = useState("");
  const [filterItemName, setFilterItemName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const filtered = useMemo(() => {
    let result = salesLines;

    if (dateFrom) {
      const from = dateInputToDelphiDay(dateFrom);
      result = result.filter(
        (line) => line.trndate_line != null && line.trndate_line >= from
      );
    }
    if (dateTo) {
      const to = dateInputToDelphiDay(dateTo);
      result = result.filter(
        (line) => line.trndate_line != null && line.trndate_line <= to
      );
    }
    if (filterCustomerCode.trim()) {
      const q = filterCustomerCode.toLowerCase();
      result = result.filter((line) =>
        String(line.customer_code).toLowerCase().includes(q)
      );
    }
    if (filterCustomerName.trim()) {
      const q = filterCustomerName.toLowerCase();
      result = result.filter((line) =>
        line.customer_name?.toLowerCase().includes(q)
      );
    }
    if (filterItemCode.trim()) {
      const q = filterItemCode.toLowerCase();
      result = result.filter((line) =>
        line.item_code?.toLowerCase().includes(q)
      );
    }
    if (filterItemName.trim()) {
      const q = filterItemName.toLowerCase();
      result = result.filter((line) =>
        line.item_name?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [
    salesLines,
    filterCustomerCode,
    filterCustomerName,
    filterItemCode,
    filterItemName,
    dateFrom,
    dateTo,
  ]);

  const filteredTotalValue = filtered.reduce((s, l) => s + (l.line_value ?? 0), 0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const displayed = showAll
    ? filtered
    : filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const hasActiveFilters =
    filterCustomerCode ||
    filterCustomerName ||
    filterItemCode ||
    filterItemName ||
    dateFrom ||
    dateTo;

  function resetPage() {
    setPage(1);
  }

  function clearAllFilters() {
    setFilterCustomerCode("");
    setFilterCustomerName("");
    setFilterItemCode("");
    setFilterItemName("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  async function handleDownloadPDF() {
    setPdfLoading(true);
    try {
      await downloadPDF(filtered);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden">
      {/* ── Header bar ── */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white text-base">Αριθμός συναλλαγών</h3>
          <p className="text-slate-500 text-sm mt-0.5">
            {filtered.length === salesLines.length
              ? `${salesLines.length} εγγραφές`
              : `${filtered.length} από ${salesLines.length} εγγραφές`}
          </p>
        </div>

        {/* Download PDF */}
        <button
          onClick={handleDownloadPDF}
          disabled={pdfLoading || filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pdfLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Δημιουργία…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
              </svg>
              Download PDF
            </>
          )}
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/20 flex flex-wrap gap-4 items-end">
        {/* Date range */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Ημ/νία Παραγγελίας
          </span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); resetPage(); }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
            <span className="text-slate-600 text-sm">—</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); resetPage(); }}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
        </div>

        {/* Κωδικός Πελάτη */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Κωδικός Πελάτη
          </span>
          <input
            type="text"
            placeholder="Φίλτρο…"
            value={filterCustomerCode}
            onChange={(e) => { setFilterCustomerCode(e.target.value); resetPage(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-32 transition-all"
          />
        </div>

        {/* Όνομα Πελάτη */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Όνομα Πελάτη
          </span>
          <input
            type="text"
            placeholder="Φίλτρο…"
            value={filterCustomerName}
            onChange={(e) => { setFilterCustomerName(e.target.value); resetPage(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-40 transition-all"
          />
        </div>

        {/* Κωδικός Προϊόντος */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Κωδικός Προϊόντος
          </span>
          <input
            type="text"
            placeholder="Φίλτρο…"
            value={filterItemCode}
            onChange={(e) => { setFilterItemCode(e.target.value); resetPage(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-32 transition-all"
          />
        </div>

        {/* Όνομα Προϊόντος */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Όνομα Προϊόντος
          </span>
          <input
            type="text"
            placeholder="Φίλτρο…"
            value={filterItemName}
            onChange={(e) => { setFilterItemName(e.target.value); resetPage(); }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 w-40 transition-all"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="self-end text-xs text-slate-500 hover:text-slate-200 dark:hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-700/50"
          >
            Εκκαθάριση όλων
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/40">
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Ημ/νία Παραγγελίας
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Κωδικός Πελάτη
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Όνομα Πελάτη
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Κωδικός Προϊόντος
              </th>
              <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Όνομα Προϊόντος
              </th>
              <th className="text-right px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                Αξία
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-slate-600 text-sm">
                  {hasActiveFilters ? (
                    <span>Δεν βρέθηκαν αποτελέσματα για τα τρέχοντα φίλτρα</span>
                  ) : (
                    "Δεν βρέθηκαν γραμμές πωλήσεων"
                  )}
                </td>
              </tr>
            ) : (
              displayed.map((line, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors last:border-none"
                >
                  <td className="px-6 py-3.5 text-sm text-slate-400 whitespace-nowrap">
                    {line.trndate_line ? formatDate(line.trndate_line) : "—"}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-mono font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    {line.customer_code}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-300">
                    {line.customer_name}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-mono text-slate-400 whitespace-nowrap">
                    {line.item_code}
                  </td>
                  <td className="px-6 py-3.5 text-sm text-slate-300">
                    {line.item_name}
                  </td>
                  <td className="px-6 py-3.5 text-sm font-mono font-semibold text-right whitespace-nowrap text-emerald-700 dark:text-emerald-400">
                    {line.line_value != null ? fmtCurrency(line.line_value) : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Summary + Pagination ── */}
      <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/20 flex items-center justify-between gap-4 flex-wrap">
        {/* Value summary */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowAll((v) => !v); setPage(1); }}
            className="text-xs text-slate-500 hover:text-slate-200 dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60"
          >
            {showAll
              ? `Εμφάνιση ${ROWS_PER_PAGE} ανά σελίδα`
              : `Εμφάνιση όλων ${filtered.length} εγγραφών`}
          </button>
          {filteredTotalValue > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Συνολική αξία:</span>
              <span className="font-semibold font-mono text-emerald-700 dark:text-emerald-400 text-sm">
                {fmtCurrency(filteredTotalValue)}
              </span>
              <span className="text-slate-600">σε {filtered.length} εγγραφές</span>
            </div>
          )}
        </div>

        {/* Page controls — hidden when showing all */}
        {!showAll && filtered.length > ROWS_PER_PAGE && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {(safePage - 1) * ROWS_PER_PAGE + 1}–
              {Math.min(safePage * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 dark:hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Προηγ
              </button>
              <span className="text-sm text-slate-400 px-2">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 dark:hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Επόμ →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
