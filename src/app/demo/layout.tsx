export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 py-1.5 px-4 text-center text-[11px] text-slate-500 bg-slate-950/95 border-t border-slate-800/60 backdrop-blur-sm">
        Δημιουργία από{" "}
        <a
          href="https://www.theauraservices.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-400 transition-colors"
        >
          Aura Services
        </a>
      </div>
      <div className="h-7 shrink-0" aria-hidden="true" />
    </>
  );
}
