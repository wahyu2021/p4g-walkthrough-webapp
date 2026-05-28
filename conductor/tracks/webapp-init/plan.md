# Implementation Plan: Init Web App

## Phase 1: Vite & React Setup
1. Change directory to project root.
2. Run Vite scaffolding: `npm create vite@latest webapp -- --template react-ts`.
3. Navigate into `webapp/` and run `npm install`.

## Phase 2: Tailwind CSS v4 Configuration
1. Install Tailwind v4 dependencies: `npm install tailwindcss @tailwindcss/vite`.
2. Update `vite.config.ts` to include `tailwindcss()` plugin.
3. Update `src/index.css` to include `@import "tailwindcss";` and P4G specific theme variables (`@theme { --color-p4-yellow: #F5D100; ... }`).

## Phase 3: Project Structure & Clean Up
1. Delete boilerplate files (`App.css`, `assets/react.svg`).
2. Create Atomic Design directories inside `src/`:
   - `components/atoms`
   - `components/molecules`
   - `components/organisms`
   - `components/templates`
   - `pages`
   - `hooks`
   - `types`
   - `utils`
   - `data`
3. Copy `data/walkthrough.json` from the root project data folder to `src/data/walkthrough.json`.
4. Create a `GEMINI.md` file inside the `webapp/` directory containing the project's core rules (Atomic Design, Clean Code, Tailwind v4 guidelines) based on the Product Guidelines.

## Phase 4: Verification Component
1. Create a `Button` atom (`src/components/atoms/Button.tsx`) styled with Tailwind classes (e.g., yellow background, black text).
2. Update `src/App.tsx` to render the `Button` atom and verify styling.
3. Ensure no linting or TypeScript errors exist.