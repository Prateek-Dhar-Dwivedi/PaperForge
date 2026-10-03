# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Stack
React 18 + TypeScript + Vite + TailwindCSS + Zustand + React Router v6

## Commands
```
npm run dev       # dev server on localhost:5173
npm run build     # tsc + vite build (must pass before committing)
npm run preview   # preview production build
```

## Architecture
```
src/
  types/index.ts          # All shared TypeScript types (Paper, Note, etc.)
  lib/utils.ts            # cn(), generateId(), formatDate(), constants (DOMAIN_COLORS, STATUS_LABELS)
  lib/analysis.ts         # AI analysis abstraction — swap mockAnalysisProvider for real LLM here
  store/index.ts          # Zustand store with localStorage persistence (key: "researchmate-storage")
  components/layout/      # Layout, Sidebar, TopBar
  components/papers/      # PaperCard, PaperForm (used by both Add and Edit pages)
  components/ui/          # Badge, EmptyState, FormFields, Loading
  pages/                  # One file per route
```

## Critical Patterns

- **AI swap point**: `src/lib/analysis.ts` exports `analysisProvider`. Replace `mockAnalysisProvider` with a real `AnalysisProvider` implementation to connect to an LLM.
- **CSS utilities**: All shared classes are defined in `src/index.css` as `@layer components` (`card`, `btn-primary`, `badge-*`, `input`, `label`, `page-container`). Use these before adding Tailwind inline.
- **Store mutations** always call `set()` returning a new array/object — never mutate state in place.
- **Seed data**: `SEED_PAPERS` / `SEED_NOTES` in `src/store/index.ts` are loaded once via `initializeWithSeedData()` (called in `App.tsx` `useEffect`). The `initialized` flag in persisted state prevents re-seeding.
- **Form validation**: All forms use `react-hook-form` + `zod` resolver. The domain enum in `src/components/papers/PaperForm.tsx` must match the `ResearchDomain` union in `src/types/index.ts` exactly.
- **Path alias**: `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).
- **Routing**: `/library/add` is a sibling route to `/library/:id` — order matters in `App.tsx`. Never move `add` after `:id`.
- **No test framework installed** — add Vitest if tests are needed.
- **Async narrowing**: After an `if (!paper) return` guard, TypeScript loses the `Paper` narrowing inside `async` function closures (re-read from store type). Capture `const p = paper` immediately after the guard and use `p` inside async handlers.

## Design System
- Colors: CSS variables via HSL (`hsl(var(--primary))`) defined in `src/index.css`. Primary = `231 65% 53%` (blue).
- All new pages should use `<div className="page-container space-y-5">` as the root wrapper.
- Consistent section header: `<h2 className="section-title">` + `<p className="section-description">`.
