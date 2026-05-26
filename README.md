# starter-next

A production-ready Next.js starter kit for new projects. Clone it or use it as a GitHub template to skip boilerplate and start building features on day one.

## What's included

| Layer | Stack |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, React Server Components, Turbopack dev server) |
| UI | [shadcn/ui](https://ui.shadcn.com) (`base-luma` style, zinc palette, CSS variables) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Icons | [Hugeicons](https://hugeicons.com) |
| API | [tRPC v11](https://trpc.io) + [TanStack Query v5](https://tanstack.com/query) |
| Validation | [Zod v4](https://zod.dev) |
| Serialization | [SuperJSON](https://github.com/blitz-js/superjson) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) (light / dark / system) |
| Language | TypeScript (strict mode) |
| Linting | ESLint (Next.js + import sorting + consistent type imports) |
| Formatting | Prettier + Tailwind class sorting |

### Pre-configured out of the box

- **End-to-end type-safe API** — tRPC router, API route handler, React Query integration, and server-side prefetch/hydration helpers
- **Full shadcn/ui component library** — 50+ components already installed under `components/ui/`
- **Dark mode** — system-aware theme toggle wired up on the welcome page
- **Fonts** — Inter (sans), Geist (headings), Geist Mono (code) via `next/font`
- **Developer tooling** — React Query Devtools, ESLint, Prettier, and `typecheck` script
- **Proxy placeholder** — `proxy.ts` stub ready for auth or route protection (Next.js 16 proxy convention)

## Getting started

### Use as a GitHub template

1. Click **Use this template** on GitHub to create a new repository.
2. Clone your new repo and install dependencies:

```bash
git clone git@github.com:your-org/your-project.git
cd your-project
pnpm install
```

3. Start the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The welcome page demonstrates theme switching and a prefetched tRPC query.

### First steps in a new project

After scaffolding from this template, customize these before shipping:

1. **Rename the package** — update `name` in `package.json`
2. **Remove demo code** — replace `components/welcome-card.tsx` and simplify `app/page.tsx`
3. **Extend the API** — add routers under `trpc/routers/` and register them in `trpc/routers/_app.ts`
4. **Add environment variables** — create `.env.local` (never commit secrets; `.env*.local` is gitignored)
5. **Configure auth** — wire up your provider and uncomment the stubs in `trpc/init.ts` and `proxy.ts`

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Serve production build |
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm format` | Format TypeScript/TSX with Prettier |
| `pnpm typecheck` | Run TypeScript compiler without emitting |

## Project structure

```
starter-next/
├── app/
│   ├── api/trpc/[trpc]/route.ts   # tRPC HTTP handler
│   ├── globals.css                # Tailwind + shadcn theme tokens
│   ├── layout.tsx                 # Root layout, fonts, providers
│   ├── page.tsx                   # Home page (prefetch example)
│   └── providers.tsx              # Theme + tooltip providers
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── theme-provider.tsx
│   └── welcome-card.tsx           # Demo page (safe to remove)
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts                   # cn() helper
├── trpc/
│   ├── init.ts                    # tRPC context + procedure helpers
│   ├── client.tsx                 # Browser provider + useTRPC hook
│   ├── server.tsx                 # RSC helpers: trpc, prefetch, HydrateClient
│   ├── query-client.ts            # TanStack Query + SuperJSON config
│   └── routers/
│       ├── _app.ts                # Root router
│       └── hello.ts               # Example procedure
├── proxy.ts                       # Route proxy stub (auth, redirects)
├── components.json                # shadcn/ui configuration
├── eslint.config.mjs
├── next.config.mjs
├── postcss.config.mjs
└── tsconfig.json
```

Path alias `@/*` maps to the project root.

## tRPC

This template uses the [tRPC + TanStack Query integration for Next.js App Router](https://trpc.io/docs/client/tanstack-react-query/setup).

### Server Components — prefetch data

```tsx
import { HydrateClient, prefetch, trpc } from "@/trpc/server"

export default function Page() {
  prefetch(trpc.hello.list.queryOptions({ text: "world" }))

  return (
    <HydrateClient>
      <MyClientComponent />
    </HydrateClient>
  )
}
```

### Client Components — consume data

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

export function MyClientComponent() {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.hello.list.queryOptions({ text: "world" }))

  return <p>{data?.greeting}</p>
}
```

### Add a new procedure

1. Create a router in `trpc/routers/`:

```ts
import z from "zod"
import { baseProcedure, createTRPCRouter } from "../init"

export const usersRouter = createTRPCRouter({
  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => ({ id: input.id, name: "Jane" })),
})
```

2. Register it in `trpc/routers/_app.ts`:

```ts
export const appRouter = createTRPCRouter({
  hello: helloRouter,
  users: usersRouter,
})
```

Types flow automatically to client and server — no code generation step.

## shadcn/ui

Components live in `components/ui/` and are configured via `components.json`:

- **Style:** `base-luma`
- **Base color:** zinc
- **Icon library:** hugeicons
- **RSC:** enabled

### Adding more components

```bash
npx shadcn@latest add dialog
```

### Using components

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

### Pre-installed components

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, hover-card, input, input-group, input-otp, item, kbd, label, menubar, native-select, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

## Theming

Theme tokens are defined in `app/globals.css` using OKLCH color values. Dark mode is class-based via `next-themes`.

Toggle theme in client components:

```tsx
import { useTheme } from "next-themes"

const { theme, setTheme } = useTheme()
setTheme(theme === "dark" ? "light" : "dark")
```

Use semantic tokens (`bg-background`, `text-foreground`, `border-border`, etc.) instead of hard-coded colors so components stay consistent across themes.

## Code quality

- **ESLint** — Next.js core web vitals, TypeScript rules, automatic import sorting, and enforced `import type` for type-only imports
- **Prettier** — 2-space indent, no semicolons, double quotes, Tailwind class sorting via `prettier-plugin-tailwindcss`
- **TypeScript** — strict mode with path aliases

Run before committing:

```bash
pnpm lint && pnpm typecheck
```

## Proxy (route protection)

`proxy.ts` is a stub for Next.js route proxy logic — uncomment and extend it for authentication, role checks, or redirects. Example use cases are commented in the file (e.g. protecting `/admin` routes).

## Deployment

Works on any platform that supports Next.js (Vercel, Docker, Node.js). The tRPC client auto-detects `VERCEL_URL` for server-side requests in production.

Build and run locally:

```bash
pnpm build
pnpm start
```

## License

Private starter kit — adjust the license when you publish your fork.
