# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal portfolio site built with Next.js 16 (App Router), currently just the `create-next-app` scaffold — `app/page.tsx` has not been customized yet. Static export only, no backend.

## Commands

```bash
npm run dev      # start dev server (Turbopack, on by default in Next 16)
npm run build    # next build -> static export to out/
npm run start    # serve a production build (next start; not used in deployment, see below)
npm run lint     # eslint (the `next lint` subcommand was removed in Next 16)
```

There is no test suite configured.

## Architecture

- **App Router, static export.** `next.config.ts` sets `output: "export"` and `images.unoptimized: true`. This means the whole app is prerendered to static HTML/CSS/JS in `out/` at build time — no Next.js server runs in production. Server Actions, Route Handlers with request-time logic, cookies/headers, redirects/rewrites, proxy/middleware, and default `next/image` optimization are all unavailable. Keep new pages statically renderable (any dynamic route needs `generateStaticParams()`).
- **Deployment path:** `Dockerfile` is a two-stage build — `npm ci && npm run build` in a `node:20-alpine` builder, then the resulting `out/` directory is copied straight into an `nginx:alpine` image (`/usr/share/nginx/html`). There's no custom nginx config, so this relies on nginx's default `index.html`/directory serving; there's no `try_files` rewrite for clean URLs on nested routes.
- **CI/CD:** `.github/workflows/deploy.yml` runs on every push to `master` and SSHes into the VPS to `git pull` and `docker compose up -d --build`. `docker-compose.yml` runs the site behind Traefik (labels route `thiraj.space` / `www.thiraj.space` over TLS to container port 80). There is no separate CI build/test step — pushing to `master` deploys directly.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.*` — v4 is CSS-first). Theme tokens and dark-mode override live in `app/globals.css` using `@theme inline` and `prefers-color-scheme`. Fonts are `next/font/google` (Geist / Geist Mono), wired up as CSS variables in `app/layout.tsx`.

## Working with this Next.js version

Next.js 16 has meaningful breaking changes from older versions/training data — check `node_modules/next/dist/docs/01-app/` before relying on prior knowledge, particularly:

- `params`/`searchParams` (and the image/sitemap generation function props) are async everywhere — always `await` them, no synchronous fallback exists anymore.
- `middleware.ts` is renamed `proxy.ts` (irrelevant here anyway since static export doesn't support proxy).
- ESLint uses flat config (`eslint.config.mjs`) — there is no `next lint`.
- Given `output: "export"`, don't introduce Route Handlers, Server Actions, `cookies()`/`headers()`, or default-loader `next/image` optimization — none of it will work in the deployed build.

## Rules

- **Keep the site light and smooth.** Watch bundle size and runtime performance on every change — optimize images (`next/image` with explicit `width`/`height`), avoid unnecessary client-side JS/`"use client"`, lazy-load anything heavy, and prefer CSS over JS for animation/interaction where possible.
- **Follow coding best practices.** Idiomatic, type-safe TypeScript; no dead code; keep components small and readable; match existing conventions in this repo rather than inventing new ones.
- **Treat security as a first-class concern.** Sanitize/validate any external input, avoid `dangerouslySetInnerHTML` unless unavoidable and sanitized, keep dependencies minimal and current, never commit secrets or credentials, and be mindful that this is a public static site (everything shipped is visible to anyone).
- **Never `git commit` or `git push` without asking first.** Always confirm with the user immediately before running either, even if a prior commit/push was just approved.
