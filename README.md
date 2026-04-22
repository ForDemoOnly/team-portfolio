# Team Portfolio

A small, fast team portfolio site. Content lives as plain Markdown / JSON in the repo, edited either in your editor or via a web UI at `/admin`.

- **Public site** — Astro + Tailwind, statically built, reads from `src/content/`.
- **Content** — [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/), type-safe via Zod.
- **Web editor** — [Decap CMS](https://decapcms.org) at `/admin`, commits edits straight into Git.
- **No database, no server, no secrets.** Deploys anywhere that serves static files.

The design is an AI / terminal / networking / 8-bit / bytes mashup, dark by default.

## Quick start

```bash
npm install
npm run dev         # public site at http://localhost:4321
```

The three sample team members and three sample projects ship with the repo — you'll see them immediately. Edit them in two ways:

### Option A — edit Markdown directly

Open `src/content/` in your editor:

- `site/default.json` — team name, tagline, socials, about copy
- `team/*.md` — one file per person (frontmatter = name/role/photo/socials, body = bio)
- `projects/*.md` — one file per project (frontmatter = meta, body = description)

Save. The dev server hot-reloads.

### Option B — edit in the browser (Decap CMS)

Run the CMS bridge alongside the dev server:

```bash
npm run cms        # starts decap-server on :8081 (keep running)
npm run dev        # in another terminal
```

Open <http://localhost:4321/admin>. Edits write straight to `src/content/` on your disk. No auth needed in local mode.

## Deploy to Vercel

`npm run build` produces a fully static site in `dist/`. We deploy it on Vercel; the `/admin` editor commits straight to GitHub so the team can edit content after launch without redeploying manually.

### 1. Push the repo to GitHub

```bash
git init
git add .
git commit -m "initial"
git branch -M main
gh repo create team-portfolio --public --source=. --remote=origin --push
```
(Or use github.com's "New repository" UI.)

### 2. Create the Vercel project

1. Go to <https://vercel.com> → **Add New → Project** → pick the repo.
2. Vercel auto-detects Astro. Defaults are correct:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
3. Click **Deploy**. You'll get a URL like `team-portfolio.vercel.app`. Every push to `main` redeploys automatically.

### 3. Register a GitHub OAuth app (for `/admin` editing)

<https://github.com/settings/applications/new>:

- **Application name:** anything (e.g. "Portfolio CMS")
- **Homepage URL:** `https://team-portfolio.vercel.app` (your Vercel URL)
- **Authorization callback URL:** `https://api.netlify.com/auth/done`

After creating, note the **Client ID** and **Client Secret**.

### 4. Connect the OAuth app to Netlify's free proxy

We don't host our own OAuth server — Netlify exposes one for free at `api.netlify.com`. Register your OAuth app with it:

1. Sign in at <https://app.netlify.com> (free account).
2. **User settings → Applications → OAuth apps → Install provider**.
3. Pick **GitHub**. Paste the Client ID + Client Secret from step 3. Save.

That's it — no Netlify site needed. Netlify just brokers the OAuth handshake.

### 5. Point Decap at your repo

Edit `public/admin/config.yml` — replace the `CHANGEME-*` values with your GitHub user and repo name:

```yaml
backend:
  name: github
  repo: your-github-user/team-portfolio   # <-- edit
  branch: main
  base_url: https://api.netlify.com
  auth_endpoint: auth
```

Commit and push. Vercel redeploys.

### 6. Use it

Visit `https://team-portfolio.vercel.app/admin`:

1. "Login with GitHub" → authorize the OAuth app.
2. Edit content like you did locally.
3. Click **Publish** → Decap commits to `main`.
4. Vercel detects the push and rebuilds in ~1 minute.

Only collaborators on the GitHub repo can sign in and commit, so access control is whatever you set on the repo.

### Custom domain

In Vercel's project dashboard: **Settings → Domains → Add**. Follow the DNS instructions they print (one A record, or one CNAME for a subdomain). HTTPS is automatic.

Update the GitHub OAuth app's Homepage URL to the new domain once it's live.

## Project structure

```
src/
├── content/
│   ├── config.ts           # Zod schemas for all 3 collections
│   ├── site/default.json   # site settings (singleton)
│   ├── team/*.md           # one file per person
│   └── projects/*.md       # one file per project
├── pages/
│   ├── index.astro         # home
│   ├── about.astro
│   ├── team.astro
│   ├── contact.astro
│   └── projects/
│       ├── index.astro     # all projects
│       └── [slug].astro    # project detail (prerendered)
├── components/public/      # header + footer
├── layouts/Layout.astro
├── lib/
│   ├── content.ts          # getCollection wrappers
│   ├── fx.ts               # deterministic bytes/rtt/hex decor
│   └── types.ts
└── styles/global.css
public/
├── admin/
│   ├── index.html          # Decap CMS shell
│   └── config.yml          # collections + widgets
└── uploads/                # image uploads land here
```

## Editing content

### Adding a team member

Create `src/content/team/jane.md`:
```yaml
---
name: Jane Doe
role: Design Lead
photo: /uploads/jane.jpg
sort_order: 3
socials:
  github: https://github.com/jane
  linkedin: https://linkedin.com/in/jane
---

Short bio here. Plain text, one line or several paragraphs.
```

Drop the photo into `public/uploads/jane.jpg` (or upload it via Decap). The Team page picks it up automatically, sorted by `sort_order`.

### Adding a project

Create `src/content/projects/my-slug.md`:
```yaml
---
title: My Project
summary: One-line pitch.
image: /uploads/my-project.png
link_url: https://example.com
tech_stack:
  - TypeScript
  - Postgres
featured: true
sort_order: 1
---

Longer description. Shown on the project detail page.
```

The filename (minus `.md`) becomes the URL slug: `/projects/my-slug`.

### Editing the site settings

`src/content/site/default.json` is a single JSON document. Edit it in place or through Decap.

## Notes

- All three collections are validated by Zod in `src/content/config.ts`. Invalid frontmatter breaks the build — fix and rebuild.
- Every edit via Decap becomes a commit on the configured branch. Review history with `git log` and roll back with `git revert` if needed.
- The site is fully static, so changes go live only after a rebuild / redeploy. On Vercel / Netlify that's automatic on each commit.

## Next steps (optional)

- Proper Markdown rendering in bios and project descriptions (swap the string body for `<Content />` from `astro:content`).
- Multi-language content (Astro i18n + per-locale folders).
- Contact form with email delivery (Formspree, Resend, etc.).
- Rich media embeds inside project bodies (MDX instead of plain Markdown).
