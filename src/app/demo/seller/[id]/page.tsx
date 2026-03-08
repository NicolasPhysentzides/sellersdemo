import { notFound } from "next/navigation";
import { DEMO_SELLERS, DEMO_SALES_LINES } from "@/lib/mock-data";
import { SellerProfileCard } from "@/app/dashboard/seller-profile-card";
import { DashboardTabs } from "@/app/dashboard/dashboard-tabs";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function generateStaticParams() {
  return DEMO_SELLERS.map((seller) => ({ id: String(seller.id) }));
}

export default async function DemoSellerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = DEMO_SELLERS.find((s) => String(s.id) === id);
  if (!seller) notFound();

  const salesLines = DEMO_SALES_LINES[seller.spCode] ?? [];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Demo banner */}
      <div className="bg-blue-500/10 border-b border-blue-500/20 px-6 py-2 flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400/80">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />
        <span className="font-semibold text-blue-700 dark:text-blue-300">
          {seller.name}
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Image
              src="/logo.svg"
              alt="Aura Services Demo"
              width={72}
              height={72}
              className="rounded-xl mt-1 w-10 h-10 sm:w-14 sm:h-14"
            />
            <span className="font-semibold text-sm sm:text-base text-white tracking-tight truncate">
              Aura Services
            </span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-slate-500 text-sm hidden md:inline">
              Πίνακας Πωλήσεων
            </span>
            <span className="text-slate-600 hidden md:inline">/</span>
            <span className="text-white text-sm font-medium hidden md:inline">
              {seller.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              aria-label="Πίσω"
              className="flex items-center justify-center md:justify-start gap-0 md:gap-1.5 text-slate-400 hover:text-slate-200 dark:hover:text-white transition-colors border border-slate-700/60 hover:border-slate-600 w-8 h-8 md:w-auto md:h-auto md:px-3.5 py-0 md:py-1.5 rounded-md md:rounded-xl"
            >
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4"
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
              <span className="hidden md:inline text-sm">Πίσω</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        <SellerProfileCard user={seller} totalLines={salesLines.length} />
        <DashboardTabs salesLines={salesLines} pdfUrl={null} pdfName={null} />
      </main>
    </div>
  );
}
