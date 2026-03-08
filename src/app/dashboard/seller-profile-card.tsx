import type { SellerUser } from "@/lib/mock-data";

const MONTHS_SHORT = ["Ιαν","Φεβ","Μάρ","Απρ","Μάι","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοέ","Δεκ"];

function getReportPeriod(): string {
  const now = new Date();
  const endMonth0   = now.getMonth();
  const endYear     = now.getFullYear();
  const startMonth0 = (endMonth0 + 1) % 12;
  const startYear   = endMonth0 === 11 ? endYear : endYear - 1;
  return `${MONTHS_SHORT[startMonth0]} ${startYear} – ${MONTHS_SHORT[endMonth0]} ${endYear}`;
}

function getInitials(name: string) {
  const parts = name.split(" ").slice(0, 2);
  return parts
    .map((p) => (/^\d+$/.test(p) ? p : p[0]))
    .join("")
    .toUpperCase();
}

interface StatCardProps {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}

function StatCard({ label, value, mono, accent }: StatCardProps) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col justify-between min-h-[88px]">
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
        {label}
      </p>
      <p
        className={`mt-2 font-semibold truncate leading-tight ${
          accent ? "text-blue-600 dark:text-blue-400 text-xl" : "text-white text-sm"
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

export function SellerProfileCard({
  user,
  totalLines,
}: {
  user: SellerUser;
  totalLines: number;
}) {
  const displayName = user.name;
  const initials = getInitials(user.name);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Profile block */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-700/60 rounded-2xl p-6 flex items-start gap-5 relative overflow-hidden">
        <div className="absolute -top-8 -left-8 w-40 h-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-sky-400 to-sky-600 flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-sky-500/20">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 shadow" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-bold text-white text-lg leading-tight">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Stat cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="Περίοδος Αναφοράς" value={getReportPeriod()} />
      </div>
    </div>
  );
}
