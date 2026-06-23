# Hextermina

Fanmade concept website for [Hextermina](https://hextermina.com) — a dark Y2K indie clothing brand. This project is a non-commercial, creative reinterpretation of the brand’s digital presence. It is not affiliated with, endorsed by, or intended for commercial use by the original brand.

> **Disclaimer:** Fan project only. No products are sold here. All brand references belong to their respective owners.

## About

Hextermina sits at the intersection of underground streetwear and early-internet aesthetics: chrome logos, gate imagery, limited-run drops, and an immersive single-page entry sequence. The site prioritizes atmosphere — sound, motion, and a custom cursor — over traditional e-commerce patterns.

**Brand tone:** cryptic, dark, indie. Copy leans into “the end,” chrome-era pieces, and small-batch exclusivity.

## Experience flow

The home page is a single URL with no route changes. Progress is orchestrated by `WelcomeCard` and persisted where noted:

| Step | Component | Persistence |
| --- | --- | --- |
| 1. Headphones notice | `HeadphonesNotice` | Once per **session** (`sessionStorage`) |
| 2. Onboarding / terms | `OnBoarding` | Once ever after agreeing (`localStorage`) |
| 3. Landing / gate | `Landing` | Once per **session**; includes LiquidMetal logo + gate animation |
| 4. Main content | `MainExperience` | Remains for the current **session** after entering |

**Landing animation:** clicking “Press anywhere to Start” triggers a blurry fade-out of the chrome logo, then the gate images zoom, open in 3D, and fade away before revealing the main page.

**Reduced motion:** users with `prefers-reduced-motion` skip the gate sequence and go straight to `MainExperience`.

## What's included

| Layer | Stack |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, RSC, Turbopack) |
| UI | [shadcn/ui](https://ui.shadcn.com) (`base-luma`, zinc palette) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Motion | [Motion](https://motion.dev) (Framer Motion successor) |
| Shaders | [@paper-design/shaders-react](https://github.com/paper-design/shaders) (`LiquidMetal` logo) |
| Icons | [Hugeicons](https://hugeicons.com) |
| API | [tRPC v11](https://trpc.io) + [TanStack Query v5](https://tanstack.com/query) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (light / dark / system) |
| Language | TypeScript (strict) |

### Project-specific features

- **Immersive entry** — headphones prompt, terms card, animated gate transition
- **Custom morphing cursor** — dot, pointer, and tooltip shapes via `clip-path` (`components/motion-primitives/cursor.tsx`)
- **Ambient audio** — intro click + looping background (`public/sounds/`), volume controls in `AudioControls`
- **Chrome logo** — `LiquidMetal` shader over `hex-logo.svg`
- **Persistence** — onboarding completion in `localStorage`; session flow in `sessionStorage` (`context/local-storage-provider.tsx`)
- **Dark-first typography** — Inter (body), Oxanium (headings), Geist Mono (code/mono accents)

## Getting started

```bash
git clone git@github.com:jj0han/hextermina.git
cd hextermina
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use headphones and enable sound for the intended experience.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm format` | Format TypeScript/TSX with Prettier |
| `pnpm typecheck` | Run TypeScript without emitting |

## Project structure

```
hextermina/
├── app/
│   ├── api/trpc/[trpc]/route.ts   # tRPC HTTP handler
│   ├── globals.css                # Tailwind + theme tokens (OKLCH, dark-first)
│   ├── global-not-found.tsx       # Global 404
│   ├── layout.tsx                 # Root layout, fonts, metadata
│   ├── page.tsx                   # Home → WelcomeCard
│   └── providers.tsx              # Theme, storage, audio, cursor providers
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── motion-primitives/
│   │   └── cursor.tsx             # Custom cursor primitive
│   ├── welcome-card.tsx           # Experience orchestrator
│   ├── headphones-notice.tsx      # Session intro
│   ├── on-boarding.tsx            # Terms / brand intro
│   ├── landing.tsx                # Gate + LiquidMetal animation
│   ├── main-experience.tsx        # Post-gate main content
│   └── audio-controls.tsx         # Volume / mute UI
├── context/
│   ├── audio-provider.tsx         # In-memory audio state
│   ├── cursor-provider.tsx        # Hover targets + morphing cursor
│   ├── local-storage-provider.tsx # Onboarding + session flow persistence
│   └── theme-provider.tsx         # next-themes wrapper
├── public/
│   ├── hex-logo.svg
│   ├── gate-left.png / gate-right.png
│   ├── shuriken.svg
│   └── sounds/                    # intro-sound.ogg, background-sound.mp3
├── utils/
│   └── clipPaths.ts               # Cursor pointer clip-path polygon
└── trpc/                          # Type-safe API (starter scaffold)
```

Path alias `@/*` maps to the project root.

## Persistence keys

| Key | Storage | Purpose |
| --- | --- | --- |
| `hextermina:has-completed-onboarding` | `localStorage` | User agreed to terms |
| `hextermina:session-has-seen-headphones` | `sessionStorage` | Headphones notice shown this session |
| `hextermina:session-experience-state` | `sessionStorage` | Current step: `landing`, `entering`, or `main` |

Audio volume/mute is **not** persisted — it resets each visit.

## Custom cursor

The global cursor is hidden; a DOM-based cursor follows the pointer and morphs between:

- **Default** — small circle
- **Hover (button/link)** — pointer shape (`cursorPath` in `utils/clipPaths.ts`)
- **Tooltip** — pill with optional label content via `useCursorHover()`

Registered in `app/providers.tsx` → `CursorProvider` + `MorphingCursor`.

## Theming

Dark mode is the primary look. Theme tokens live in `app/globals.css` (OKLCH). Use semantic classes (`bg-background`, `text-foreground`, `text-muted-foreground`) so UI stays consistent across light/dark.

Fonts: **Oxanium** for headings (`font-heading`), **Inter** for body, **Geist Mono** for mono accents.

## tRPC

The repo includes a tRPC + TanStack Query scaffold from the original starter. The concept site does not rely on it for the entry experience; `app/page.tsx` still prefetches a demo `hello` query. Extend or remove as the fan site grows.

## shadcn/ui

Components live in `components/ui/`. Add more with:

```bash
npx shadcn@latest add dialog
```

Typography helpers are hand-maintained in `components/ui/typography.tsx` (not from the registry).

## Code quality

```bash
pnpm lint && pnpm typecheck
```

ESLint (Next.js + import sorting), Prettier (Tailwind class sorting), TypeScript strict mode.

## Deployment

Works on any Next.js host (e.g. Vercel). Build locally:

```bash
pnpm build
pnpm start
```

## License

Fanmade, non-commercial concept project. Not for sale, resale, or commercial exploitation. Brand assets and naming reference [hextermina.com](https://hextermina.com); adjust or remove if publishing publicly and unsure about rights.
