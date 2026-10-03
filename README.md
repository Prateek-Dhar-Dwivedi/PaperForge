# PaperForge

**PaperForge** is an AI-powered research workspace for students and academics — helping you collect, organize, analyze, and compare research papers in one place.

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
