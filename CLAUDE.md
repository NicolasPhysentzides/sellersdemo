# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Seller Dashboard Demo — a Next.js 16 App Router application (React 19, TypeScript 5) that displays sales data dashboards for sellers and admins. All data is statically generated from deterministic mock data (no backend/API).

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (no test runner configured)
```

## Architecture

**Routing (App Router, file-based):**
- `/` — Landing/marketing page (Server Component)
- `/demo` — Role selector: Seller vs Admin (Client Component)
- `/demo/admin` — Admin panel with team overview (Client Component)
- `/demo/seller/[id]` — Individual seller dashboard (Server Component, statically generated for IDs 1–20 via `generateStaticParams`)

**Key directories:**
- `src/app/dashboard/` — Shared UI components (NOT a route). Contains `dashboard-tabs.tsx`, `kpis-section.tsx`, `sales-table.tsx`, `seller-profile-card.tsx`
- `src/lib/mock-data.ts` — All mock data: 17 sellers, ~1,096 sales lines generated with deterministic pseudo-random algorithm (no `Math.random()`)

**Data flow:** Mock data imported at module level → passed as props from page components → one level deep to dashboard components. No global state (no Redux/Zustand/Context). All state is local `useState`.

## Key Conventions

**Delphi date format:** Dates are stored as Delphi `TDateTime` integers (days since Dec 30, 1899). Convert with: `new Date(DELPHI_EPOCH + d * 86400000)`. This mirrors the real backend format.

**Inline SVG charts:** All charts are hand-crafted SVGs with hover interactivity — no chart library (no Recharts/Chart.js).

**PDF export:** `jsPDF` + `jspdf-autotable` loaded via dynamic `await import(...)` in `sales-table.tsx` to keep them out of the initial bundle.

**Utility helpers are co-located:** Functions like `fmtCurrency`, `delphiToDate`, `formatDate`, `getInitials`, `toTitleCase` are defined at the top of each file that needs them (some duplication across files).

**React Compiler enabled:** `reactCompiler: true` in `next.config.ts` — automatic memoization optimization. Manual `useMemo` is still used for heavy computations (KPI aggregation, rankings).

**Styling:** Tailwind CSS v4 (PostCSS-based `@import "tailwindcss"` syntax). Dark theme throughout using slate color scale. Fonts: Geist Sans/Mono via `next/font/google`.

**TypeScript:** Strict mode. The `SalesLine` interface is exported from `sales-table.tsx` and shared across components.
