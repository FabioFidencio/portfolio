# Fabio — Frontend Developer Portfolio

A dark, Linear-inspired single-page portfolio built with Angular 22. The page presents selected
work, capabilities, implementation patterns, a design-system specimen, experience, and hiring
details for frontend roles.

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

## Where to edit content

Personal details live in `src/app/portfolio.data.ts`:

- `profile` — name, email, GitHub, LinkedIn
- `featureCode` — shared syntax-highlighted code samples
- `chartBars` — dashboard chart data

All site copy and localized content live in `src/app/translations.ts`:

- `en` and `ptBR` — full copy dictionaries for English and Brazilian Portuguese
- `meta`, `ui`, `profile` — titles, interface labels, role, availability, location
- `projects` — the two real GitHub projects, case studies, results, stacks, and modal content
- `skills` — capability grid, filters, categories, and descriptions
- `engineering` — implementation tabs, code descriptions, architecture cards, principles
- `design` — token list, specimen labels, component and motion previews
- `experience` — independent-project timeline and hiring card copy
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

- `src/app/app.ts` — component state: language, scroll spy, skill filters, tabs, modal, clipboard, mobile menu
- `src/app/app.html` — page template and all CSS-built product mockups
- `src/app/app.css` — global visual system, layout, responsive rules, reduced-motion handling
- `src/app/portfolio.data.ts` — shared types, personal details, code samples, chart data
- `src/app/translations.ts` — EN and PT-BR content dictionaries
- `src/styles.css` — body reset, selection color, modal scroll lock
- `src/index.html` — metadata, theme color, font links
- `DESIGN.md` — the Linear-inspired design specification this build follows

`src/app/app.css` is registered as a global stylesheet in `angular.json`, not as a component
`styleUrl`, so it is not subject to the per-component style budget.

## Design notes

- Canvas: `#010102`, surface ladder from `#0f1011` upward, hairline borders at `#23252a`
- Accent: lavender `#5e6ad2`, used only for primary actions and focus states
- Type: Inter for UI, JetBrains Mono for code and metadata
- Motion is short and functional; `prefers-reduced-motion` disables transforms and loops
- All product screenshots are CSS/HTML mockups, so there are no image assets to maintain
- The language switch uses the same compact surface treatment as the header actions
