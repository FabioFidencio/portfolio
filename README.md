# Fabio — Frontend Developer Portfolio

A dark, Linear-inspired single-page portfolio built with Angular 22. The page presents selected
work, capabilities, implementation patterns, a live analytics dashboard, a design-system specimen,
experience, and hiring details for frontend roles.

## Stack

- Angular 22 (standalone component, signals, built-in control flow)
- TypeScript
- Hand-written CSS with a token-based design system
- Inter and JetBrains Mono via Google Fonts
- No UI kit, component library, or CSS framework

## Run locally

```bash
npm install
npm run start
```

Open `http://localhost:4200/`.

```bash
npm run build   # production build in dist/home-page
npm test        # unit tests
```

## Deploy

The project is configured for Cloudflare Workers static assets in `wrangler.toml`.

```bash
npm run build     # produces dist/home-page/browser
npm run preview   # build and preview with Wrangler locally
npm run deploy    # build and deploy manually with Wrangler
```

For Cloudflare Workers Builds, use `npm run build` as the build command and
`npx wrangler deploy` as the deploy command.

## Profile photo and site icon

- **Photo** — replace `public/profile.jpg` with your own image (square works best; it is cropped to
  a circle at 76px). If the file is missing, the hero falls back to the `FF` initials.
- **Icon** — the browser icon is `public/favicon.svg`, an `F` monogram with the lavender accent.
  `public/favicon.ico` remains as a fallback for older browsers.

## Google Analytics

GA4 is implemented through `src/app/core/analytics.service.ts` and configured in
`src/app/core/analytics.config.ts`.

1. Create a GA4 web data stream and copy its Measurement ID (`G-…`).
2. Replace `G-XXXXXXXXXX` in `src/app/core/analytics.config.ts`.
3. Deploy. The service injects `gtag.js`, sends `page_view`, and streams every custom event.

Every component calls `trackComponentView()` on creation and records its meaningful interactions
(navigation, CTAs, filters, tabs, project modal, email copy, language change). The **Analytics**
section is a live dashboard fed by the same service: page views, event count, per-component views,
recent events, and a code sample of the implementation.

Until a real Measurement ID is set, the site runs in **local mode** — events appear in the dashboard
but are not sent to Google. No cookies or personal content are tracked; event parameters only carry
component names, interface actions, and the current locale.

## Where to edit content

Personal details live in `src/app/portfolio.data.ts`:

- `profile` — name, email, GitHub, LinkedIn
- `resume` — downloadable résumé: drop your PDF at `public/resume/fabio-fidencio-resume.pdf`
  (or paste any hosted URL into `href`); `fileName` controls the saved file name
- Email CTAs open a pre-filled Gmail compose window (subject: work partnership); the address comes
  from `profile.email`, and résumé buttons now download the PDF instead of emailing a request
- `featureCode` — shared syntax-highlighted code samples
- `chartBars` — dashboard chart data

All site copy and localized content live in `src/app/translations.ts`:

- `en` and `ptBR` — full copy dictionaries for English and Brazilian Portuguese
- `meta`, `ui`, `profile` — titles, interface labels, role, availability, location
- `projects` — the two real GitHub projects, case studies, results, stacks, and modal content
- `skills` — capability grid, filters (including AI and data), categories, and descriptions
- `engineering` — implementation tabs, code descriptions, architecture cards, principles
- `analytics` — dashboard labels, status copy, setup notes
- `design` — token list, specimen labels, component and motion previews
- `experience` — career timeline from CISS (2017) through Eletrisul and Ítalo, plus hiring card copy
- `mockups` — dashboard, Stock Manager, and Cooking Up product UI labels
- `siteContent` — maps each language to its dictionary

## Projects

The work section only lists repositories that exist on
[github.com/FabioFidencio](https://github.com/FabioFidencio):

- **Stock Manager** — a React Native / Expo inventory app with Firebase Auth, Realtime Database,
  product images, stock movements, and low/zero/negative stock summaries.
- **Cooking Up** — a Vue 3 / Vite recipe finder driven by the ingredients you select.

Both are presented honestly as independent projects. No employers, metrics, or outcomes are
invented.

## Languages

The header language switch toggles between **EN** and **PT-BR**. The choice is saved to
`localStorage` under `portfolio-language` and is restored on the next visit. If no preference is
stored, the site follows the browser language and starts in Portuguese for `pt-*` locales.

Changing the language updates the whole page, the document `<html lang>` attribute, the page title,
and the description/Open Graph meta tags.

## Structure

- `src/app/app.ts` / `app.html` — application shell: scroll progress and section composition
- `src/app/components/site-header/` — sticky navigation, scroll spy, language switch, mobile menu
- `src/app/components/hero-section/` — headline, profile photo slot, dashboard mockup
- `src/app/components/stack-strip/` — core stack marquee
- `src/app/components/work-section/` — selected work and project case-study modal host
- `src/app/components/project-modal/` — accessible case-study dialog and focus management
- `src/app/components/skills-section/` — capability list and category filters
- `src/app/components/engineering-section/` — implementation tabs, architecture, principles
- `src/app/components/analytics-section/` — live GA4-style dashboard and implementation sample
- `src/app/components/design-section/` — design-system specimen
- `src/app/components/experience-section/` — timeline and hiring card
- `src/app/components/contact-section/` — contact CTA, clipboard, social links
- `src/app/components/site-footer/` — footer navigation and metadata
- `src/app/core/analytics.service.ts` — GA4 loading, event buffer, component-view counters
- `src/app/core/analytics.config.ts` — Measurement ID and debug switch
- `src/app/core/language.service.ts` — EN/PT-BR signal, persistence, title and meta updates
- `src/app/core/links.ts` — shared email helpers (Gmail compose + `mailto`)
- `src/app/portfolio.data.ts` — shared types, personal details, code samples, chart data
- `src/app/translations.ts` — EN and PT-BR content dictionaries
- `src/app/app.css` — global visual system, layout, responsive rules, reduced-motion handling
- `src/styles.css` — body reset, selection color, modal scroll lock
- `src/index.html` — metadata, theme color, fonts, favicon links
- `DESIGN.md` — the Linear-inspired design specification this build follows

`src/app/app.css` is registered as a global stylesheet in `angular.json`, not as a component
`styleUrl`, so it is not subject to the per-component style budget. Components are standalone and
own their templates and interaction state.

## Design notes

- Canvas: `#010102`, surface ladder from `#0f1011` upward, hairline borders at `#23252a`
- Accent: lavender `#5e6ad2`, used only for primary actions and focus states
- Type: Inter for UI, JetBrains Mono for code and metadata
- Motion is short and functional; `prefers-reduced-motion` disables transforms and loops
- All product screenshots are CSS/HTML mockups, so there are no image assets to maintain
- The language switch uses the same compact surface treatment as the header actions
