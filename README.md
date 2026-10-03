# PaperForge

**PaperForge** is an AI-powered research workspace for students and academics — helping you collect, organize, analyze, and compare research papers in one place.

🚀 **Live Demo:** [https://paper-forge-neon.vercel.app](https://paper-forge-neon.vercel.app)

---

## Built with IBM Bob

This project was designed, scaffolded, and iteratively developed using **[IBM Bob](https://www.ibm.com/bob)** — IBM's AI software engineering assistant.

### What is Bob?

Bob is an agentic coding assistant that lives inside your IDE. It doesn't just answer questions — it reads your codebase, understands its structure, writes and edits files, runs commands, validates builds, and reasons through multi-step engineering problems end-to-end.

### What is PaperForge about?

PaperForge is a research-paper management tool built for students, researchers, and academics who deal with large volumes of academic literature. The core problem it solves: reading and tracking research papers is fragmented — PDFs pile up, notes scatter across apps, and spotting patterns or gaps across a set of papers is mentally exhausting.

PaperForge brings everything into one workspace:

- A structured **paper library** where every paper has metadata, a reading status, domain tags, and attached notes.
- An **AI analysis engine** that auto-generates summaries, key contributions, methodologies, and limitations for any paper in your library.
- A **Research Gap Explorer** that scans your library and surfaces unexplored problems and open questions.
- A **side-by-side comparison view** so you can evaluate multiple papers across the same dimensions at a glance.
- A **dashboard** giving you live stats, recent activity, and reading progress.

### How it was made with Bob

Bob acted as the primary engineering agent throughout the build. The development process worked like this:

1. **Architecture design** — Bob analyzed the requirements and proposed the full project structure: React 18 + TypeScript + Vite + TailwindCSS + Zustand + React Router v6, with a clean separation between types, store, components, and pages.

2. **Scaffolding** — Bob generated the initial file tree, configured Vite with path aliases, set up TailwindCSS with a custom design system (CSS variables, shared `@layer components` utilities), and wired up React Router with all routes.

3. **Feature implementation** — Each feature (paper library, AI analysis, gap explorer, comparison, notes) was implemented by Bob through targeted, minimal edits — reading existing code first, then applying precise diffs rather than rewriting whole files.

4. **AI abstraction layer** — Bob designed `src/lib/analysis.ts` as a swappable provider interface. The mock implementation ships by default so the app works offline; replacing it with a real LLM (OpenAI, watsonx, etc.) requires implementing one interface in one file.

5. **Bug fixes & refinements** — Bob caught and fixed TypeScript narrowing issues (e.g., async closure narrowing after null guards), routing edge cases (`/library/add` vs `/library/:id` ordering), and form validation mismatches between Zod schemas and TypeScript union types.

6. **Validation** — After every change, Bob ran `npm run build` to confirm zero TypeScript errors and a clean Vite production build before marking any task complete.

### Why Bob?

- **Speed** — Going from idea to a fully working, deployable app took a fraction of the time compared to manual development. Bob handled the boilerplate, config, and plumbing so focus could stay on the product.
- **Accuracy** — Bob reads the actual code before editing it, so changes are grounded in what's really there — no hallucinated APIs, no stale assumptions.
- **Discipline** — Bob follows the principle of minimal change: every edit traces directly to a requirement. No accidental refactors, no scope creep.
- **Iterability** — Because Bob maintains a live understanding of the codebase, adding new features or fixing issues is fast and safe across the entire project lifetime.

---

## Features

- 📚 **Paper Library** — Add, edit, and organize research papers with metadata (authors, journal, year, domain, status, tags)
- 🤖 **AI Analysis** — Auto-generate summaries, key contributions, methodologies, and limitations for any paper
- 🔍 **Research Gap Explorer** — Identify open problems and unexplored areas across your library
- 📊 **Paper Comparison** — Side-by-side comparison of multiple papers across key dimensions
- 📝 **Research Notes** — Attach rich notes to papers and manage them in one view
- 🏠 **Dashboard** — At-a-glance stats, recent activity, and reading progress

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| State Management | Zustand (with localStorage persistence) |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| AI Engineering Assistant | IBM Bob |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Prateek-Dhar-Dwivedi/PaperForge.git
cd PaperForge

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build      # Type-check + build
npm run preview    # Preview the production build locally
```

---

## Project Structure

```
src/
├── types/index.ts              # All shared TypeScript types (Paper, Note, etc.)
├── lib/
│   ├── utils.ts                # Utilities: cn(), generateId(), formatDate(), constants
│   └── analysis.ts             # AI analysis abstraction (swap mock for real LLM here)
├── store/index.ts              # Zustand store with localStorage persistence
├── components/
│   ├── layout/                 # Layout, Sidebar, TopBar
│   ├── papers/                 # PaperCard, PaperForm
│   └── ui/                     # Badge, EmptyState, FormFields, Loading
└── pages/                      # One file per route
    ├── Dashboard.tsx
    ├── PaperLibrary.tsx
    ├── AddPaper.tsx
    ├── EditPaper.tsx
    ├── PaperDetail.tsx
    ├── PaperComparison.tsx
    ├── ResearchGapExplorer.tsx
    └── ResearchNotes.tsx
```

---

## Connecting a Real LLM

The AI analysis layer is intentionally decoupled. To swap in a real LLM:

1. Open [`src/lib/analysis.ts`](src/lib/analysis.ts)
2. Implement the `AnalysisProvider` interface
3. Replace `mockAnalysisProvider` with your implementation

---

## Demo Data

On first load, PaperForge seeds a set of **fictional demo papers and notes** to showcase the UI. They are not real published research and should not be cited. The seed runs once — clearing your browser's localStorage will reset the app to a fresh state.

---

## License

MIT © [Prateek Dhar Dwivedi](https://github.com/Prateek-Dhar-Dwivedi)
