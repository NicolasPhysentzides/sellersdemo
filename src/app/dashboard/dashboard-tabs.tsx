"use client";

import { useState } from "react";
import { SalesTable, type SalesLine } from "./sales-table";
import { KpisSection } from "./kpis-section";

interface Props {
  salesLines: SalesLine[];
  pdfUrl: string | null;
  pdfName: string | null;
}

type Tab = "sales" | "kpis";

export function DashboardTabs({ salesLines, pdfUrl, pdfName }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("sales");

  const tabs: {
    id: Tab;
    label: string;
    mobileLabel: string;
    badge?: string;
    dot?: boolean;
  }[] = [
    {
      id: "sales",
      label: "Αριθμός συναλλαγών",
      mobileLabel: "Συναλλαγές",
      badge: String(salesLines.length),
    },
    {
      id: "kpis",
      label: "Απόδοση Πωλήσεων",
      mobileLabel: "Απόδοση",
      dot: !!pdfUrl,
    },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center border-b border-slate-800 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm font-medium transition-colors focus:outline-none ${
                isActive
                  ? "text-white"
                  : "text-slate-500 hover:text-slate-300 dark:hover:text-slate-300"
              }`}
            >
              <span className="sm:hidden">{tab.mobileLabel}</span>
              <span className="hidden sm:inline">{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-mono transition-colors ${
                    isActive
                      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      : "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {tab.dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? "bg-blue-400" : "bg-blue-600"
                  }`}
                />
              )}

              {/* Active underline */}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-200 ${
                  isActive ? "bg-blue-500 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {activeTab === "sales" ? (
        <SalesTable salesLines={salesLines} />
      ) : (
        <KpisSection salesLines={salesLines} pdfUrl={pdfUrl} pdfName={pdfName} />
      )}
    </div>
  );
}
