# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Astro dev server at http://localhost:4321 (hot-reloads on content edits).
- `npm run cms` — runs `decap-server` on :8081. Required alongside `npm run dev` for the `/admin` editor in local mode (writes commits to disk, not GitHub).
- `npm run build` — static build to `dist/`.
- `npm run preview` — serves the built `dist/` output.
- `npx astro check` — TypeScript + Astro diagnostics. There is no separate lint or test command; type safety comes from Astro's strict tsconfig and Zod schemas.

Node >= 22.12.0 is required (see `package.json` `engines`).

## Architecture

Astro 6 static site (`output: 'static'`) with React and Tailwind 4 (via `@tailwindcss/vite`). Content is Markdown/JSON checked into the repo — no database, no server, no API routes. Edits happen either in the editor or through Decap CMS committing to Git.

### Content layer (the source of truth)

All content lives in `src/content/` and is loaded via Astro Content Collections:

- **Schemas:** `src/content.config.ts` defines three collections with Zod — `site` (JSON singleton), `team` and `projects` (glob of Markdown). Invalid frontmatter breaks the build.
  - Note: the README mentions `src/content/config.ts`; the actual file is `src/content.config.ts` at the `src/` root. Edit that one.
- **Data access:** `src/lib/content.ts` wraps `getCollection`/`getEntry`, normalizes into the types in `src/lib/types.ts`, applies `sort_order`, and returns a `FALLBACK_SETTINGS` object if the site JSON is missing. Pages should use these wrappers rather than calling `astro:content` directly (except for prerender helpers like `getStaticPaths`).
- **Slugs:** a project's URL slug is its entry `id` (the filename minus `.md`). `src/pages/projects/[slug].astro` prerenders one page per entry.
- **Markdown body:** team bios and project descriptions are rendered via `render(entry)` → `<Content />` on the detail page. `getTeamMembers`/`getProjects` also expose `body` as a plain string for list views.

### CMS

- `public/admin/config.yml` is the Decap config. `local_backend: true` makes the editor talk to `decap-server` on localhost; in production it targets the GitHub backend via Netlify's public OAuth proxy. The GitHub `repo:` value needs to be pointed at the deployed repo before shipping.
- `src/pages/admin/index.astro` is the prerendered Decap shell; it loads Decap from a CDN and points at `/admin/config.yml`.
- Uploaded media is written to `public/uploads/` and served at `/uploads/*`.

### Styling / visual system

- Tailwind 4 is configured entirely via CSS in `src/styles/global.css` using `@theme` (colors, fonts) — there is no `tailwind.config.*`. The dark "AI / terminal / 8-bit" aesthetic relies on custom utility classes defined in that file (e.g. `.px-frame`, `.px-inner`, `.px-btn`, `.chip`, `.glow-cyan`, `.font-pixel`, `.hr-dashed`). Prefer extending these classes over inventing new ones.
- `src/lib/fx.ts` produces **deterministic** cosmetic values (hex IDs, fake byte counts, fake RTTs, binary columns) seeded from entry IDs/slugs. It is decorative only — do not treat its output as real telemetry, and keep it deterministic so SSR output is stable.
- `src/lib/cn.ts` exports the standard `cn()` helper (`clsx` + `tailwind-merge`).

### Routing

Pages in `src/pages/` map 1:1 to URLs. `Layout.astro` pulls site settings once and injects header/footer; pass `hideChrome` for bare pages. The `@/*` path alias maps to `src/*` (see `tsconfig.json`).

## Conventions

- **Adding content:** create a Markdown file under `src/content/team/` or `src/content/projects/` with the frontmatter shape enforced by `src/content.config.ts`. `sort_order` controls display order; lower = earlier. The filename becomes the slug.
- **New site fields:** update the Zod schema in `src/content.config.ts`, the normalizer in `src/lib/content.ts`, the `types.ts` type, and the Decap field list in `public/admin/config.yml` — all four must stay in sync or the build / CMS will break.
- **Windows quirk:** `astro.config.mjs` enables Vite `watch.usePolling` because Decap's file writes race chokidar on Windows and cause ENOENT on `.astro/*.tmp`. Don't remove this without testing on Windows.
